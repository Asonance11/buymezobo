# Base image
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory
WORKDIR /app

# Copy project files to the container
COPY . .

# Dependencies stage
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Copy the production dependencies
COPY --from=prod-deps /app/node_modules /app/node_modules

# Copy the built application
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public

# Set up a user for running the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the server.js file for the socket server
COPY --chown=nextjs:nodejs server.js ./

# Set the user
USER nextjs

# Expose the necessary port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]


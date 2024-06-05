#--------------------------------------------------------------------------------------------------------------------------------
FROM node:lts-alpine AS base 

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

#--------------------------------------------------------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


#--------------------------------------------------------------------------------------------------------------------------------
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules 
COPY . .
RUN pnpm exec prisma generate


#--------------------------------------------------------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm exec prisma generate
RUN pnpm run build

# Production image, copy all the files and run next
#--------------------------------------------------------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# socket server
COPY --chown=nextjs:nodejs server.js ./

USER nextjs

#CMD ["node", "server.js"] # original startup command
CMD ["node", "server.js", "&", "node", "./.next/standalone/server.js"]

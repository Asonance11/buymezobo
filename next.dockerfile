#--------------------------------------------------------------------------------------------------------------------------------
FROM node:lts-alpine AS base 

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

#--------------------------------------------------------------------------------------------------------------------------------
FROM base AS deps


RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

#RUN corepack install

# RUN pnpm --version; \
#      pnpm setup; \
#      pnpm bin -g &&\
#      # Install dependencies
#      pnpm add -g pm2 &&\
#      pnpm install

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi


#--------------------------------------------------------------------------------------------------------------------------------
FROM base AS dev
WORKDIR /app
#We copy over the deps from our install stage & copy the rest of the source code into the image. 
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

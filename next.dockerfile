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
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm add concurrently


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

# Set environment variable for build, uploadthing asks for key at buildtime, which breaks github action that has no access to .env file
ARG UPLOADTHING_SECRET
ENV UPLOADTHING_SECRET=${UPLOADTHING_SECRET}

RUN pnpm next build
RUN chmod +x /app/entrypoint.sh

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

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh .


USER nextjs

CMD ["./entrypoint.sh"]

# syntax=docker/dockerfile:1

# =======================================================
# 1. Shared base
# =======================================================
FROM node:22-bookworm-slim AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        openssl \
    && rm -rf /var/lib/apt/lists/*


# =======================================================
# 2. Install dependencies
# =======================================================
FROM base AS dependencies

COPY package.json package-lock.json ./

RUN npm ci


# =======================================================
# 3. Build the Next.js application
# =======================================================
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# These values are public browser configuration.
# They will be embedded into the Next.js client bundle.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Generate the Prisma Client.
#
# prisma.config.ts reads DIRECT_URL, so a fake syntactically valid
# URL is provided only during generation.
RUN DIRECT_URL="postgresql://docker_build:docker_build@127.0.0.1:5432/docker_build" \
    npx prisma generate

# Build the Next.js standalone application.
#
# The database URLs below are fake build-time placeholders.
# The real DATABASE_URL and DIRECT_URL will only be provided
# when the containers run.
RUN DATABASE_URL="postgresql://docker_build:docker_build@127.0.0.1:5432/docker_build" \
    DIRECT_URL="postgresql://docker_build:docker_build@127.0.0.1:5432/docker_build" \
    npm run build


# =======================================================
# 4. Prisma production migration image
# =======================================================
FROM base AS migrate

COPY --from=dependencies /app/node_modules ./node_modules

COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# DIRECT_URL will be supplied at runtime through Docker Compose.
CMD ["npx", "prisma", "migrate", "deploy"]


# =======================================================
# 5. Next.js production runtime image
# =======================================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        openssl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Static public assets
COPY --from=builder --chown=nextjs:nodejs \
    /app/public ./public

# Minimal standalone Next.js server and traced dependencies
COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/standalone ./

# Next.js static build assets are not copied into standalone automatically
COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/static ./.next/static

# Preserve the custom Prisma Client output directory
COPY --from=builder --chown=nextjs:nodejs \
    /app/generated ./generated

# Allow Next.js to create runtime cache files
RUN mkdir -p /app/.next/cache \
    && chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
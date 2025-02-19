# syntax = docker/dockerfile:1
FROM node:22-slim AS base

ARG PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Dependencies
FROM base AS dependencies

COPY package.json pnpm-lock.json ./
RUN pnpm i

# Build
FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Public build-time environment variables
#ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
#ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

RUN pnpm build

# Run
FROM base AS run

ENV NODE_ENV=production
ENV PORT=$PORT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"
CMD ["next", "start"]

# docker build -t my-app .
#docker build -t my-app --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key_here .
# Production Dockerfile for Shopify App (React Router)
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package.json yarn.lock .yarnrc.yml ./

# Copy workspace package files
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY apps/shopify-app/package.json ./apps/shopify-app/

# Copy Prisma schema for generation
COPY packages/database/prisma ./packages/database/prisma

# Enable Corepack and install dependencies
RUN corepack enable && yarn install --immutable

# Generate Prisma client
RUN cd packages/database && npx prisma generate

# Builder stage - build the React Router app
FROM base AS builder
WORKDIR /app

# Copy root package files
COPY package.json yarn.lock .yarnrc.yml ./

# Copy workspace package files
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY apps/shopify-app/package.json ./apps/shopify-app/

# Enable Corepack and install ALL dependencies (including devDependencies for build)
RUN corepack enable && yarn install --immutable

# Copy shared packages source
COPY packages/core ./packages/core
COPY packages/database ./packages/database

# Copy tsconfig.base.json (required for build)
COPY tsconfig.base.json ./

# Build shared packages
WORKDIR /app/packages/core
RUN yarn build

WORKDIR /app/packages/database
RUN npx prisma generate && yarn build

# Copy app source
WORKDIR /app
COPY apps/shopify-app ./apps/shopify-app

# Set working directory to app
WORKDIR /app/apps/shopify-app

# Build the React Router app
ENV NODE_ENV=production
RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 shopify-app

# Copy built application
COPY --from=builder --chown=shopify-app:nodejs /app/apps/shopify-app/build ./build
COPY --from=builder --chown=shopify-app:nodejs /app/apps/shopify-app/package.json ./package.json

# Copy shared packages
COPY --from=builder --chown=shopify-app:nodejs /app/packages ./packages

# Copy production dependencies
COPY --from=deps --chown=shopify-app:nodejs /app/node_modules ./node_modules

# Copy package.json files for workspace resolution
COPY --from=builder --chown=shopify-app:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=shopify-app:nodejs /app/yarn.lock /app/yarn.lock

USER shopify-app

EXPOSE 8080

# Set environment variables for production
ENV HOST=0.0.0.0
ENV PORT=8080

# Start the React Router server
CMD ["node", "build/server/index.js"]


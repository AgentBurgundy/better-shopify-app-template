# Shopify App

This is the main Shopify application that uses the shared packages.

## Getting Started

1. Install dependencies from the root:
   ```bash
   yarn install
   ```

2. Set up your environment:
   ```bash
   cp env.example .env
   # Edit .env with your Shopify credentials
   ```

3. Generate Prisma client and run migrations:
   ```bash
   yarn db:generate
   yarn db:migrate
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

## Project Structure

- `app/` - Application code
  - `routes/` - React Router routes
  - `db.server.ts` - Database client (imports from @myapp/database)
  - `shopify.server.ts` - Shopify app configuration
- `env.example` - Environment variables template
- `shopify.app.toml` - Shopify CLI configuration

## Using Shared Packages

This app imports from two shared packages:

### @myapp/core
Contains shared utilities and configuration:
```typescript
import { createAppConfig } from '@myapp/core';
```

### @myapp/database
Contains Prisma client and database utilities:
```typescript
import { prisma, db } from '@myapp/database';
```


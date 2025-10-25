# @myapp/database

Shared database package with Prisma ORM for all apps in the workspace.

## Features

- **Singleton Prisma Client** - Prevents connection pool exhaustion
- **Session Storage** - Shopify session management
- **Type-Safe Models** - Full TypeScript support

## Usage

```typescript
import { prisma, db } from '@myapp/database';

// Both prisma and db are the same client instance
const shops = await prisma.shop.findMany();
const shop = await db.shop.findUnique({
  where: { shopDomain: 'example.myshopify.com' }
});
```

## Schema

The Prisma schema includes:
- `Session` - Shopify session storage
- `Shop` - Store information and settings

Add your own models to `prisma/schema.prisma`.

## Scripts

```bash
# Generate Prisma client
yarn prisma:generate

# Create and run migrations
yarn prisma:migrate

# Deploy migrations (production)
yarn prisma:deploy

# Open Prisma Studio
yarn prisma:studio
```

## Configuration

Set `DATABASE_URL` in your environment:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
```


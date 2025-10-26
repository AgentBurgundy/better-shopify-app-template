# Shopify App

This is the main Shopify app built with [React Router](https://reactrouter.com/) and [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge).

## Features

- 🚀 Built with React Router v7+
- 🔐 Shopify App Bridge integration for embedded apps
- 💾 Database package via `@myapp/database` (Prisma + PostgreSQL)
- 🛠️ Shared utilities via `@myapp/core`
- 📝 Full TypeScript support
- 🎨 Polaris design system
- 🐳 Docker-ready with development & production Dockerfiles

## Development

### Local Development with Shopify CLI

The easiest way to develop your Shopify app:

```bash
# From workspace root
yarn workspace @myapp/shopify-app dev

# Or from this directory
cd apps/shopify-app
shopify app dev
```

This will:
- Start the Vite dev server with HMR
- Create a tunnel to your local server (via Cloudflare or ngrok)
- Open your app in a development store

### Docker Development

See the root [README.md](../../README.md#docker-support) for Docker setup instructions.

## Building

```bash
# Build for production
yarn build

# Or from workspace root
yarn workspace @myapp/shopify-app build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

See `env.example` for required environment variables.

For Shopify CLI development, the CLI will automatically manage most environment variables for you.

## Project Structure

```
apps/shopify-app/
├── app/                    # Application code
│   ├── routes/             # React Router routes
│   ├── shopify.server.ts   # Shopify app configuration
│   ├── db.server.ts        # Database client (imports from @myapp/database)
│   └── root.tsx            # Root layout
├── public/                 # Static assets
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── shopify.app.toml        # Shopify app configuration
└── vite.config.ts          # Vite configuration
```

## Available Scripts

- `yarn dev` - Start development server with Shopify CLI
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Lint code with ESLint
- `yarn generate` - Generate app extensions with Shopify CLI
- `yarn deploy` - Deploy app to production
- `yarn clean` - Clean build artifacts

## Authenticating and Querying Data

To authenticate and query the Shopify Admin API:

```typescript
import { shopify } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await shopify.authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      products(first: 25) {
        nodes {
          id
          title
          description
        }
      }
    }
  `);

  const data = await response.json();
  return json(data);
}
```

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

## Resources

- [Shopify App React Router Docs](https://shopify.dev/docs/api/shopify-app-react-router)
- [React Router Docs](https://reactrouter.com/)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge)
- [Monorepo README](../../README.md)

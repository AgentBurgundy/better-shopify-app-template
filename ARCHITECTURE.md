# Architecture Overview

This template uses a monorepo architecture with yarn workspaces to separate concerns and improve maintainability.

## Project Structure

```
shopify-app-template/
├── apps/                      # Applications
│   └── shopify-app/          # Main Shopify app
│       ├── app/              # Application code
│       │   ├── routes/       # React Router routes
│       │   ├── db.server.ts  # Database client wrapper
│       │   └── shopify.server.ts # Shopify configuration
│       └── package.json      # App dependencies
│
├── packages/                 # Shared packages
│   ├── core/                # Core utilities
│   │   ├── src/
│   │   │   ├── config.ts   # Environment config
│   │   │   └── index.ts    # Package exports
│   │   └── package.json
│   │
│   └── database/            # Database layer
│       ├── prisma/
│       │   └── schema.prisma # Database schema
│       ├── src/
│       │   ├── client.ts   # Prisma singleton
│       │   └── index.ts    # Package exports
│       └── package.json
│
└── package.json             # Workspace root
```

## Design Principles

### 1. Separation of Concerns

**@myapp/core**
- Configuration management
- Shared utilities
- Business logic that's app-agnostic

**@myapp/database**
- Prisma schema and client
- Database utilities
- Repository patterns (optional)

**@myapp/shopify-app**
- Shopify-specific logic
- UI components
- Routes and API endpoints

### 2. Dependency Direction

```
shopify-app → database → prisma
     ↓
   core
```

- Apps depend on packages
- Packages don't depend on apps
- Core has minimal dependencies

### 3. Type Safety

All packages use TypeScript with strict mode for:
- Compile-time type checking
- Better IDE support
- Reduced runtime errors

## Data Flow

### Authentication Flow

```
User → Shopify OAuth → shopify.server.ts → afterAuth hook → prisma.shop.upsert()
```

### Request Flow

```
User Request
  ↓
React Router Route (app/routes/)
  ↓
Loader/Action Function
  ↓
Database Query (via @myapp/database)
  ↓
Response
```

## Key Technologies

### React Router v7
- File-based routing
- Server-side rendering
- Type-safe loaders/actions

### Prisma ORM
- Type-safe database access
- Migration management
- Schema-first approach

### Yarn Workspaces
- Monorepo management
- Shared dependencies
- Cross-package development

## Adding Features

### New Database Model

1. Edit `packages/database/prisma/schema.prisma`
2. Run `yarn db:migrate`
3. Use in any app via `import { prisma } from '@myapp/database'`

### New Utility Function

1. Add to `packages/core/src/my-utility.ts`
2. Export from `packages/core/src/index.ts`
3. Use in any app via `import { myUtility } from '@myapp/core'`

### New Route

1. Add file to `apps/shopify-app/app/routes/`
2. React Router automatically picks it up
3. Use loaders for data fetching

## Build Process

### Development
```bash
yarn dev
```
- Shopify CLI starts
- Vite watches for changes
- Hot module replacement

### Production
```bash
yarn build
```

Uses `yarn workspaces foreach -At run build`:
- `-A` = All workspaces
- `-t` = **Topological order** (respects dependencies)

Build order (automatic):
1. Builds @myapp/core (tsc)
2. Builds @myapp/database (prisma generate + tsc)
3. Builds @myapp/shopify-app (react-router build)

No manual dependency management needed!

## Database Strategy

### Session Storage
- Shopify sessions stored in `sessions` table
- Managed by `PrismaSessionStorage`

### Shop Data
- One record per shop in `shops` table
- Created/updated in `afterAuth` hook
- Stores settings as JSON

### Extending Schema
- Add models as needed
- Use relations for data integrity
- Index frequently queried fields

## Security Considerations

- API keys in environment variables
- Session tokens in database
- Shopify handles OAuth flow
- Validate all webhook requests

## Performance Tips

- Prisma client is a singleton
- Database connection pooling
- Server-side rendering for better UX
- Use Prisma's connection pool settings for production

## Testing Strategy

- Unit tests for utilities in packages/core
- Integration tests for database operations
- E2E tests for critical user flows
- Mock Shopify APIs in tests

## Deployment

### Docker Architecture

The template includes two Dockerfiles:

**`Dockerfile` (Production)**
- Multi-stage build for optimized size
- Builds packages in order: core → database → shopify-app
- Creates non-root user for security
- Final image ~150MB using Alpine Linux
- Includes only production dependencies

**`Dockerfile.dev` (Development)**
- Single-stage build with hot reload support
- Mounts source code as volumes
- Includes all dev dependencies
- Automatically runs database migrations on start

**`docker-compose.yml`**
- PostgreSQL database with health checks
- App container with volume mounts
- Automatic migration on startup
- Port 3000 exposed for development

### Deployment Platforms

Recommended platforms:
- **Google Cloud Run** - Serverless, auto-scaling (Use production Dockerfile)
- **AWS ECS/Fargate** - Container orchestration
- **Heroku** - Easy deployment with `heroku container:push`
- **Railway** - Detects Dockerfile automatically
- **Fly.io** - Edge deployment with global distribution

Required for all platforms:
- PostgreSQL database (or compatible)
- Environment variables configured
- Prisma migrations deployed (`yarn db:deploy`)

### Container Build Process

```
1. Install dependencies (cached layer)
2. Copy Prisma schema
3. Generate Prisma client
4. Build @myapp/core
5. Build @myapp/database  
6. Build @myapp/shopify-app
7. Copy production artifacts
8. Set up non-root user
9. Configure entrypoint
```

See [DOCKER.md](DOCKER.md) for detailed deployment instructions.


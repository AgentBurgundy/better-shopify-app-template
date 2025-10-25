# Shopify App Template with Yarn Workspaces

A clean, modern Shopify app template using yarn workspaces with decoupled packages for better organization and maintainability.

## 🏗️ Project Structure

```
shopify-app-template/
├── apps/
│   └── shopify-app/          # Main Shopify application
│       ├── app/
│       │   ├── routes/       # React Router routes
│       │   ├── db.server.ts  # Database client
│       │   └── shopify.server.ts
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   ├── core/                 # Shared utilities
│   │   ├── src/
│   │   │   ├── config.ts    # Configuration management
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── database/            # Database & Prisma
│       ├── prisma/
│       │   └── schema.prisma
│       ├── src/
│       │   ├── client.ts    # Prisma client singleton
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json             # Root workspace config
└── tsconfig.base.json       # Shared TypeScript config
```

## ✨ Features

- **🎯 Yarn Workspaces** - Monorepo setup with shared packages
- **📦 Decoupled Packages** - Separate core and database packages
- **🔐 Prisma ORM** - Type-safe database access
- **⚛️ React Router v7** - Modern routing with server-side rendering
- **🎨 Shopify Polaris** - Official Shopify UI components
- **🔄 Session Storage** - Prisma-based session management
- **📝 TypeScript** - Full type safety across all packages
- **🐳 Docker Support** - Development and production Dockerfiles included

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn 4.x (will be set up automatically)
- PostgreSQL database
- Shopify Partner account

### Quick Setup (Recommended)

We provide automated setup scripts that will install all prerequisites and dependencies:

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

These scripts will:
- ✓ Check and install Node.js (via nvm if needed)
- ✓ Check and install Yarn
- ✓ Enable Corepack
- ✓ Install all project dependencies

> **Note:** See [SETUP_SCRIPTS.md](SETUP_SCRIPTS.md) for troubleshooting and detailed script documentation.

### Manual Installation

If you prefer to set up manually:

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd shopify-app-template
   corepack enable
   yarn install
   ```

2. **Set up environment variables:**
   ```bash
   cd apps/shopify-app
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Configure your database:**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/myapp
   ```

4. **Run database migrations:**
   ```bash
   yarn db:generate
   yarn db:migrate
   ```

5. **Start development server:**
   ```bash
   yarn dev
   ```

## 📦 Package Overview

### @myapp/core

Shared utilities and configuration management.

**Usage:**
```typescript
import { createAppConfig } from '@myapp/core';

const config = createAppConfig();
console.log(config.SHOPIFY_API_KEY);
```

### @myapp/database

Database client and Prisma schema.

**Usage:**
```typescript
import { prisma, db } from '@myapp/database';

// Query shops
const shops = await prisma.shop.findMany();

// Create a shop
await db.shop.create({
  data: {
    shopDomain: 'example.myshopify.com',
    accessToken: 'token',
    // ...
  },
});
```

## 🛠️ Available Scripts

From the root directory:

```bash
# Development
yarn dev                  # Start Shopify app in dev mode

# Build
yarn build               # Build all packages in dependency order
                         # (core → database → shopify-app)

# Database
yarn db:generate         # Generate Prisma client
yarn db:migrate          # Run database migrations
yarn db:deploy           # Deploy migrations (production)
yarn db:studio           # Open Prisma Studio

# Maintenance
yarn clean               # Clean all build artifacts
```

**Note:** The build script uses `yarn workspaces foreach -At` where `-t` (topological) ensures packages are built in dependency order automatically.

## 🔧 Configuration

### Shopify App Settings

Edit `apps/shopify-app/shopify.app.toml`:
- Set your app name
- Configure scopes
- Update redirect URLs

### Database Schema

Edit `packages/database/prisma/schema.prisma` to add your models.

After changes:
```bash
yarn db:migrate
```

## 📝 Adding New Packages

1. Create a new directory in `packages/`:
   ```bash
   mkdir packages/my-package
   ```

2. Add a `package.json`:
   ```json
   {
     "name": "@myapp/my-package",
     "version": "1.0.0",
     "private": true,
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts"
   }
   ```

3. Install from apps:
   ```json
   {
     "dependencies": {
       "@myapp/my-package": "*"
     }
   }
   ```

## 🐳 Docker Support

The template includes full Docker support for both development and production.

### Quick Start with Docker Compose

```bash
# Copy environment file
cp env.docker.example .env

# Edit .env with your Shopify credentials

# Start app + database
docker-compose up
```

See [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

## 🏭 Production Deployment

### Without Docker

1. **Build all packages:**
   ```bash
   yarn build
   ```

2. **Deploy database migrations:**
   ```bash
   yarn db:deploy
   ```

3. **Set production environment variables**

4. **Deploy your app** (e.g., to Google Cloud Run, Heroku, etc.)

### With Docker

```bash
# Build production image
docker build -f apps/shopify-app/Dockerfile -t shopify-app:latest .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL="..." \
  -e SHOPIFY_API_KEY="..." \
  -e SHOPIFY_API_SECRET="..." \
  shopify-app:latest
```

## 📚 Tech Stack

- **Framework:** React Router v7
- **UI:** Shopify Polaris
- **Database:** PostgreSQL + Prisma
- **Language:** TypeScript
- **Package Manager:** Yarn Workspaces
- **Build Tool:** Vite

## 🤝 Contributing

This is a template repository. Feel free to customize it for your needs!

## 📄 License

MIT

## 🔗 Resources

- [Shopify App Development](https://shopify.dev/docs/apps)
- [React Router v7](https://reactrouter.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)


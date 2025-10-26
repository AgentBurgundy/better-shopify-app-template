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

We provide an automated setup script that works on all platforms:

```bash
node scripts/setup.js
```

Or use the legacy platform-specific scripts:

**Windows:**
```powershell
.\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✓ Check if Node.js is installed (v18+)
- ✓ Enable Corepack and install Yarn
- ✓ Install all project dependencies

> **Note:** The new `setup.js` is cross-platform and recommended. Legacy scripts are kept for compatibility.

### Rename Your App

After setup, rename the app from `@myapp` to your custom name:

```bash
yarn rename
```

This will interactively prompt you for a new name and update all references throughout the project.

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
# Setup
yarn setup               # Install all prerequisites and dependencies
yarn rename              # Rename app from @myapp to your custom name

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

## 🏗️ Project Architecture

### Monorepo Structure

```
shopify-app-template/
├── apps/shopify-app/          # Main Shopify application
├── packages/
│   ├── core/                  # Shared utilities
│   └── database/              # Prisma ORM + models
└── scripts/                   # Setup & rename scripts
```

### Build Process

The `-t` (topological) flag automatically builds in dependency order:
1. `@myapp/core` → 2. `@myapp/database` → 3. `@myapp/shopify-app`

### Package Imports

```typescript
// In shopify-app
import { createAppConfig } from '@myapp/core';
import { prisma, db } from '@myapp/database';
```

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

### Docker Compose Setup

#### Option 1: With Database Only (Use Shopify CLI for tunneling)

```bash
# Start PostgreSQL only
docker-compose up postgres

# In another terminal, run the app normally
yarn dev
```

#### Option 2: Full Stack with ngrok Tunnel

```bash
# Get your ngrok authtoken from https://dashboard.ngrok.com
# Add to .env file:
NGROK_AUTHTOKEN=your_token_here

# Start everything including ngrok tunnel
docker-compose --profile with-tunnel up

# Access ngrok dashboard at http://localhost:4040
# Use the HTTPS URL shown in ngrok dashboard for your Shopify app
```

#### Option 3: Production Build

```bash
# Build production image
docker build -f apps/shopify-app/Dockerfile -t shopify-app:latest .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e SHOPIFY_API_KEY="your_key" \
  -e SHOPIFY_API_SECRET="your_secret" \
  shopify-app:latest
```

### Docker Files Included

- `Dockerfile` - Production build (multi-stage, optimized)
- `Dockerfile.dev` - Development with hot reload
- `docker-compose.yml` - Database + App + ngrok (optional)
- `ngrok.yml` - ngrok tunnel configuration

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
docker build -f apps/shopify-app/Dockerfile -t shopify-app:la@myapp .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL="..." \
  -e SHOPIFY_API_KEY="..." \
  -e SHOPIFY_API_SECRET="..." \
  shopify-app:la@myapp
```

## 📚 Tech Stack

- **Framework:** React Router v7
- **UI:** Shopify Polaris
- **Database:** PostgreSQL + Prisma
- **Language:** TypeScript
- **Package Manager:** Yarn Workspaces
- **Build Tool:** Vite
- **Deployment:** Docker + Docker Compose

## 🔒 Environment Variables

Create `apps/shopify-app/.env` with:

```env
# Shopify Configuration
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=write_products,read_customers
SHOPIFY_APP_URL=https://your-tunnel.ngrok.io

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# Environment
NODE_ENV=development
```

For Docker, use `.env` in project root with `NGROK_AUTHTOKEN`.

## 🤝 Contributing

This is a template repository. Customize it for your needs:

1. Run `yarn rename` to change from `@myapp` to your app name
2. Update `apps/shopify-app/shopify.app.toml` with your app details
3. Modify the Prisma schema in `packages/database/prisma/schema.prisma`
4. Add your routes in `apps/shopify-app/app/routes/`

## 📄 License

MIT - Free to use for commercial and personal projects

## 🔗 Resources

- [Shopify App Development](https://shopify.dev/docs/apps)
- [React Router v7](https://reactrouter.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [ngrok Documentation](https://ngrok.com/docs)


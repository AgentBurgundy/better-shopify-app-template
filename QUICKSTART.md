# Quick Start Guide

Get your Shopify app running in 5 minutes!

## Step 1: Run Setup Script

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will automatically install all prerequisites (Node.js, Yarn) and dependencies.

**Or install manually:**
```bash
corepack enable
yarn install
```

## Step 2: Set Up Your Shopify App

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a new app
3. Note down your API key and API secret

## Step 3: Configure Environment

```bash
cd apps/shopify-app
cp env.example .env
```

Edit `.env`:
```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=write_products,read_customers
SHOPIFY_APP_URL=https://your-tunnel.ngrok.io
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
```

## Step 4: Set Up Database

Make sure PostgreSQL is running, then:

```bash
# From the root directory
yarn db:generate
yarn db:migrate
```

## Step 5: Start Development Server

```bash
yarn dev
```

This will:
- Start the Shopify CLI
- Create a tunnel (ngrok or cloudflare)
- Open your browser for app installation

## Step 6: Install on Test Store

1. The Shopify CLI will provide a URL
2. Click the URL to install on your development store
3. Authorize the app

## Done! 🎉

Your app is now running. Check out:
- `apps/shopify-app/app/routes/` - Add new routes
- `packages/database/prisma/schema.prisma` - Add database models
- `packages/core/src/` - Add shared utilities

## Alternative: Docker Quick Start

If you prefer Docker (includes PostgreSQL):

```bash
# Copy docker environment
cp env.docker.example .env

# Edit .env with your Shopify credentials

# Start everything
docker-compose up
```

See [DOCKER.md](DOCKER.md) for more details.

## Common Issues

### Database Connection Error
Make sure PostgreSQL is running and DATABASE_URL is correct.

### Shopify CLI Not Found
Install globally: `npm install -g @shopify/cli`

### Port Already in Use
Change the port in `apps/shopify-app/vite.config.ts`

## Next Steps

- Read the [full README](README.md)
- Check out [Shopify App Docs](https://shopify.dev/docs/apps)
- Explore the [Prisma Docs](https://www.prisma.io/docs)


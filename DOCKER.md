# Docker Deployment Guide

This guide covers running the Shopify app template in Docker containers.

## Table of Contents

- [Quick Start with Docker Compose](#quick-start-with-docker-compose)
- [Development with Docker](#development-with-docker)
- [Production Deployment](#production-deployment)
- [Building Images](#building-images)
- [Troubleshooting](#troubleshooting)

## Quick Start with Docker Compose

The easiest way to run the app with Docker is using Docker Compose, which includes both the app and a PostgreSQL database.

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+

### Steps

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your Shopify credentials:**
   ```env
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   SHOPIFY_APP_URL=https://your-tunnel.ngrok.io
   ```

3. **Start services:**
   ```bash
   docker-compose up
   ```

   This will:
   - Start PostgreSQL database
   - Run database migrations
   - Start the Shopify app in development mode
   - App will be available at http://localhost:3000

4. **Stop services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

## Development with Docker

### Hot Reload

The development container (`Dockerfile.dev`) supports hot reload:

```yaml
volumes:
  # Source code is mounted for hot reload
  - ./packages/core/src:/app/packages/core/src
  - ./packages/database/src:/app/packages/database/src
  - ./apps/shopify-app/app:/app/apps/shopify-app/app
```

Changes to source files will automatically reload the app.

### Running Database Migrations

Migrations run automatically when the container starts, but you can also run them manually:

```bash
# Run migrations
docker-compose exec shopify-app sh -c "cd /app/packages/database && npx prisma migrate dev"

# Generate Prisma client
docker-compose exec shopify-app sh -c "cd /app/packages/database && npx prisma generate"

# Open Prisma Studio
docker-compose exec shopify-app sh -c "cd /app/packages/database && npx prisma studio"
```

### Accessing the Database

Connect to PostgreSQL from your host machine:

```bash
Host: localhost
Port: 5432
User: myapp
Password: myapp_password
Database: myapp
```

Or use the Docker CLI:

```bash
docker-compose exec postgres psql -U myapp -d myapp
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f shopify-app
docker-compose logs -f postgres
```

## Production Deployment

The production Dockerfile (`Dockerfile`) creates an optimized multi-stage build.

### Building for Production

From the repository root:

```bash
docker build -f apps/shopify-app/Dockerfile -t shopify-app:latest .
```

### Running Production Container

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e SHOPIFY_API_KEY="your_key" \
  -e SHOPIFY_API_SECRET="your_secret" \
  -e SHOPIFY_APP_URL="https://your-app.com" \
  shopify-app:latest
```

### Environment Variables

Required environment variables for production:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=write_products,read_customers
SHOPIFY_APP_URL=https://your-production-url.com

# Server
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
```

## Building Images

### Development Image

```bash
docker build -f apps/shopify-app/Dockerfile.dev -t shopify-app:dev .
```

### Production Image

```bash
docker build -f apps/shopify-app/Dockerfile -t shopify-app:prod .
```

### Multi-Platform Builds

For deployment to different architectures:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f apps/shopify-app/Dockerfile \
  -t shopify-app:latest \
  --push .
```

## Deployment Platforms

### Google Cloud Run

1. **Build and push image:**
   ```bash
   docker build -f apps/shopify-app/Dockerfile -t gcr.io/YOUR_PROJECT/shopify-app .
   docker push gcr.io/YOUR_PROJECT/shopify-app
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy shopify-app \
     --image gcr.io/YOUR_PROJECT/shopify-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars DATABASE_URL="..." \
     --set-env-vars SHOPIFY_API_KEY="..." \
     --set-env-vars SHOPIFY_API_SECRET="..."
   ```

### AWS ECS/Fargate

Use the production Dockerfile and configure environment variables in your task definition.

### Heroku

```bash
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

### Railway/Fly.io

These platforms auto-detect Dockerfile and build/deploy automatically.

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs shopify-app
```

**Common issues:**
- Database not ready: Wait for postgres health check to pass
- Port already in use: Change port mapping in docker-compose.yml
- Missing environment variables: Check .env file

### Database Connection Errors

**Verify database is running:**
```bash
docker-compose ps postgres
```

**Test connection:**
```bash
docker-compose exec postgres pg_isready -U myapp
```

**Reset database:**
```bash
docker-compose down -v
docker-compose up -d postgres
```

### Hot Reload Not Working

**Ensure volumes are mounted correctly:**
```bash
docker-compose config
```

**Restart container:**
```bash
docker-compose restart shopify-app
```

### Build Fails

**Clear Docker cache:**
```bash
docker builder prune
docker-compose build --no-cache
```

**Check disk space:**
```bash
docker system df
docker system prune
```

### Prisma Issues

**Regenerate client:**
```bash
docker-compose exec shopify-app sh -c "cd /app/packages/database && npx prisma generate"
```

**Reset migrations:**
```bash
docker-compose exec shopify-app sh -c "cd /app/packages/database && npx prisma migrate reset"
```

## Performance Tips

1. **Use BuildKit:**
   ```bash
   export DOCKER_BUILDKIT=1
   docker build ...
   ```

2. **Layer caching:**
   The Dockerfiles are optimized to cache dependencies separately from source code.

3. **Production image size:**
   The production image is ~150MB using Alpine Linux.

4. **Database connections:**
   Configure Prisma connection pool:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

## Security Best Practices

1. **Never commit .env files**
2. **Use secrets management** (AWS Secrets Manager, GCP Secret Manager, etc.)
3. **Run as non-root user** (already configured in production Dockerfile)
4. **Keep base images updated:**
   ```bash
   docker pull node:22-alpine
   docker pull postgres:16-alpine
   ```
5. **Scan images for vulnerabilities:**
   ```bash
   docker scan shopify-app:latest
   ```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)


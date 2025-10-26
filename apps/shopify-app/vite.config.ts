import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the Vite server.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

// Handle empty string from Docker env vars
const shopifyAppUrl = process.env.SHOPIFY_APP_URL?.trim() || 'http://localhost';
const host = new URL(shopifyAppUrl).hostname;

let hmrConfig;
// In Docker, always use localhost for WebSocket binding, regardless of SHOPIFY_APP_URL
const isDocker = process.env.DOCKER_ENV === 'true' || process.platform === 'linux';
if (host === 'localhost' || isDocker) {
  hmrConfig = {
    protocol: 'ws',
    host: 'localhost',
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: 'wss',
    host: host,
    port: parseInt(process.env.FRONTEND_PORT!) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  server: {
    allowedHosts: [host],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ['app', 'node_modules'],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
  build: {
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    include: ['@shopify/app-bridge-react'],
  },
  ssr: {
    noExternal: ['@shopify/shopify-app-react-router', '@shopify/polaris', '@shopify/app-bridge-react'],
    external: ['node:crypto', 'crypto'],
  },
}) satisfies UserConfig;


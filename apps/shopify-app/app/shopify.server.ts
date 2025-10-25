import '@shopify/shopify-app-react-router/adapters/node';
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from '@shopify/shopify-app-react-router/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import prisma from './db.server';
import { createAppConfig } from '@myapp/core';

// Load configuration
const config = createAppConfig();

// Initialize session storage with Prisma
const storage = new PrismaSessionStorage(prisma, {
  tableName: 'sessions',
});

// Initialize Shopify app
const shopify = shopifyApp({
  apiKey: config.SHOPIFY_API_KEY,
  apiSecretKey: config.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.October25,
  scopes: config.SHOPIFY_SCOPES.split(',').map((s) => s.trim()),
  appUrl: config.SHOPIFY_APP_URL,
  authPathPrefix: '/auth',
  sessionStorage: storage,
  distribution: AppDistribution.AppStore,
  hooks: {
    afterAuth: async ({ session }: { session: any }) => {
      console.log('🔐 Shop authenticated:', session.shop);

      try {
        // Create or update shop record
        await prisma.shop.upsert({
          where: { shopDomain: session.shop },
          update: {
            accessToken: session.accessToken,
            scope: session.scope || null,
            isOnline: session.isOnline || false,
            updatedAt: new Date(),
          },
          create: {
            shopDomain: session.shop,
            shopName: session.shop.split('.')[0],
            accessToken: session.accessToken,
            scope: session.scope || null,
            isOnline: session.isOnline || false,
            settings: {},
            installedAt: new Date(),
          },
        });

        console.log('✅ Shop record created/updated');
      } catch (error) {
        console.error('❌ Error in afterAuth hook:', error);
        // Don't throw - allow installation to continue
      }
    },
  },
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const sessionStorage = shopify.sessionStorage;


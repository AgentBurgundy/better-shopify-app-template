/**
 * Configuration management
 * 
 * Loads configuration from environment variables with sensible defaults
 */

export interface AppConfig {
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SHOPIFY_SCOPES: string;
  SHOPIFY_APP_URL: string;
  DATABASE_URL: string;
  NODE_ENV: string;
}

/**
 * Creates app configuration from environment variables
 */
export function createAppConfig(): AppConfig {
  return {
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || '',
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET || '',
    SHOPIFY_SCOPES: process.env.SHOPIFY_SCOPES || 'write_products,read_customers',
    SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/myapp',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}


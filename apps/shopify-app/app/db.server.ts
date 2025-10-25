/**
 * Database client for Shopify App
 * 
 * Imports the shared database client from @myapp/database package
 */

import { prisma, db } from '@myapp/database';

// Export as default for backward compatibility
export default prisma;

// Also export named exports for convenience
export { prisma, db };


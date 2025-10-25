/**
 * @myapp/database
 *
 * Shared database package for all apps
 */

// Export the Prisma client
export { prisma, db, connectDatabase, disconnectDatabase } from './client.js';

// Export all Prisma types (including generated models)
export * from '@prisma/client';


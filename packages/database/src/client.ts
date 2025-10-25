/**
 * Prisma Client Singleton
 * 
 * Ensures only one Prisma client instance exists across the application
 * This prevents connection pool exhaustion in serverless environments
 */

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Creates a new Prisma client instance with optimized settings
 */
export function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

/**
 * Singleton Prisma client instance
 * In development, uses global to prevent hot-reload issues
 * In production, creates a single instance
 */
export const prisma = global.__prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

// Export as 'db' alias for convenience
export const db = prisma;

/**
 * Explicitly connects to the database
 */
export async function connectDatabase() {
  await prisma.$connect();
}

/**
 * Disconnects from the database
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}


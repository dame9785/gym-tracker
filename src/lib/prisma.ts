import { PrismaClient } from '@prisma/client';

// --------------------------------------------------
// Prisma singleton
// --------------------------------------------------

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// --------------------------------------------------
// Development configuration
// --------------------------------------------------

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

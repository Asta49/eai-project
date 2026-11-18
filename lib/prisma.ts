import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://mock:mock@localhost:5432/mock';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createSafePrisma(): PrismaClient {
  try {
    return new PrismaClient({
      log: ['error'],
    });
  } catch (_) {
    return new Proxy({} as PrismaClient, {
      get: () => () => Promise.resolve(null),
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createSafePrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

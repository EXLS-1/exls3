// lib/prisma.ts

import { PrismaClient } from "@prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined; 
}; 

// Configuration du Pool PostgreSQL pour l'adapter
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Optimisation pour un e-commerce : limite les connexions simultanées
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

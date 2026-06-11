// lib/prisma/middleware/soft-delete.ts

import { PrismaClient } from "@prisma/client";

/**
 * Extension Prisma pour gérer automatiquement le Soft Delete
 * sur les tables contenant la colonne "deletedAt" (Client, Site).
 */
export const extendWithSoftDelete = (prisma: PrismaClient) => {
  return prisma.$extends({
    query: {
      client: {
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
      site: {
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
    },
  });
};

export default extendWithSoftDelete;

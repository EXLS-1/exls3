// lib/queries/sites.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function getSitesForFilter() {
  try {
    return await prisma.site.findMany({
      select: { 
        id: true, 
        name: true 
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("[QUERY_ERROR] getSitesForFilter:", error);
    return [];
  }
}
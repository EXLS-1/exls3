// lib/queries/agents.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveAgentsForFilter() {
  try {
    // Utilisation de `select` au lieu de `include` pour la performance
    return await prisma.agent.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { lastName: "asc" },
    });
  } catch (error) {
    console.error("[QUERY_ERROR] getActiveAgentsForFilter:", error);
    return [];
  }
}
// lib/queries/agents.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function getAgentsForFilter() {
  try {
    return await prisma.agent.findMany({
      select: { id: true, firstName: true, lastName: true },
      where: { status: "ACTIVE" },
      orderBy: { lastName: "asc" },
    });
  } catch (error) {
    console.error("[QUERY_AGENTS_ERROR]", error);
    return [];
  }
}
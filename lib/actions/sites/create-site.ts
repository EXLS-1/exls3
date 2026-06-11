// lib/actions/sites/create-site.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "../factory/createAction";
import { SiteSchema } from "@/lib/validations/site.schema";

export const createSite = createSafeAction(SiteSchema, async (data) => {
  await prisma.site.create({ data });

  revalidatePath("/sites");
  return { success: true, message: "Site enregistré." };
});

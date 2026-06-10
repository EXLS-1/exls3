"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const SiteSchema = z.object({
  name: z.string().min(2, "Le nom du site est requis"),
  openingDate: z.string().min(1, "La date d'ouverture est requise"),
  address: z.string().min(5, "L'adresse complète est requise"),
  clientId: z.string().uuid("Client invalide"),
  managerName: z.string().min(2, "Le nom du responsable est requis"),
});

export type SiteFormState = {
  success?: boolean;
  error?: string;
};

/**
 * Action pour créer un nouveau site d'exploitation.
 */
export async function createSite(
  prevState: SiteFormState,
  formData: FormData
): Promise<SiteFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Non autorisé. Veuillez vous connecter." };
  }

  const validatedFields = SiteSchema.safeParse({
    name: formData.get("name"),
    openingDate: formData.get("openingDate"),
    address: formData.get("address"),
    clientId: formData.get("clientId"),
    managerName: formData.get("managerName"),
  });

  if (!validatedFields.success) {
    return { error: "Veuillez vérifier les informations saisies." };
  }

  try {
    await prisma.site.create({
      data: {
        ...validatedFields.data,
        openingDate: new Date(validatedFields.data.openingDate),
        createdById: session.user.id,
      },
    });

    revalidatePath("/sites");
    return { success: true };
  } catch (error) {
    console.error("[CREATE_SITE_ERROR]", error);
    return { error: "Erreur technique lors de la création du site." };
  }
}
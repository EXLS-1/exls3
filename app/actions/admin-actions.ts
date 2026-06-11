// app/actions/admin-actions.ts
// Ce fichier contient les actions liées à la gestion administrative, notamment la création d'employés et de clients.
// "use server" indique que ce code s'exécute côté serveur, permettant l'accès à la base de données et aux sessions.
// L'utilisation de Zod pour la validation des données garantit que seules les données conformes sont traitées, améliorant la robustesse de l'application.
// Les actions createAgent et createClient reçoivent les données du formulaire, valident ces données, et si elles sont valides, créent de nouveaux enregistrements dans la base de données.

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const AgentSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
});

const ClientSchema = z.object({
  name: z.string().min(2, "Le nom de l'entreprise est trop court"),
  contact: z.string().optional(),
});

export type AdminFormState = {
  success?: boolean;
  error?: string;
};

// Action pour créer un Employé
export async function createAgent(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as { role?: string })?.role;
  if (!session || (userRole !== "ADMIN" && userRole !== "HR")) {
    return { error: "Accès refusé. Droits insuffisants." };
  }

  const validatedFields = AgentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) return { error: "Formulaire invalide." };

  try {
    await prisma.agent.create({
      data: {
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        phone: validatedFields.data.phone ?? null,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/missions/new");
    return { success: true };
  } catch {
    return { error: "Impossible d'enregistrer cet agent." };
  }
}

// Action pour créer un Client
export async function createClient(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as { role?: string })?.role;
  if (!session || (userRole !== "ADMIN" && userRole !== "HR")) {
    return { error: "Accès refusé. Droits insuffisants." };
  }

  const validatedFields = ClientSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
  });

  if (!validatedFields.success) return { error: "Formulaire invalide." };

  try {
    await prisma.client.create({
      data: {
        name: validatedFields.data.name,
        contact: validatedFields.data.contact ?? null,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/missions/new");
    return { success: true };
  } catch {
    return { error: "Impossible d'enregistrer ce client." };
  }
}
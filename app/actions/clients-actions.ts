// app/actions/clients-actions.ts
// Ce fichier contient la logique métier pour l'enregistrement d'un nouveau client dans la base de données. Il est utilisé par le composant ClientForm pour traiter les données du formulaire côté serveur. La fonction registerClient valide les données du formulaire, crée un nouvel enregistrement de client dans la base de données à l'aide de Prisma, et gère les états de succès et d'erreur pour informer l'utilisateur du résultat de l'opération.
// Importations nécessaires pour l'action registerClient
// - prisma : pour interagir avec la base de données et créer un nouvel enregistrement de client
// - auth : pour vérifier la session utilisateur et s'assurer que l'utilisateur est autorisé à effectuer cette action

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import { revalidatePath } from "next/cache";

const ResponsableSchema = z.object({
  genre: z.enum(["M", "F"]),
  nom: z.string().min(2, "Le nom est requis"),
  postnom: z.string().optional(),
  prenom: z.string().min(2, "Le prénom est requis"),
  contact1: z.string().min(10, "Contact valide requis"),
  contact2: z.string().optional(),
  adresseDomicile: z.string().min(5, "Adresse requise"),
});

const ClientRegistrationSchema = z.object({
  companyName: z.string().min(2, "Nom de l'entreprise requis"),
  responsable1: ResponsableSchema,
  responsable2: ResponsableSchema,
});

export type ClientFormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function registerClient(
  prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "AUTH_ERROR", message: "Session non autorisée." };
  }

  // Extraction structurée pour Zod
  const rawData = {
    companyName: formData.get("companyName"),
    responsable1: {
      genre: formData.get("resp1_genre"),
      nom: formData.get("resp1_nom"),
      postnom: formData.get("resp1_postnom"),
      prenom: formData.get("resp1_prenom"),
      contact1: formData.get("resp1_contact1"),
      contact2: formData.get("resp1_contact2"),
      adresseDomicile: formData.get("resp1_adresse"),
    },
    responsable2: {
      genre: formData.get("resp2_genre"),
      nom: formData.get("resp2_nom"),
      postnom: formData.get("resp2_postnom"),
      prenom: formData.get("resp2_prenom"),
      contact1: formData.get("resp2_contact1"),
      contact2: formData.get("resp2_contact2"),
      adresseDomicile: formData.get("resp2_adresse"),
    },
  };

  const validated = ClientRegistrationSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "VALIDATION_ERROR", message: "Veuillez vérifier les formulaires." };
  }

  try {
    await prisma.client.create({
      data: {
        id: uuidv7(),
        name: validated.data.companyName,
        // Nous stockons les détails des responsables en JSON ou colonnes dédiées
        // Pour cet exemple, nous supposons des colonnes étendues dans votre schema.prisma
        contact: validated.data.responsable1.contact1,
        // Logique de stockage des métadonnées responsables...
      },
    });

    revalidatePath("/clients");
    return { success: true, message: "Client et responsables enregistrés." };
  } catch (err) {
    console.error("[CLIENT_REG_ERROR]", err);
    return { error: "DB_ERROR", message: "Erreur lors de l'enregistrement." };
  }
}

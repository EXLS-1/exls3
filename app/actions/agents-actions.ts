// app/actions/agents-actions.ts
// Ce fichier contient les actions liées à la gestion des agents, notamment l'enrôlement.
// "use server" indique que ce code s'exécute côté serveur, permettant l'accès à la base de données et aux sessions.
// L'utilisation de Zod pour la validation des données garantit que seules les données conformes sont traitées, améliorant la robustesse de l'application.
// L'action enrolAgent reçoit les données du formulaire, valide ces données, et si elles sont valides, crée un nouvel enregistrement d'agent dans la base de données.

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/server"; // Supposant une instance configurée

// Constantes de validation pour les fichiers
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Schéma de validation robuste
const AgentSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  postnom: z.string().optional(),
  prenom: z.string().min(2, "Le prénom est requis"),
  contact1: z.string().min(10, "Contact valide requis"),
  contact2: z.string().optional(),
  dateNaissance: z.string().transform((str) => new Date(str)),
  adresseDomicile: z.string().min(5, "Adresse complète requise"),
  dateDebutService: z.string().transform((str) => new Date(str)),
  formulaire: z.boolean().default(false),
  cv: z.boolean().default(false),
  carteId: z.boolean().default(false),
  photoPp: z.string().optional(), // Stocke l'URL du storage
  diplome: z.boolean().default(false),
  observation: z.string().optional(),
});

export type AgentFormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function enrolAgent(
  prevState: AgentFormState,
  formData: FormData
): Promise<AgentFormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "AUTH_ERROR", message: "Session expirée ou non autorisée." };
  }

  const photoFile = formData.get("photoFile") as File;
  let photoUrl = "";

  // Logique d'upload Supabase Storage
  if (photoFile && photoFile.size > 0) {
    // Validation Zod du fichier avant l'upload
    const fileValidation = z.instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "La photo ne doit pas dépasser 2 Mo.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Seuls les formats .jpg, .jpeg et .png sont acceptés."
      )
      .safeParse(photoFile);

    if (!fileValidation.success) {
      return { error: "VALIDATION_ERROR", message: fileValidation.error.issues[0].message };
    }

    try {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${uuidv7()}.${fileExt}`;
      const filePath = `agents/photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("excellentservice-erp")
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("excellentservice-erp")
        .getPublicUrl(filePath);
        
      photoUrl = publicUrl;
    } catch (error) {
      console.error("[STORAGE_ERROR]", error);
      return { error: "UPLOAD_ERROR", message: "Erreur lors de l'upload de la photo." };
    }
  }

  const rawData = {
    nom: formData.get("nom"),
    postnom: formData.get("postnom"),
    prenom: formData.get("prenom"),
    contact1: formData.get("contact1"),
    contact2: formData.get("contact2"),
    dateNaissance: formData.get("dateNaissance"),
    adresseDomicile: formData.get("adresseDomicile"),
    dateDebutService: formData.get("dateDebutService"),
    formulaire: formData.get("formulaire") === "on",
    cv: formData.get("cv") === "on",
    carteId: formData.get("carteId") === "on",
    photoPp: photoUrl || undefined,
    diplome: formData.get("diplome") === "on",
    observation: formData.get("observation"),
  };

  const validated = AgentSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "VALIDATION_ERROR", message: "Vérifiez les données saisies." };
  }

  try {
    await prisma.agent.create({
      data: {
        id: uuidv7(), // Utilisation de Uuid v7
        ...validated.data,
        // Associer l'agent à l'utilisateur en session via l'identifiant
        enroleParId: session.user.id,
      },
    });
  } catch (err) {
    console.error("[AGENT_ENROL_ERROR]", err);
    return { error: "DB_ERROR", message: "Erreur lors de l'enregistrement en base." };
  }

  // Revalidation de la page si nécessaire
  try {
    revalidatePath("/agents");
  } catch (e) {
    console.warn("[REVALIDATE_WARN]", e);
  }

  return { success: true, message: "Agent enrôlé avec succès." };
}

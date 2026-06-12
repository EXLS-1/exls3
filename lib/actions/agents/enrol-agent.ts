// lib/actions/agents/enrol-agent.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateUUIDv7 } from "@/lib/uuid";
import { createSafeAction } from "../factory/createAction";
import { AgentSchema } from "@/lib/validations/agent.schema";
import { supabase } from "@/lib/supabase/server";
import { z } from "zod";

type EnrolAgentSession = {
  user: {
    id: string;
  };
};

type AgentFormData = z.infer<typeof AgentSchema>;

/**
 * Action pour enrôler un agent. 
 * Gère la validation du schéma (incluant le fichier photo) et l'upload vers Supabase Storage.
 */
export const enrolAgent = createSafeAction(AgentSchema, async (data, session: unknown) => {
  const sess = session as EnrolAgentSession;
  // Extraction du fichier du reste des données validées par Zod
  const { photoFile, ...agentData } = data as any; 

  let photoUrl: string | null = null;

  // Traitement de l'upload si un fichier valide est présent
  if (photoFile instanceof File) {
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${generateUUIDv7()}.${fileExt}`;
    const filePath = `agents-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("assets") // Remplacez par le nom de votre bucket
      .upload(filePath, photoFile);

    if (uploadError) {
      throw new Error(`Erreur lors de l'upload de la photo: ${uploadError.message}`);
    }

    // Récupération de l'URL publique (opération synchrone dans le SDK v2)
    const { data: publicUrlData } = supabase.storage.from("assets").getPublicUrl(filePath);
    photoUrl = publicUrlData.publicUrl;
  }

  // Création de l'agent dans Prisma
  await prisma.agent.create({
    data: {
      id: generateUUIDv7(),
      ...agentData,
      photoPp: photoUrl, // On enregistre l'URL dans le champ correspondant du modèle Agent
      enrollePar: sess.user.id,
    },
  });

  revalidatePath("/agents");
  return { success: true, message: "Agent enrôlé avec succès." };
});

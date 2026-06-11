// lib/actions/agents/enrol-agent.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { createSafeAction } from "../factory/createAction";
import { AgentSchema } from "@/lib/validations/agent.schema";
// import { supabase } from "@/lib/supabase/server";

type EnrolAgentSession = {
  user: {
    id: string;
  };
};

export const enrolAgent = createSafeAction(AgentSchema, async (data, session: unknown) => {
  // Optionnel : Gestion de l'upload Supabase ici si besoin, 
  // en passant l'URL au lieu du fichier brut.

  const sess = session as EnrolAgentSession;

  await prisma.agent.create({
    data: {
      id: uuidv7(),
      ...data,
      enrollePar: sess.user.id,
    },
  });

  revalidatePath("/agents");
  return { success: true, message: "Agent enrôlé avec succès." };
});

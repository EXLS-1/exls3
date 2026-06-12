"use server";

import { generateUUIDv7 } from "@/lib/uuid";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/actions/factory/createAction";
import { registerClientSchema } from "@/lib/validations/client.schema";
import { z } from "zod";

type RegisterClientData = z.infer<typeof registerClientSchema>;

async function handleRegisterClient(data: RegisterClientData, session: unknown) {
  const sess = session as { user: { id: string } };
  await prisma.client.create({
    data: {
      id: generateUUIDv7(),
      name: data.companyName,
      contact: data.contact,
      creePar: sess.user.id,
    },
  });

  revalidatePath("/clients");
  return { success: true, message: "Client enregistré avec succès." };
}

export const registerClient = createSafeAction(registerClientSchema, handleRegisterClient);
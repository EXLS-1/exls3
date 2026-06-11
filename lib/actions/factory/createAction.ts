// lib/actions/factory/createAction.ts
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
};

type Handler<TInput, TOutput> = (
  validatedData: TInput,
  session: any // Remplace par ton type Session réel
) => Promise<ActionResponse<TOutput>>;

/**
 * Factory pour standardiser les Server Actions
 */
export function createSafeAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: Handler<TInput, TOutput>
) {
  return async (
    prevState: ActionResponse<TOutput>,
    formData: FormData | unknown
  ): Promise<ActionResponse<TOutput>> => {
    try {
      // 1. Vérification de la session (Centralisée)
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) {
        return { success: false, error: "UNAUTHORIZED", message: "Veuillez vous reconnecter." };
      }

      // 2. Formatage des données
      // Si c'est un FormData, on le convertit en objet plat
      const inputData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

      // 3. Validation Zod (Centralisée)
      const validatedFields = schema.safeParse(inputData);
      if (!validatedFields.success) {
        return {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Veuillez vérifier les champs du formulaire.",
          fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
      }

      // 4. Exécution du gestionnaire métier
      return await handler(validatedFields.data, session);
    } catch (error) {
      console.error("[ACTION_ERROR]", error);
      return { 
        success: false, 
        error: "INTERNAL_ERROR", 
        message: "Une erreur technique inattendue est survenue." 
      };
    }
  };
}
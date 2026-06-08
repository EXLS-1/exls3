// lib/auth/session.ts
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

/**
 * Utilitaire optimisé pour récupérer la session Better-Auth côté serveur.
 * Centralise la logique et le typage.
 */
export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
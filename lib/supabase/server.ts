// lib/supabase/server.ts

import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté serveur.
 * Utilise la SERVICE_ROLE_KEY pour permettre l'administration du Storage 
 * (upload/delete) directement depuis les Server Actions.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
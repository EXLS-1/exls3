// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Assurez-vous que ces variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Clé anonyme pour le côté client ou Server Actions

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key environment variables.');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
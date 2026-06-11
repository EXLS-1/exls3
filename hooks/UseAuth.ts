// hooks/UseAuth.ts

import { useContext } from "react";
import  AuthContext  from "@/lib/provider/auth-provider";

/**
 * Hook personnalisé useAuth : Permet d'accéder facilement à la session.
 * Incorpore une vérification de sécurité pour s'assurer qu'il est utilisé dans le bon contexte.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

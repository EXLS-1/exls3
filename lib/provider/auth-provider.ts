 "use client";

import { createContext, useContext, ReactNode, useEffect, useMemo } from "react";
import { authClient } from "./auth-client";
import { useUserStore } from "@/lib/store/useUserStore";

/**
 * Inférence du type de session directement depuis la configuration du client Better-Auth.
 * Cela garantit que les champs additionnels (comme 'role') sont correctement typés.
 */
type Session = typeof authClient.$Infer.Session;

interface AuthContextType {
  session: Session | null;
  isPending: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider : Fournisseur de contexte pour l'état d'authentification.
 * Il encapsule la logique de récupération de session de Better-Auth et la rend
 * disponible dans toute l'arborescence des composants clients.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Utilisation du hook natif de Better-Auth pour le suivi de la session en temps réel
  const { data: session, isPending, error } = authClient.useSession();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const clearUser = useUserStore((state) => state.clearUser);

  // Synchronisation avec Zustand
  useEffect(() => {
    if (session?.user) {
      setUserInfo({
        role: (session.user.role as any) ?? null,
        userId: session.user.id,
        name: session.user.name ?? null,
      });
    } else if (!isPending) {
      clearUser();
    }
  }, [session, isPending, setUserInfo, clearUser]);

  const value = useMemo(() => ({ 
    session: session ?? null, 
    isPending, 
    error: error as Error | null 
  }), [session, isPending, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé useAuth : Permet d'accéder facilement à la session.
 * Incorpore une vérification de sécurité pour s'assurer qu'il est utilisé dans le bon contexte.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
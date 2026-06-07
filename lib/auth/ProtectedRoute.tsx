"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // 1. Affichage du loader pendant la vérification
  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-12">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
            <div className="absolute inset-0 rounded-full border-4 border-zinc-900 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest animate-pulse">
            Vérification...
          </p>
        </div>
      </div>
    );
  }

  // 2. Vérification des permissions de rôle
  if (session && allowedRoles && !allowedRoles.includes(session.user.role || "")) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900">Accès restreint</h2>
          <p className="text-zinc-500">Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-semibold text-sm"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // 3. Si tout est ok, on affiche le contenu
  return session ? <>{children}</> : null;
}
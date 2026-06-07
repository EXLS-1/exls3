// component/layout/Header.tsx

"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileNav } from "@/component/layout/MobileNav";
import { useNetworkStore } from "@/lib/store/useNetworkStore";

export function Header() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { isOnline, setIsOnline } = useNetworkStore();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Bouton Hamburger - Visible uniquement sur mobile */}
          <button 
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-zinc-100 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg className="size-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 text-white font-bold text-lg">
            E
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-900 uppercase">
            Excellent Service <span className="text-zinc-400">| ERP</span>
          </span>
        </div>

        {/* Indicateur de connexion perdue */}
        {!isOnline && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg animate-pulse">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Connexion perdue</span>
          </div>
        )}

        {/* Navigation conditionnelle basée sur le rôle */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/attendance" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Présences
          </Link>
          
          {(session?.user.role === "ADMIN" || session?.user.role === "HR") && (
            <Link href="/employees" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Personnel
            </Link>
          )}

          {session?.user.role === "ADMIN" && (
            <Link href="/settings" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Configuration
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-red-600 disabled:opacity-50"
          >
            {isLoggingOut ? "Déconnexion..." : (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Quitter
              </>
            )}
          </button>
        </div>
      </div>
    </header>

    <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
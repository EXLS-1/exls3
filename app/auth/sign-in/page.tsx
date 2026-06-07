//

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/attendance",
    });

    if (authError) {
      setError(authError.message || "Identifiants invalides");
      setLoading(false);
    } else {
      router.push("/attendance");
      router.refresh();
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-50 relative">
      {/* Décoration de fond cohérente avec la Home */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Connexion</h1>
          <p className="text-zinc-500">Accédez à votre espace EXCELLENT SERVICE</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="email">
                Adresse Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900 bg-white px-4 py-3 text-sm transition-all"
                placeholder="admin@exls.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900 bg-white px-4 py-3 text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold shadow-lg shadow-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin size-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-zinc-100 text-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-zinc-400">
        ERP EXLS • Sécurité & Gardiennage
      </footer>
    </main>
  );
}
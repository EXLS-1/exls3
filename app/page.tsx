// app/page.tsx
// @ts-nocheck
/// <reference types="react" />

import Link from "next/link";
import { auth } from "@/lib/auth/auth";

export default async function Home() {
  // Logique serveur : Récupération sécurisée de la session
  const session = await auth();
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Décoration de fond : Teinte subtile bleutée */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 bg-[radial-gradient(#bfdbfe_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200">
            Système ERP v1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-blue-950">
            EXCELLENT <span className="text-red-600">SERVICE</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-800/70 max-w-2xl mx-auto">
            Plateforme de gestion centralisée pour la sécurité et le gardiennage. 
            Suivi du personnel, présences, clients et fournisseurs en temps réel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session ? (
            <Link
              href="/attendance"
              className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-800 hover:-translate-y-0.5 transition-all"
            >
              Accéder au Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-800 hover:-translate-y-0.5 transition-all"
              >
                Se connecter
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 border border-blue-200 rounded-2xl font-semibold hover:bg-blue-50 transition-all"
              >
                En savoir plus
              </Link>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-blue-100">
          {[
            { label: "Personnel", value: "Agents" },
            { label: "Présences", value: "Temps Réel" },
            { label: "Clients", value: "Abonnés" },
            { label: "Sécurité", value: "Certifiée" },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl font-bold text-blue-950">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-red-600 font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-zinc-400">
        © {new Date().getFullYear()} EXCELLENT SERVICE (EXLS). Tous droits réservés.
      </footer>
    </main>
  );
}
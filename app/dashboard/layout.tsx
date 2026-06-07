// app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sécurité globale pour tout le groupe (dashboard)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const navigation = [
    { name: "Présences & Pointage", href: "/attendance", icon: "⏱️" },
    { name: "Gestion des Missions", href: "/missions", icon: "📋" },
    { name: "Agents & Personnel", href: "/employees", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Bleu Dominant */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-blue-900/10 bg-blue-950 text-white">
        {/* Logo / Header */}
        <div className="flex h-16 shrink-0 items-center border-b border-blue-900 px-6">
          <Link href="/" className="text-xl font-black tracking-wider text-white">
            EXS <span className="text-red-500">ERP</span>
          </Link>
        </div>

        {/* Liens de Navigation */}
        <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-100 hover:bg-blue-900 hover:text-white transition-all"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Profil & Déconnexion - Bouton Rouge */}
        <div className="border-t border-blue-900 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="size-9 rounded-full bg-blue-800 flex items-center justify-center font-bold text-sm ring-2 ring-blue-400">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{session.user.name}</p>
              <p className="text-xs truncate text-blue-300/70">{session.user.email}</p>
            </div>
          </div>
          
          {/* Formulaire natif pour la déconnexion (Zéro JS Client requis pour déconnecter) */}
          <form
            action={async () => {
              "use server";
              // Ta logique de déconnexion Better-Auth ici
              // ex: await auth.api.signOut({ ... })
              redirect("/login");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white ring-1 ring-inset ring-red-900/50 hover:ring-red-600 transition-all"
            >
              <span>🚪</span>
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu Principal (Décalé à cause de la sidebar fixed) */}
      <div className="pl-72 flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-end border-b border-blue-900/5 bg-white px-8 shadow-sm">
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Rôle : {session.user.role || "RH"}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
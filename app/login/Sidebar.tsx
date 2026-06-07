"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const menuItems = [
    {
      title: "Tableau de Bord",
      href: "/dashboard",
      icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      roles: ["ADMIN", "HR", "SUPERVISOR"]
    },
    {
      title: "Présences",
      href: "/attendance",
      icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      roles: ["ADMIN", "HR", "SUPERVISOR"]
    },
    {
      title: "Gestion Personnel",
      href: "/employees",
      icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      roles: ["ADMIN", "HR"]
    },
    {
      title: "Abonnés & Clients",
      href: "/clients",
      icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      roles: ["ADMIN", "HR"]
    },
    {
      title: "Missions",
      href: "/missions",
      icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      roles: ["ADMIN", "HR", "SUPERVISOR"]
    },
    {
      title: "Fournisseurs",
      href: "/suppliers",
      icon: <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      roles: ["ADMIN"]
    }
  ];

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-64px)] w-64 border-r border-zinc-200 bg-white p-4 hidden lg:block overflow-y-auto">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const hasPermission = item.roles.includes(session?.user.role || "");
          const isActive = pathname === item.href;

          if (!hasPermission) return null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive 
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <span className={`${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"}`}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          );
        })}
      </div>

      {/* Section Utilisateur en bas */}
      <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {session?.user.name?.slice(0, 2) || "EX"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 truncate">{session?.user.name || "Utilisateur"}</p>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{session?.user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
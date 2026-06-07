"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { MENU_ITEMS } from "@/navigation-config";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-64px)] w-64 border-r border-zinc-200 bg-white p-4 hidden lg:block overflow-y-auto">
      <div className="space-y-1">
        {MENU_ITEMS.map((item) => {
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
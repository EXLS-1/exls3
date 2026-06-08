// component/layout/AppSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/lib/navigation-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AppSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  };
};

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-64px)] w-64 border-r border-zinc-200 bg-white p-4 hidden lg:flex flex-col overflow-y-auto">
      <nav className="flex-1 space-y-1">
        {MENU_ITEMS.map((item) => {
          const hasPermission = !item.roles.length || item.roles.includes(user.role as any);
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (!hasPermission) return null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive ? "bg-zinc-900 text-white shadow-md" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className={`size-5 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Section Utilisateur en bas */}
      <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border border-zinc-200">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-zinc-900 text-white text-[10px]">
              {user.name?.slice(0, 2).toUpperCase() || "EX"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 truncate">{user.name || "Utilisateur"}</p>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
// component/layout/MobileNavContent.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/lib/navigation-config";

interface MobileNavContentProps {
  userRole?: string | null;
}

export function MobileNavContent({ userRole }: MobileNavContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-100">
        <span className="text-lg font-bold text-zinc-900 uppercase tracking-tight">
          EXLS <span className="text-zinc-400">Menu</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const hasPermission = !item.roles.length || item.roles.includes(userRole as any);
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (!hasPermission) return null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className={`size-5 ${isActive ? "text-white" : "text-zinc-400"}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100 bg-zinc-50">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
          ERP Excellent Service v1.0
        </p>
      </div>
    </div>
  );
}
// component/layout/MobileNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect } from "react";
import { MENU_ITEMS } from "@/navigation-config";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-zinc-100">
            <span className="text-lg font-bold text-zinc-900 uppercase tracking-tight">EXLS <span className="text-zinc-400">Menu</span></span>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 transition-colors">
              <svg className="size-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const hasPermission = item.roles.includes(session?.user.role || "");
              const isActive = pathname === item.href;

              if (!hasPermission) return null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-zinc-400"}>{item.icon}</span>
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">ERP Excellent Service v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
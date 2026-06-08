// component/layout/Header.tsx

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, WifiOff, User as UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { useNetworkStore } from "@/lib/store/useNetworkStore";

// Composants shadcn/ui (assurez-vous de les avoir installés via npx shadcn-ui@latest add ...)
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { MobileNavContent } from "./MobileNavContent";

type HeaderProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  };
};

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isOnline, setIsOnline } = useNetworkStore();

  // Écouteurs réseau (Gardé car c'est de la logique purement client)
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
      fetchOptions: { onSuccess: () => { router.push("/login"); router.refresh(); } },
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Menu Mobile via Sheet de shadcn */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <MobileNavContent userRole={user.role} />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 text-white font-bold text-lg">E</div>
            <span className="text-sm font-bold tracking-tight text-zinc-900 uppercase hidden sm:inline">
              Excellent Service <span className="text-zinc-400">| ERP</span>
            </span>
          </Link>
        </div>

        {/* Indicateur Hors-Ligne */}
        {!isOnline && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg animate-pulse">
            <WifiOff className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Hors ligne</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Menu Profil via DropdownMenu de shadcn */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="size-10">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-zinc-900 text-white">
                    {user.name?.slice(0, 2).toUpperCase() || "EX"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <UserIcon className="mr-2 size-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 size-4" />
                <span>{isLoggingOut ? "Déconnexion..." : "Quitter"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
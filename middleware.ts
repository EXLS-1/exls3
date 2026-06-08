// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterAuth } from "@/lib/auth/auth"; // Importez votre instance Better-Auth

// Liste des routes protégées
const protectedRoutes = ["/attendance", "/missions", "/employees", "/settings", "/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifie si la route est protégée
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Vérification de la session via Better-Auth
    // Note: Better-Auth fournit une méthode pour vérifier la session dans le middleware
    const session = await betterAuth.api.getSession({
      headers: request.headers,
    });

    // Si pas de session, redirection vers login
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Protection basée sur les rôles (RBAC)
    if (pathname.startsWith("/settings") && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    if (pathname.startsWith("/employees") && !["ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configuration du matcher pour exclure les assets statiques et les routes publiques
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth|login|register).*)",
  ],
};
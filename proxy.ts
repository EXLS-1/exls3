// proxy.ts

import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/next-js";

export const runtime = "nodejs"; // Assure la compatibilité totale avec les modules Node

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request); // Plus rapide que de fetch l'API entière

  // Routes nécessitant une connexion
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/attendance") || 
                           request.nextUrl.pathname.startsWith("/dashboard");
  
  // Route de login
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/attendance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/attendance/:path*", "/dashboard/:path*", "/login"],
};
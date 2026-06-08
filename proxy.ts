// proxy.ts

import { NextResponse, type NextRequest } from "next/server";

/**
 * Extrait le token de session sans validation DB pour une performance maximale.
 * Better-Auth utilise par défaut 'better-auth.session_token'.
 */
function getSessionCookie(request: NextRequest) {
  return (
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimisation : Ignorer les assets statiques et les requêtes internes
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

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
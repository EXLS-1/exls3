import { betterFetch } from "@better-auth/fetch";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // On vérifie la session via l'API interne de Better-Auth
  const { data: session } = await betterFetch<{
    user: { id: string; email: string; role: string };
    session: { userId: string };
  }>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      // Important : on passe le cookie pour que le serveur identifie la session
      cookie: request.headers.get("cookie") || "",
    },
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
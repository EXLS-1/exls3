// app/api/auth/[...better-auth]/route.ts
import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better-Auth gère nativement les requêtes Edge-ready de Next.js 16 via Web APIs
const handler = toNextJsHandler(auth);

export { handler as GET, handler as POST };
// app/auth/sign-in/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function SignInPage() {
  // Sécurité : Redirige vers le dashboard si déjà connecté
  const session = await getServerSession();
  if (session) redirect("/dashboard");

  return (
    <Card className="w-full max-w-md shadow-xl border-zinc-200/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">Connexion à votre compte</CardTitle>
        <CardDescription>Entrez vos identifiants pour accéder à votre espace dans la plateforme EXCELLENT SERVICE.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        
      </CardContent>
    </Card>
  );
}
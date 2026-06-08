// app/auth/sign-up/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session) redirect("/dashboard");

  return (
    <Card className="w-full max-w-md shadow-xl border-zinc-200/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">Créer un compte</CardTitle>
        <CardDescription>Rejoignez la plateforme EXCELLENT SERVICE</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Déjà un compte ?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-zinc-900 hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
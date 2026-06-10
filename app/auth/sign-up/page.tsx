// app/auth/sign-up/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session) redirect("/dashboard");

  return (
    <Card className="w-full max-w-md shadow-xl border-zinc-200/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">Création de votre Compte</CardTitle>
        <CardDescription>Rejoignez la plateforme EXCELLENT SERVICE</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
       
      </CardContent>
    </Card>
  );
}
// app/auth/update-password/page.tsx

import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { getServerSession } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

// Next.js 15/16 : searchParams est une Promise
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UpdatePasswordPage({ searchParams }: PageProps) {
  // const session = await getServerSession();
  // if (session) redirect("/dashboard");

  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;
  const email = typeof params.email === "string" ? params.email : null;

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-xl border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Lien invalide</AlertTitle>
            <AlertDescription>
              Ce lien de réinitialisation est expiré ou invalide. Veuillez en demander un nouveau.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-sm font-semibold text-red-700 hover:underline">
              Demander un nouveau lien
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-zinc-200/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">Nouveau mot de passe</CardTitle>
        <CardDescription>Choisissez un mot de passe fort et sécurisé pour votre compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm token={token} email={email} />
      </CardContent>
    </Card>
  );
}
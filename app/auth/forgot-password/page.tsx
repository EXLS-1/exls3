import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md shadow-xl border-zinc-200/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">Mot de passe oublié ?</CardTitle>
        <CardDescription>
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/auth/sign-in" className="font-semibold text-zinc-900 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
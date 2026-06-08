// components/auth/updated-password-success.tsx
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UpdatedPasswordSuccess() {
  return (
    <div className="space-y-4 text-center py-4">
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle2 className="size-4" />
        <AlertTitle>Mot de passe mis à jour !</AlertTitle>
        <AlertDescription>
          Votre mot de passe a été réinitialisé avec succès.
        </AlertDescription>
      </Alert>
      <Button asChild className="w-full">
        <Link href="/auth/sign-in">Retour à la connexion</Link>
      </Button>
    </div>
  );
}
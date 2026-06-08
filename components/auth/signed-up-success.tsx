// components/auth/signed-up-success.tsx

import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SignedUpSuccess() {
  return (
    <Alert className="bg-green-50 border-green-200 text-green-800">
      <CheckCircle2 className="size-4" />
      <AlertTitle>Compte créé avec succès !</AlertTitle>
      <AlertDescription>
        Votre compte a été initialisé. Vous pouvez maintenant vous connecter avec vos identifiants.
      </AlertDescription>
    </Alert>
  );
}
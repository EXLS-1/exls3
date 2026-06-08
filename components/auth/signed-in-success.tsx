// components/auth/signed-in-success.tsx

import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SignedInSuccess() {
  return (
    <Alert className="bg-green-50 border-green-200 text-green-800">
      <CheckCircle2 className="size-4" />
      <AlertTitle>Connexion réussie !</AlertTitle>
      <AlertDescription>Redirection vers votre tableau de bord...</AlertDescription>
    </Alert>
  );
}
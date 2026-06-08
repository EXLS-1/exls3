// components/auth/sign-in-button.tsx

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  isLoading: boolean;
}

export function SignInButton({ isLoading }: SignInButtonProps) {
  return (
    <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Connexion en cours...
        </>
      ) : (
        "Se connecter"
      )}
    </Button>
  );
}
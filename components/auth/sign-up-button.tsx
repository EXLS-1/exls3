// components/auth/sign-up-button.tsx

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignUpButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
      {isLoading ? (
        <><Loader2 className="mr-2 size-4 animate-spin" /> Création...</>
      ) : (
        "Créer mon compte"
      )}
    </Button>
  );
}
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await auth.api.signOut({
          headers: await headers(),
        });
        redirect("/auth/sign-in");
      }}
    >
      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold">
        <LogOut className="mr-2 size-4" />
        Déconnexion
      </Button>
    </form>
  );
}
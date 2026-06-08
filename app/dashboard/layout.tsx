// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session"; // L'utilitaire créé précédemment
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Sécurité : Récupération de la session côté serveur
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // On formate l'objet user pour le passer aux composants clients
  const userProps = {
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    image: session.user.image,
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      {/* 
        HEADER GLOBAL 
        Il est sticky top-0, z-40. Il prend toute la largeur.
      */}
      <Header user={userProps} />

      <div className="flex">
        {/* 
          SIDEBAR DESKTOP 
          Elle est fixed, top-16 (64px, la hauteur du Header).
          Elle n'apparaît que sur les grands écrans (hidden lg:flex).
      */}
        <AppSidebar user={userProps} />

        {/* 
          CONTENU PRINCIPAL 
          Décalé à gauche de la largeur de la sidebar (lg:pl-64) 
          et d'un padding top (pt-16) si le header n'est pas sticky, 
          mais comme le header est sticky et la sidebar top-16, 
          on n'a besoin que du padding gauche sur desktop.
      */}
        <main className="flex-1 lg:pl-64 p-6 md:p-8">
          {/* 
            Zone de contenu des pages enfants 
          */}
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
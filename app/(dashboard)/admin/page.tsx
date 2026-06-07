// app/(dashboard)/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { EmployeeForm } from "@/components/admin/EmployeeForm";
import { ClientForm } from "@/components/admin/ClientForm";

export default async function AdminPage() {
  const [totalEmployees, totalClients] = await Promise.all([
    prisma.employee.count(),
    prisma.client.count(),
  ]);

  return (
    <main className="flex-1 p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Administration ERP</h1>
          <p className="text-sm text-blue-800/60 mt-1">Gérez le référentiel des ressources et entités de l'entreprise.</p>
        </div>

        {/* Cartes statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex justify-between items-center">
            <span className="text-sm font-bold text-blue-900/70 uppercase">Agents Actifs</span>
            <span className="text-3xl font-black text-blue-950">{totalEmployees}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex justify-between items-center">
            <span className="text-sm font-bold text-blue-900/70 uppercase">Comptes Clients</span>
            <span className="text-3xl font-black text-blue-950">{totalClients}</span>
          </div>
        </div>

        {/* Section Formulaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmployeeForm />
          <ClientForm />
        </div>
      </div>
    </main>
  );
}
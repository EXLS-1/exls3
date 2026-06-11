// app/(dashboard)/reports/page.tsx
// Page de rapports d'audit de présences.
// Récupère les enregistrements de pointage validés côté serveur avec des filtres dynamiques basés sur les paramètres d'URL (date, employé).
// Affiche un tableau détaillé avec les informations d'identité de l'agent, la mission associée, la date du pointage et le validateur.
// Intègre également un composant de filtres pour affiner les résultats en temps réel.

import { prisma } from "@/lib/prisma";
import { ReportFilters } from "@/components/reports/ReportFilters";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ReportsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const dateFilter = searchParams.date as string | undefined;
  const employeeFilter = searchParams.employeeId as string | undefined;

  // 1. Récupération de la liste complète des employés pour alimenter le filtre
  const employeesList = await prisma.employee.findMany({
    orderBy: { lastName: "asc" },
  });

  // 2. Construction dynamique de la clause WHERE Prisma
  const whereClause: any = {};

  if (employeeFilter) {
    whereClause.employeeId = employeeFilter;
  }

  if (dateFilter) {
    const startOfDay = new Date(`${dateFilter}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateFilter}T23:59:59.999Z`);
    whereClause.arrivedAt = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  // 3. Extraction optimisée des rapports
  const records = await prisma.attendanceRecord.findMany({
    where: whereClause,
    include: {
      employee: true,
      createdBy: true,
      mission: {
        include: { client: true },
      },
    },
    orderBy: { arrivedAt: "desc" },
  });

  return (
    <main className="flex-1 p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Rapports d'Audit de Présences</h1>
          <p className="text-sm text-blue-800/60 mt-1">Historique global des pointages d'arrivée validés sur le terrain.</p>
        </div>

        {/* Filtres URL-Driven */}
        <ReportFilters
          currentDate={dateFilter || ""}
          currentEmployeeId={employeeFilter || ""}
          employees={employeesList.map((e) => ({ id: e.id, name: `${e.lastName.toUpperCase()} ${e.firstName}` }))}
        />

        {/* Tableau des Rapports */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-950 text-white text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Agent Security ID</th>
                  <th className="p-4">Identité</th>
                  <th className="p-4">Mission / Client</th>
                  <th className="p-4">Date & Heure Pointée</th>
                  <th className="p-4">Validé Par</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-blue-950">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono text-xs text-blue-800/70">
                      #{record.employee.id.split("-")[0].toUpperCase()}
                    </td>
                    <td className="p-4 font-semibold">
                      {record.employee.lastName.toUpperCase()} {record.employee.firstName}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-blue-950">{record.mission.client.name}</span>
                      <span className="block text-xs text-blue-800/50">Planifié : {record.mission.plannedStartAt.toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 border border-blue-100 text-blue-900 font-bold text-xs">
                        ⏱️ {record.arrivedAt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-blue-800/70">
                      {record.createdBy.name || record.createdBy.email}
                    </td>
                  </tr>
                ))}

                {records.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm font-semibold text-red-600 bg-red-50/30">
                      ⚠️ Aucun enregistrement de pointage ne correspond à ces critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
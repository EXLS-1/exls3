// app/attendance/page.tsx

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Employee, Attendance } from "@prisma/client";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";

// En Next.js 15+, searchParams est une Promesse
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AttendancePage(props: { searchParams: SearchParams }) {
  
  // 1. Sécurité : Vérification stricte de la session côté serveur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }
 
  
  // 2. Gestion des filtres via l'URL (URL comme unique source de vérité)
  const searchParams = await props.searchParams;
  
  // Définit la date du jour par défaut (format YYYY-MM-DD local)
  const today = new Date().toLocaleDateString("en-CA"); 
  const selectedDate = (searchParams.date as string) || today;
  const selectedMissionId = searchParams.missionId as string | undefined;

  // 3. Récupération optimisée des données (Prisma)
  
  // A. Récupérer toutes les missions actives pour le filtre (Dropdown)
  const missions = await prisma.mission.findMany({
    where: {
      status: { in: ["PLANNED", "IN_PROGRESS"] },
      // Optionnel : tu pourras affiner ici pour ne charger que les missions de `selectedDate`
    },
    select: { id: true, client: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Formatage pour le composant Client AttendanceFilters
  const missionOptions = missions.map((m) => ({
    id: m.id,
    label: `Mission - ${m.client.name}`,
  }));

  // B. Récupérer les employés assignés SI une mission est sélectionnée
  let assignedEmployees: (Employee & { attendance: Attendance[] })[] = [];
  
  if (selectedMissionId) {
    // Requête relationnelle optimisée : on charge les employés de la mission ET leur pointage pour cette mission spécifique
    assignedEmployees = await prisma.employee.findMany({
      where: {
        missions: { some: { missionId: selectedMissionId } },
      },
      include: {
        attendance: {
          where: { missionId: selectedMissionId },
          take: 1, // On ne prend que le dernier pointage (sécurité contre les doublons)
        },
      },
      orderBy: { lastName: "asc" },
    });
  }

  return (
    <main className="flex-1 bg-slate-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête de page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">
              Pointage & Présences
            </h1>
            <p className="text-sm text-blue-800/70 mt-1">
              Gérez les arrivées du personnel sur le terrain en temps réel.
            </p>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
            {today === selectedDate ? "Aujourd'hui" : "Archive"}
          </div>
        </div>

        {/* Composant Client : Filtres (URL-driven) */}
        <AttendanceFilters
          initialDate={selectedDate}
          initialMissionId={selectedMissionId || ""}
          missions={missionOptions}
        />

        {/* Zone de contenu dynamique */}
        {!selectedMissionId ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-blue-100 shadow-sm border-dashed">
            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <svg className="size-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-blue-950 font-semibold">Aucune mission sélectionnée</p>
            <p className="text-sm text-blue-800/60 mt-1">Veuillez choisir une mission pour afficher le personnel assigné.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-blue-50 bg-blue-950/5">
              <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
                Personnel Assigné ({assignedEmployees.length})
              </h2>
            </div>
            
            <ul className="divide-y divide-blue-50">
              {assignedEmployees.map((employee) => {
                const hasAttended = employee.attendance.length > 0;
                const arrivalRecord = hasAttended ? employee.attendance[0] : null;

                return (
                  <li key={employee.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold border border-blue-200">
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-blue-950">
                          {employee.lastName} {employee.firstName}
                        </p>
                        <p className="text-xs font-medium text-blue-800/60">
                          ID: {employee.id.split("-")[0].toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:justify-end">
                      {hasAttended ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                          <svg className="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-bold text-blue-900">
                            Arrivé à {arrivalRecord.arrivedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full sm:w-auto">
                          {/* Le composant client gère l'action serveur.
                            On lui passe les identifiants en props pour le binding sécurisé.
                          */}
                          <AttendanceForm
                            missionId={selectedMissionId}
                            employeeId={employee.id}
                            missionDate={selectedDate}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}

              {assignedEmployees.length === 0 && (
                <li className="p-8 text-center">
                  <p className="text-sm text-red-600 font-semibold">Aucun agent assigné à cette mission.</p>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
// data/data-fetch.ts
// Ce fichier contient des fonctions de récupération de données côté serveur pour les employés et les sites, utilisées dans les composants de filtrage. Ces fonctions utilisent Prisma pour interagir avec la base de données et sont conçues pour être utilisées dans une application Next.js avec une architecture de type "app directory".
// Note: Les fonctions sont définies avec "use server" pour indiquer qu'elles doivent être exécutées côté serveur, et elles gèrent les erreurs en retournant des tableaux vides en cas de problème de récupération des données.
// Importation de Prisma pour interagir avec la base de données
// Les fonctions de récupération de données sont définies avec "use server" pour indiquer qu'elles doivent être exécutées côté serveur dans une application Next.js.
// Fonction pour récupérer la liste des employés, utilisée dans les filtres de la liste des sites
// Fonction pour récupérer la liste des sites, utilisée dans les filtres de la liste des sites

"use server";

import { prisma } from "@/lib/prisma";

export async function getEmployeesForFilter() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { lastName: "asc" },
    });
    return employees;
  } catch (error) {
    console.error("Error fetching employees for filter:", error);
    return [];
  }
}

export async function getSitesForFilter() {
  try {
    const sites = await prisma.site.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return sites;
  } catch (error) {
    console.error("Error fetching sites for filter:", error);
    return [];
  }
}
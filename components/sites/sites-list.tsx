// components/sites/sites-list.tsx
// Ce composant Server-Side affiche la liste complète des sites d'exploitation.
// Il utilise Prisma pour récupérer les données avec les jointures nécessaires (Client).
// Il intègre également des fonctionnalités de recherche et de filtrage via les searchParams de Next.js.
// Le design est optimisé pour un ERP professionnel avec une attention particulière à la lisibilité et à l'accessibilité.

import React from "react";
import { prisma } from "@/lib/prisma";
import { 
  Building2, 
  MapPin, 
  User, 
  Calendar, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SitesFilters } from "./sites-filters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Composant de liste des sites d'exploitation.
 */
export async function SitesList({
  searchParams,
}: {
  searchParams: {
    search?: string;
    clientId?: string;
    page?: string;
  };
}) {
  const { search, clientId, page = "1" } = searchParams;
  const currentPage = parseInt(page);
  const pageSize = 10; // Nombre d'éléments par page

  const whereClause: Prisma.SiteWhereInput = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { managerName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (clientId) {
    whereClause.clientId = clientId;
  }

  // Calcul du nombre total pour la pagination
  const totalSites = await prisma.site.count({ where: whereClause });
  const totalPages = Math.ceil(totalSites / pageSize);

  const sites = await prisma.site.findMany({
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
    where: whereClause,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/40">
        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Building2 className="size-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Aucun site disponible</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
          La base de données ne contient aucun site d'exploitation pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SitesFilters clients={clients} />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Site & Localisation</th>
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Client Propriétaire</th>
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Responsable Site</th>
              <th className="px-6 py-4 font-bold text-blue-950 uppercase text-[10px] tracking-widest">Date Ouverture</th>
              <th className="px-6 py-4 text-right font-bold text-blue-950 uppercase text-[10px] tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sites.map((site) => (
              <tr key={site.id} className="group hover:bg-blue-50/20 transition-all duration-200">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {site.name}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <MapPin className="size-3 text-blue-400" />
                      {site.address}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {site.client.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <User className="size-4 text-slate-500 group-hover:text-blue-600" />
                    </div>
                    <span className="font-semibold">{site.managerName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="size-4 text-slate-400" />
                    {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(site.openingDate))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-white hover:shadow-sm">
                        <MoreHorizontal className="size-4 text-slate-400 group-hover:text-blue-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl border-slate-100 shadow-xl">
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1.5">Options site</DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-1 bg-slate-50" />
                      <DropdownMenuItem className="flex items-center gap-2 rounded-xl py-2.5 cursor-pointer focus:bg-blue-50 focus:text-blue-700"><Pencil className="size-4" /> <span className="text-sm font-medium">Modifier</span></DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 rounded-xl py-2.5 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"><Trash2 className="size-4" /> <span className="text-sm font-medium">Supprimer</span></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Professionnelle */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Affichage de {sites.length} sur {totalSites} sites
          </p>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious 
                  href={`?page=${currentPage - 1}${search ? `&search=${search}` : ""}${clientId ? `&clientId=${clientId}` : ""}`}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "rounded-xl"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href={`?page=${i + 1}${search ? `&search=${search}` : ""}${clientId ? `&clientId=${clientId}` : ""}`}
                    isActive={currentPage === i + 1}
                    className="rounded-xl font-bold"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href={`?page=${currentPage + 1}${search ? `&search=${search}` : ""}${clientId ? `&clientId=${clientId}` : ""}`}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "rounded-xl"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

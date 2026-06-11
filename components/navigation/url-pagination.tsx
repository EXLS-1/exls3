import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

interface UrlPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsOnPage: number;
  basePath: string;
  queryParams: Record<string, string | undefined>;
}

export function UrlPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsOnPage,
  basePath,
  queryParams,
}: UrlPaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Affichage de {itemsOnPage} sur {totalItems} éléments
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Link
          href={buildHref(currentPage - 1)}
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            currentPage <= 1
              ? "pointer-events-none opacity-40 text-slate-400"
              : "text-slate-700 hover:bg-slate-200/50"
          )}
        >
          Précédent
        </Link>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = currentPage === page;

          return (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center justify-center size-9 rounded-xl text-sm font-bold transition-all",
                isActive
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200/50"
              )}
            >
              {page}
            </Link>
          );
        })}

        <Link
          href={buildHref(currentPage + 1)}
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            currentPage >= totalPages
              ? "pointer-events-none opacity-40 text-slate-400"
              : "text-slate-700 hover:bg-slate-200/50"
          )}
        >
          Suivant
        </Link>
      </nav>
    </div>
  );
}
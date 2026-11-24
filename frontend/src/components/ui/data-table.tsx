"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  mobileCardRender?: (item: T) => React.ReactNode;
  pageSize?: number;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
}

/**
 * Desktop: Data Table with sorting & Pagination
 * Mobile: Card list automatically
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  mobileCardRender,
  pageSize = 8,
  emptyState,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [data, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  if (data.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop Data Table */}
      <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/60 border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={cn("px-4 py-3.5 font-semibold", col.className)}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-foreground cursor-pointer"
                      >
                        {col.header}
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors hover:bg-muted/40",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5", col.className)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
            <span>
              แสดง {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} จาก {sorted.length} รายการ
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 font-medium text-foreground">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {sorted.map((item, idx) =>
          mobileCardRender ? (
            <div key={item.id || idx} onClick={() => onRowClick?.(item)}>
              {mobileCardRender(item)}
            </div>
          ) : (
            <div
              key={item.id || idx}
              onClick={() => onRowClick?.(item)}
              className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2"
            >
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{col.header}:</span>
                  <span className="font-medium text-right">{col.render ? col.render(item) : item[col.key]}</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

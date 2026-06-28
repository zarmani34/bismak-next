"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;
  isError?: boolean;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  /**
   * Pass globalFilter from the parent page so search lives outside the table.
   * If not passed, table manages its own internal search state.
   */
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-primary-light/30 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (!direction) {
    return (
      <svg className="w-3.5 h-3.5 opacity-40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 10l4-4 4 4H8zm8 4l-4 4-4-4h8z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
      <path d={direction === "asc" ? "M8 14l4-4 4 4H8z" : "M16 10l-4 4-4-4h8z"} />
    </svg>
  );
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  isError = false,
  pageSize = 10,
  onRowClick,
  globalFilter: externalFilter,
  onGlobalFilterChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalFilter, setInternalFilter] = useState("");

  // Use external filter if provided, otherwise internal
  const globalFilter = externalFilter ?? internalFilter;
  const setGlobalFilter = onGlobalFilterChange ?? setInternalFilter;

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const totalFiltered = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div className="bg-primary-light/10 rounded-b-xl overflow-hidden border border-t-0 border-primary-light/20"
      style={{ boxShadow: "0 6px 18px rgba(26, 36, 33, 0.06)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary-light/40 border-b border-primary-light/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-left font-semibold text-primary-dark whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={`flex items-center gap-1.5 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-primary"
                            : "cursor-default"
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon direction={header.column.getIsSorted()} />
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))}

            {!isLoading && isError && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-error">
                  Failed to load data. Please try again.
                </td>
              </tr>
            )}

            {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-muted">
                  {globalFilter ? `No results for "${globalFilter}"` : "No records found."}
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`border-b border-primary-light/20 last:border-0 transition-colors
                    ${onRowClick
                      ? "cursor-pointer hover:bg-tetiary/50"
                      : "hover:bg-tetiary/30"
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3.5 text-body-text">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalFiltered > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-primary-light/20 bg-primary-light/10">
          <p className="text-xs text-muted">
            Showing{" "}
            <span className="font-semibold text-primary-dark">
              {pageIndex * currentPageSize + 1}–
              {Math.min((pageIndex + 1) * currentPageSize, totalFiltered)}
            </span>{" "}
            of <span className="font-semibold text-primary-dark">{totalFiltered}</span>
          </p>

          <div className="flex items-center gap-0.5">
            {[
              {
                label: "First",
                icon: "M11 19l-7-7 7-7M19 19l-7-7 7-7",
                onClick: () => table.setPageIndex(0),
                disabled: !table.getCanPreviousPage(),
              },
              {
                label: "Previous",
                icon: "M15 19l-7-7 7-7",
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              },
              {
                label: "Next",
                icon: "M9 5l7 7-7 7",
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              },
              {
                label: "Last",
                icon: "M13 5l7 7-7 7M5 5l7 7-7 7",
                onClick: () => table.setPageIndex(pageCount - 1),
                disabled: !table.getCanNextPage(),
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled}
                aria-label={btn.label}
                className="p-1.5 rounded-lg text-primary-dark hover:bg-primary/10 hover:text-primary
                  disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon} />
                </svg>
              </button>
            ))}

            <span className="px-3 text-xs font-medium text-primary-dark">
              {pageIndex + 1} / {pageCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
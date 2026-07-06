"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FaArrowUpRightFromSquare, FaEye } from "react-icons/fa6";
import { ColumnDef } from "@tanstack/react-table";
import TableSkeleton from "../skeletons/TableSkeleton";
import { getQuoteActions, QuoteActionKey } from "../../utils/billingActions";
import { DataTable } from "./Datatable";

type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "revised";

type QuoteRow = {
  code: string;
  project: string | null;
  service_request: string | null;
  amount: number;
  status: QuoteStatus | string;
  status_display: string;
  quoted_by: string;
  valid_until: string | null;
  created_at: string;
  has_invoice: boolean;
  invoice_code: string | null;
};

type BillingQuotesTableProps = {
  quotes: QuoteRow[];
  formatCurrency: (value: number) => string;
  formatDate: (value: string | null) => string;
  getQuoteStatusColor: (status: string) => string;
  role: "admin" | "client";
  isLoading?: boolean;
  onQuickAction?: (quote: QuoteRow, actionKey: QuoteActionKey) => void | Promise<void>;
  isActionPending?: boolean;
  actionError?: string | null;
};

export default function BillingQuotesTable({
  quotes,
  formatCurrency,
  formatDate,
  getQuoteStatusColor,
  role,
  isLoading = false,
  onQuickAction,
  isActionPending = false,
  actionError,
}: BillingQuotesTableProps) {
  const billingBase = role === "admin" ? "/portal/admin/billing" : "/portal/client/billings";

  const columns = useMemo<ColumnDef<QuoteRow>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Quote Code",
        cell: ({ getValue }) => (
          <Link
            href={`${billingBase}/quotes/${getValue() as string}`}
            className="font-medium text-primary-dark hover:text-primary"
          >
            {getValue() as string}
          </Link>
        ),
      },
      {
        id: "linkedRecord",
        header: "Linked Record",
        cell: ({ row }) =>
          row.original.project ? (
            <Link
              href={`/portal/${role}/projects/${row.original.project}`}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <FaArrowUpRightFromSquare className="h-3 w-3 text-secondary-text" />
              {row.original.project}
            </Link>
          ) : row.original.service_request ? (
            <Link
              href={`/portal/${role}/services/${row.original.service_request}`}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <FaArrowUpRightFromSquare className="h-3 w-3 text-secondary-text" />
              {row.original.service_request}
            </Link>
          ) : (
            "-"
          ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => formatCurrency(getValue() as number),
      },
      {
        accessorKey: "status_display",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getQuoteStatusColor(
              row.original.status,
            )}`}
          >
            {row.original.status_display}
          </span>
        ),
      },
      {
        accessorKey: "valid_until",
        header: "Valid Until",
        cell: ({ getValue }) => formatDate(getValue() as string | null),
      },
      {
        accessorKey: "quoted_by",
        header: "Quoted By",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const quote = row.original;
          const quickActions = getQuoteActions({
            role,
            status: quote.status,
            hasInvoice: quote.has_invoice,
          });

          return (
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                if (action.key === "view_invoice" && quote.invoice_code) {
                  return (
                    <Link
                      key={action.key}
                      href={`${billingBase}/invoices/${quote.invoice_code}`}
                      className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary-dark hover:bg-primary-light/20"
                    >
                      {action.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={action.key}
                    type="button"
                    disabled={isActionPending}
                    onClick={() => void onQuickAction?.(quote, action.key)}
                    className={`rounded-md border px-2 py-1 text-xs font-medium disabled:opacity-60 ${
                      action.tone === "primary"
                        ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                        : "border-border text-primary-dark hover:bg-primary-light/20"
                    }`}
                  >
                    {action.label}
                  </button>
                );
              })}
              <Link
                href={`${billingBase}/quotes/${quote.code}`}
                className="p-2 text-body-text hover:text-primary-light"
                aria-label="View quote"
              >
                <FaEye className="h-4 w-4" />
              </Link>
            </div>
          );
        },
      },
    ],
    [billingBase, formatCurrency, formatDate, isActionPending, onQuickAction, role],
  );

  return (
    <div className="rounded-xl border border-border shadow-sm overflow-hidden">
      {actionError ? (
        <div className="border-b border-border px-6 py-3 text-xs text-secondary-light">
          {actionError}
        </div>
      ) : null}
      <DataTable
        data={quotes}
        columns={columns}
        isLoading={isLoading}
        isError={false}
        pageSize={10}
        onRowClick={(row) => {
          window.location.href = `${billingBase}/quotes/${row.code}`;
        }}
      />
    </div>
  );
}

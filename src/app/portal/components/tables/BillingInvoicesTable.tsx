"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FaDownload, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import { getInvoiceActions, InvoiceActionKey } from "../../utils/billingActions";
import { DataTable } from "./Datatable";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

type InvoiceRow = {
  id: string;
  code: string;
  quote: string;
  amount: number;
  status: InvoiceStatus | string;
  status_display: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
};

type BillingInvoicesTableProps = {
  invoices: InvoiceRow[];
  formatCurrency: (value: number) => string;
  formatDate: (value: string | null) => string;
  getInvoiceStatusColor: (status: string) => string;
  role: "admin" | "client";
  isLoading?: boolean;
  onQuickAction?: (invoice: InvoiceRow, actionKey: InvoiceActionKey) => void | Promise<void>;
  isActionPending?: boolean;
  actionError?: string | null;
};

export default function BillingInvoicesTable({
  invoices,
  formatCurrency,
  formatDate,
  getInvoiceStatusColor,
  role,
  isLoading = false,
  onQuickAction,
  isActionPending = false,
  actionError,
}: BillingInvoicesTableProps) {
  const billingBase = role === "admin" ? "/portal/admin/billing" : "/portal/client/billings";

  const columns = useMemo<ColumnDef<InvoiceRow>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Invoice Code",
        cell: ({ getValue }) => (
          <Link
            href={`${billingBase}/invoices/${getValue() as string}`}
            className="font-medium text-primary-dark hover:text-primary"
          >
            {getValue() as string}
          </Link>
        ),
      },
      {
        accessorKey: "quote",
        header: "Quote",
        cell: ({ getValue }) => (
          <Link
            href={`${billingBase}/quotes/${getValue() as string}`}
            className="hover:text-primary"
          >
            {getValue() as string}
          </Link>
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
            className={`rounded-full px-3 py-1 text-xs font-medium ${getInvoiceStatusColor(
              row.original.status,
            )}`}
          >
            {row.original.status_display}
          </span>
        ),
      },
      {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ getValue }) => formatDate(getValue() as string | null),
      },
      {
        accessorKey: "paid_at",
        header: "Paid At",
        cell: ({ getValue }) => {
          const paidAt = getValue() as string | null;
          return paidAt ? formatDate(paidAt) : "-";
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const invoice = row.original;
          const quickActions = getInvoiceActions({
            role,
            status: invoice.status,
          });

          return (
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  disabled={isActionPending}
                  onClick={() => void onQuickAction?.(invoice, action.key)}
                  className={`rounded-md border px-2 py-1 text-xs font-medium disabled:opacity-60 ${
                    action.tone === "primary"
                      ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                      : "border-border text-primary-dark hover:bg-primary-light/20"
                  }`}
                >
                  {action.label}
                </button>
              ))}
              <Link
                href={`${billingBase}/invoices/${invoice.code}`}
                className="p-2 text-body-text hover:text-primary-light"
                aria-label="View invoice"
              >
                <FaEye className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="p-2 text-body-text hover:text-primary-light"
                aria-label="Download invoice"
              >
                <FaDownload className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [billingBase, formatCurrency, formatDate, getInvoiceStatusColor, isActionPending, onQuickAction, role],
  );

  return (
    <div className="rounded-xl border border-border shadow-sm overflow-hidden">
      {actionError ? (
        <div className="border-b border-border px-6 py-3 text-xs text-secondary-light">
          {actionError}
        </div>
      ) : null}
      <DataTable
        data={invoices}
        columns={columns}
        isLoading={isLoading}
        isError={false}
        pageSize={10}
        onRowClick={(row) => {
          window.location.href = `${billingBase}/invoices/${row.code}`;
        }}
      />
    </div>
  );
}

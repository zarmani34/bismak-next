"use client";

import Link from "next/link";
import { FaDownload, FaEye } from "react-icons/fa";
import TableSkeleton from "../skeletons/TableSkeleton";
import { getInvoiceActions, InvoiceActionKey } from "../../utils/billingActions";

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

  return (
    <table className="w-full">
      <thead className="bg-primary-light/40 border-b border-tetiary">
        <tr>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Invoice Code
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Quote
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Amount
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Status
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Due Date
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Paid At
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {actionError ? (
          <tr>
            <td colSpan={7} className="px-6 py-3 text-xs text-secondary-light">
              {actionError}
            </td>
          </tr>
        ) : null}

        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : invoices.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary-text">
              No invoices match this filter.
            </td>
          </tr>
        ) : (
          invoices.map((invoice) => {
            const quickActions = getInvoiceActions({
              role,
              status: invoice.status,
            });

            return (
            <tr key={invoice.code} className="border-b border-tetiary hover:bg-primary/20">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
                <Link href={`${billingBase}/invoices/${invoice.code}`} className="hover:text-primary">
                  {invoice.code}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                <Link href={`${billingBase}/quotes/${invoice.quote}`} className="hover:text-primary">
                  {invoice.quote}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {formatCurrency(invoice.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(
                    invoice.status,
                  )}`}
                >
                  {invoice.status_display}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {formatDate(invoice.due_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {invoice.paid_at ? formatDate(invoice.paid_at) : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      disabled={isActionPending}
                      onClick={() => void onQuickAction?.(invoice, action.key)}
                      className={`px-2 py-1 rounded-md text-xs font-medium border ${
                        action.tone === "primary"
                          ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                          : "border-border text-primary-dark hover:bg-primary-light/20"
                      } disabled:opacity-60`}
                    >
                      {action.label}
                    </button>
                  ))}
                  <Link
                    href={`${billingBase}/invoices/${invoice.code}`}
                    className="p-2 text-body-text hover:text-primary-light"
                    aria-label="View invoice"
                  >
                    <FaEye className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 text-body-text hover:text-primary-light"
                    aria-label="Download invoice"
                  >
                    <FaDownload className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )})
        )}
      </tbody>
    </table>
  );
}

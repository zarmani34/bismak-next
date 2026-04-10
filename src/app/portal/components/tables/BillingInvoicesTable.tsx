"use client";

import { FaDownload, FaEye } from "react-icons/fa";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

type InvoiceRow = {
  code: string;
  quote: string;
  amount: number;
  status: InvoiceStatus;
  status_display: string;
  due_date: string;
  paid_at: string | null;
};

type BillingInvoicesTableProps = {
  invoices: InvoiceRow[];
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  getInvoiceStatusColor: (status: InvoiceStatus) => string;
};

export default function BillingInvoicesTable({
  invoices,
  formatCurrency,
  formatDate,
  getInvoiceStatusColor,
}: BillingInvoicesTableProps) {
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
        {invoices.map((invoice) => (
          <tr key={invoice.code} className="border-b border-tetiary hover:bg-primary/20">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
              {invoice.code}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
              {invoice.quote}
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
                <button
                  className="p-2 text-body-text hover:text-primary-light"
                  aria-label="View invoice"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-body-text hover:text-primary-light"
                  aria-label="Download invoice"
                >
                  <FaDownload className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {invoices.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary-text">
              No invoices match this filter.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}


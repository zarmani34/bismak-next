"use client";

import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import TableSkeleton from "../skeletons/TableSkeleton";

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
};

type BillingQuotesTableProps = {
  quotes: QuoteRow[];
  formatCurrency: (value: number) => string;
  formatDate: (value: string | null) => string;
  getQuoteStatusColor: (status: string) => string;
  role: "admin" | "client";
  isLoading?: boolean;
};

export default function BillingQuotesTable({
  quotes,
  formatCurrency,
  formatDate,
  getQuoteStatusColor,
  role,
  isLoading = false,
}: BillingQuotesTableProps) {
  const billingBase = role === "admin" ? "/portal/admin/billing" : "/portal/client/billings";

  return (
    <table className="w-full">
      <thead className="bg-primary-light/40 border-b border-tetiary">
        <tr>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Quote Code
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Linked Record
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Amount
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Status
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Valid Until
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Quoted By
          </th>
          <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : quotes.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary-text">
              No quotes match this filter.
            </td>
          </tr>
        ) : (
          quotes.map((quote) => (
            <tr key={quote.code} className="border-b border-tetiary hover:bg-primary/20">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
                <Link href={`${billingBase}/quotes/${quote.code}`} className="hover:text-primary">
                  {quote.code}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {quote.project ? (
                  <Link
                    href={`/portal/${role}/projects/${quote.project}`}
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    <FaArrowUpRightFromSquare className="w-3 h-3 text-secondary-text" />
                    {quote.project}
                  </Link>
                ) : (
                  quote.service_request ? (
                    <Link
                      href={`/portal/${role}/services/${quote.service_request}`}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      <FaArrowUpRightFromSquare className="w-3 h-3 text-secondary-text" />
                      {quote.service_request}
                    </Link>
                  ) : (
                    "-"
                  )
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {formatCurrency(quote.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getQuoteStatusColor(
                    quote.status,
                  )}`}
                >
                  {quote.status_display}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {formatDate(quote.valid_until)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {quote.quoted_by}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    href={`${billingBase}/quotes/${quote.code}`}
                    className="p-2 text-body-text hover:text-primary-light"
                    aria-label="View quote"
                  >
                    <FaEye className="w-4 h-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

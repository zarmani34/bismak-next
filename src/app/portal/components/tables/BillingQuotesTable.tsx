"use client";

import { FaEye } from "react-icons/fa";
import { FaArrowUpRightFromSquare, FaList } from "react-icons/fa6";

type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "revised";

type QuoteRow = {
  code: string;
  project: string | null;
  service_request: string | null;
  amount: number;
  status: QuoteStatus;
  status_display: string;
  quoted_by: string;
  valid_until: string;
};

type BillingQuotesTableProps = {
  quotes: QuoteRow[];
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  getQuoteStatusColor: (status: QuoteStatus) => string;
};

export default function BillingQuotesTable({
  quotes,
  formatCurrency,
  formatDate,
  getQuoteStatusColor,
}: BillingQuotesTableProps) {
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
        {quotes.map((quote) => (
          <tr key={quote.code} className="border-b border-tetiary hover:bg-primary/20">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
              {quote.code}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
              {quote.project ? (
                <span className="inline-flex items-center gap-1">
                  <FaArrowUpRightFromSquare className="w-3 h-3 text-secondary-text" />
                  {quote.project}
                </span>
              ) : (
                `Request #${quote.service_request?.slice(0, 8)}`
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
                <button
                  className="p-2 text-body-text hover:text-primary-light"
                  aria-label="View quote"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-body-text hover:text-primary-light"
                  aria-label="Open quote list"
                >
                  <FaList className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {quotes.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary-text">
              No quotes match this filter.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}


"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaFileInvoice, FaPrint } from "react-icons/fa6";
import { useInvoiceByCode, useQuote } from "@/hooks/useBilling";
import ErrorState from "../states/ErrorState";
import { formatDate, formatDateTime } from "@/src/utils/date";
import { getStatusColor } from "../../constants";

type InvoiceDetailPageProps = {
  role: "admin" | "client";
};

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(typeof value === "number" ? value : Number.parseFloat(value || "0"));

export default function InvoiceDetailPage({ role }: InvoiceDetailPageProps) {
  const params = useParams();
  const invoiceCode = typeof params?.code === "string" ? params.code : "";
  const billingBase = role === "admin" ? "/portal/admin/billing" : "/portal/client/billings";

  const { data: invoice, isLoading, isError, refetch } = useInvoiceByCode(invoiceCode);

  const quoteCode = invoice?.quote ?? "";
  const { data: quote } = useQuote(quoteCode);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading invoice details...
      </div>
    );
  }

  if (isError || !invoice) {
    return <ErrorState message="Unable to load invoice details." onRetry={() => refetch()} />;
  }

  const linkedRecordHref = quote?.project
    ? `/portal/${role}/projects/${quote.project}`
    : quote?.service_request
      ? `/portal/${role}/services/${quote.service_request}`
      : null;

  const linkedRecordLabel = quote?.project
    ? `Project ${quote.project}`
    : quote?.service_request
      ? `Service ${quote.service_request}`
      : "No linked record";

  const quoteItems = quote?.items ?? [];
  const hasItems = quoteItems.length > 0;

  const itemsSubtotal = quoteItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.total || "0"),
    0,
  );

  const invoiceAmount = Number.parseFloat(invoice.amount || "0");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href={billingBase}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Billing
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`${billingBase}/quotes/${invoice.quote}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-primary-dark hover:bg-primary-light/20"
          >
            <FaFileInvoice className="w-3 h-3" />
            View Quote
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-tetiary text-sm"
          >
            <FaPrint className="w-3 h-3" />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-primary-light/20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-secondary-text">INVOICE</p>
                <h1 className="text-2xl font-bold text-primary-dark mt-1">{invoice.code}</h1>
                <p className="text-xs text-secondary-text mt-1">Issued {formatDateTime(invoice.created_at)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status_display}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Bill To</p>
                <p className="text-sm font-semibold text-primary-dark mt-2">
                  {quote?.owner?.full_name || "Unknown Client"}
                </p>
                <p className="text-xs text-secondary-text mt-1">{quote?.owner?.email || "--"}</p>
                <p className="text-xs text-secondary-text mt-1">{quote?.owner?.user_id || "--"}</p>
              </div>

              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Invoice Meta</p>
                <div className="mt-2 space-y-2 text-sm text-primary-dark">
                  <p>Quote Ref: <span className="font-medium">{invoice.quote}</span></p>
                  <p>Due Date: <span className="font-medium">{formatDate(invoice.due_date)}</span></p>
                  <p>Paid At: <span className="font-medium">{formatDateTime(invoice.paid_at)}</span></p>
                  <p>Linked: <span className="font-medium">{linkedRecordLabel}</span></p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 bg-primary-light/20 border-b border-border">
                <h2 className="text-sm font-semibold text-primary-dark">Billable Items</h2>
              </div>

              {hasItems ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-primary-light/20 border-b border-border">
                      <tr>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Description</th>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Qty</th>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Unit Price</th>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item) => (
                        <tr key={item.id} className="border-b border-border/70 last:border-0">
                          <td className="p-3 text-sm text-primary-dark">{item.description}</td>
                          <td className="p-3 text-sm text-primary-dark">{item.quantity}</td>
                          <td className="p-3 text-sm text-primary-dark">{formatCurrency(item.unit_price)}</td>
                          <td className="p-3 text-sm font-medium text-primary-dark">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-sm text-secondary-text">
                  No itemized quote lines found. Invoice billed as a single total amount.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6">
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Notes</p>
                <p className="text-sm text-primary-dark mt-2 leading-relaxed">
                  {invoice.note || quote?.note || "No note provided."}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-tetiary/80 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Amount Due</p>
                <div className="flex items-center justify-between text-sm text-primary-dark">
                  <span>Items Subtotal</span>
                  <span>{formatCurrency(itemsSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-primary-dark">
                  <span>Invoice Total</span>
                  <span>{formatCurrency(invoiceAmount)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between text-base font-semibold text-primary-dark">
                  <span>Total Due</span>
                  <span>{formatCurrency(invoiceAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Payment Timeline</h3>
            <div className="mt-3 space-y-3 text-xs text-secondary-text">
              <div>
                <p className="uppercase tracking-wide">Issued</p>
                <p className="text-primary-dark mt-1">{formatDateTime(invoice.created_at)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Due</p>
                <p className="text-primary-dark mt-1">{formatDate(invoice.due_date)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Paid</p>
                <p className="text-primary-dark mt-1">{formatDateTime(invoice.paid_at)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Linked Record</h3>
            {linkedRecordHref ? (
              <Link href={linkedRecordHref} className="text-sm font-medium text-primary-dark hover:text-primary inline-block mt-2">
                Open {linkedRecordLabel}
              </Link>
            ) : (
              <p className="text-sm text-secondary-text mt-2">No linked record available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

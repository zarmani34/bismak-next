"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaFileInvoice, FaLink } from "react-icons/fa6";
import { useQuote, useUpdateQuoteStatus } from "@/hooks/useBilling";
import ErrorState from "../states/ErrorState";
import { formatDate, formatDateTime } from "@/src/utils/date";
import { getStatusColor } from "../../constants";
import { extractApiError } from "@/lib/errors";
import { getQuoteActions, QuoteActionKey } from "../../utils/billingActions";

type QuoteDetailPageProps = {
  role: "admin" | "client";
};

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(typeof value === "number" ? value : Number.parseFloat(value || "0"));

export default function QuoteDetailPage({ role }: QuoteDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const quoteCode = typeof params?.code === "string" ? params.code : "";
  const billingBase = role === "admin" ? "/portal/admin/billing" : "/portal/client/billings";
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: quote, isLoading, isError, refetch } = useQuote(quoteCode);
  const updateQuoteStatus = useUpdateQuoteStatus();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading quote details...
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <ErrorState message="Unable to load quote details." onRetry={() => refetch()} />
    );
  }

  const linkedRecordHref = quote.project
    ? `/portal/${role}/projects/${quote.project}`
    : quote.service_request
      ? `/portal/${role}/services/${quote.service_request}`
      : null;

  const linkedRecordLabel = quote.project
    ? `Project ${quote.project}`
    : quote.service_request
      ? `Service ${quote.service_request}`
      : "No linked record";

  const itemsSubtotal = quote.items.reduce(
    (sum, item) => sum + Number.parseFloat(item.total || "0"),
    0,
  );

  const quoteAmount = Number.parseFloat(quote.amount || "0");
  const hasItems = quote.items.length > 0;
  const quoteActions = getQuoteActions({
    role,
    status: quote.status,
    hasInvoice: Boolean(quote.invoice),
  });

  const handleQuoteAction = async (actionKey: QuoteActionKey) => {
    setActionError(null);
    try {
      if (actionKey === "view_invoice") {
        if (quote.invoice?.code) {
          router.push(`${billingBase}/invoices/${quote.invoice.code}`);
        }
        return;
      }

      if (actionKey === "accept_quote") {
        await updateQuoteStatus.mutateAsync({ quoteCode: quote.code, status: "accepted" });
        return;
      }

      if (actionKey === "reject_quote") {
        await updateQuoteStatus.mutateAsync({ quoteCode: quote.code, status: "rejected" });
        return;
      }

      if (actionKey === "mark_revised") {
        await updateQuoteStatus.mutateAsync({ quoteCode: quote.code, status: "revised" });
        return;
      }

      if (actionKey === "mark_sent") {
        await updateQuoteStatus.mutateAsync({ quoteCode: quote.code, status: "sent" });
      }
    } catch (error) {
      setActionError(extractApiError(error));
    }
  };

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
          {linkedRecordHref ? (
            <Link
              href={linkedRecordHref}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-primary-dark hover:bg-primary-light/20"
            >
              <FaLink className="w-3 h-3" />
              Open Linked Record
            </Link>
          ) : null}

          {quote.invoice ? (
            <Link
              href={`${billingBase}/invoices/${quote.invoice.code}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-tetiary text-sm"
            >
              <FaFileInvoice className="w-3 h-3" />
              View Invoice
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-primary-light/20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-secondary-text">QUOTE</p>
                <h1 className="text-2xl font-bold text-primary-dark mt-1">{quote.code}</h1>
                <p className="text-xs text-secondary-text mt-1">Issued {formatDateTime(quote.created_at)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                {quote.status_display}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Prepared For</p>
                <p className="text-sm font-semibold text-primary-dark mt-2">
                  {quote.owner?.full_name || "Unknown Client"}
                </p>
                <p className="text-xs text-secondary-text mt-1">{quote.owner?.email || "--"}</p>
                <p className="text-xs text-secondary-text mt-1">{quote.owner?.user_id || "--"}</p>
              </div>

              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Linked Record</p>
                {linkedRecordHref ? (
                  <Link href={linkedRecordHref} className="text-sm font-semibold text-primary-dark mt-2 inline-block hover:text-primary">
                    {linkedRecordLabel}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-primary-dark mt-2">{linkedRecordLabel}</p>
                )}
                <p className="text-xs text-secondary-text mt-1">Quoted by {quote.quoted_by?.full_name || "--"}</p>
                <p className="text-xs text-secondary-text mt-1">Valid until {formatDate(quote.valid_until)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 bg-primary-light/20 border-b border-border">
                <h2 className="text-sm font-semibold text-primary-dark">Item Breakdown</h2>
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
                      {quote.items.map((item) => (
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
                  No itemized rows attached to this quote.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6">
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Notes</p>
                <p className="text-sm text-primary-dark mt-2 leading-relaxed">
                  {quote.note || "No note provided."}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-tetiary/80 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Summary</p>
                <div className="flex items-center justify-between text-sm text-primary-dark">
                  <span>Items Subtotal</span>
                  <span>{formatCurrency(itemsSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-primary-dark">
                  <span>Quoted Total</span>
                  <span>{formatCurrency(quoteAmount)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between text-sm font-semibold text-primary-dark">
                  <span>Grand Total</span>
                  <span>{formatCurrency(quoteAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Quote Actions</h3>
            {quoteActions.length === 0 ? (
              <p className="text-xs text-secondary-text mt-2">No available actions for this status.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {quoteActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => void handleQuoteAction(action.key)}
                    disabled={updateQuoteStatus.isPending}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium disabled:opacity-60 ${
                      action.tone === "primary"
                        ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                        : "border-border text-primary-dark hover:bg-primary-light/20"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            {actionError ? <p className="text-xs text-secondary-light mt-2">{actionError}</p> : null}
          </div>

          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Timeline</h3>
            <div className="mt-3 space-y-3 text-xs text-secondary-text">
              <div>
                <p className="uppercase tracking-wide">Created</p>
                <p className="text-primary-dark mt-1">{formatDateTime(quote.created_at)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Updated</p>
                <p className="text-primary-dark mt-1">{formatDateTime(quote.updated_at)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Accepted At</p>
                <p className="text-primary-dark mt-1">{formatDateTime(quote.accepted_at)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Rejected At</p>
                <p className="text-primary-dark mt-1">{formatDateTime(quote.rejected_at)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Reference</h3>
            <div className="mt-3 space-y-2 text-xs text-secondary-text">
              <p>Linked: <span className="text-primary-dark">{linkedRecordLabel}</span></p>
              <p>Status: <span className="text-primary-dark">{quote.status_display}</span></p>
              <p>Valid: <span className="text-primary-dark">{formatDate(quote.valid_until)}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

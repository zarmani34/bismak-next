"use client";

import { useMemo } from "react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaXmark } from "react-icons/fa6";
import {
  useInvoices,
  useQuote,
  useQuotes,
  useUpdateInvoice,
  useUpdateQuoteStatus,
} from "@/hooks/useBilling";
import { extractApiError } from "@/lib/errors";

const formSchema = z.object({
  quoteCode: z.string().min(1, "Select a quote"),
  due_date: z.string().optional(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type GenerateInvoiceModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function GenerateInvoiceModal({ open, onClose }: GenerateInvoiceModalProps) {
  const {
    data: quotes = [],
    isLoading: isQuotesLoading,
  } = useQuotes();
  const { data: invoices = [] } = useInvoices();

  const updateQuoteStatus = useUpdateQuoteStatus();
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quoteCode: "",
      due_date: "",
      note: "",
    },
  });

  const eligibleQuotes = useMemo(() => {
    const invoicedQuoteCodes = new Set(invoices.map((invoice) => invoice.quote));
    return quotes.filter(
      (quote) =>
        !invoicedQuoteCodes.has(quote.code) &&
        ["sent", "revised", "accepted"].includes(quote.status.toLowerCase()),
    );
  }, [invoices, quotes]);

  const selectedQuoteCode = useWatch({ control, name: "quoteCode" }) ?? "";
  const selectedQuote = useMemo(
    () => eligibleQuotes.find((quote) => quote.code === selectedQuoteCode),
    [eligibleQuotes, selectedQuoteCode],
  );
  const {
    refetch: refetchSelectedQuoteDetail,
    isFetching: isQuoteDetailFetching,
  } = useQuote(selectedQuoteCode || "");

  const updateInvoice = useUpdateInvoice();

  const handleClose = () => {
    setActionError(null);
    reset();
    onClose();
  };

  const pending =
    isSubmitting ||
    updateQuoteStatus.isPending ||
    updateInvoice.isPending ||
    isQuoteDetailFetching;

  const onSubmit = async (data: FormData) => {
    setActionError(null);
    try {
      if (!selectedQuote) return;

      if (selectedQuote.status !== "accepted") {
        if (!["sent", "revised"].includes(selectedQuote.status)) {
          setActionError("Quote must be in Sent or Revised state before generating invoice.");
          return;
        }

        await updateQuoteStatus.mutateAsync({
          quoteCode: data.quoteCode,
          status: "accepted",
        });
      }

      const quoteDetailResponse = await refetchSelectedQuoteDetail();
      const refreshedInvoiceId = quoteDetailResponse.data?.invoice?.id;

      if (!refreshedInvoiceId) {
        setActionError("Invoice was generated but details are not yet available. Please refresh.");
        return;
      }

      const hasInvoicePatchData =
        Boolean(data.due_date?.trim()) || Boolean(data.note?.trim());

      await updateInvoice.mutateAsync({
        invoiceId: refreshedInvoiceId,
        invoiceData: {
          status: "sent",
          due_date: hasInvoicePatchData && data.due_date?.trim() ? data.due_date : undefined,
          note: hasInvoicePatchData && data.note?.trim() ? data.note.trim() : undefined,
        },
      });

      handleClose();
    } catch {
      // handled by query error states above
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-dark/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-primary-light bg-tetiary shadow-xl overflow-auto"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark/80">Generate Invoice</h2>
              <p className="text-sm text-primary/70">
                Select a quote and generate an invoice from it.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-primary/60 hover:text-secondary-dark hover:scale-110 transition-colors"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">Quote</label>
              <select
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                {...register("quoteCode")}
              >
                <option value="" disabled>
                  {isQuotesLoading ? "Loading quotes..." : "Select quote"}
                </option>
                {eligibleQuotes.map((quote) => (
                  <option key={quote.code} value={quote.code}>
                    {quote.code} - {quote.status_display}
                  </option>
                ))}
              </select>
              {!isQuotesLoading && eligibleQuotes.length === 0 ? (
                <p className="text-xs text-secondary-text mt-1">
                  No eligible quotes found. Quotes that already produced invoices are excluded.
                </p>
              ) : null}
              {errors.quoteCode ? (
                <p className="text-xs text-secondary-light mt-1">{errors.quoteCode.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">Due Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("due_date")}
                />
              </div>

              <div className="rounded-xl border border-border bg-primary/10 p-3 text-xs text-secondary-text">
                <p>
                  Selected quote status: <span className="font-semibold text-primary-dark">{selectedQuote?.status_display ?? "-"}</span>
                </p>
                <p className="mt-1">
                  If quote is not accepted yet, this action will accept it and auto-create invoice.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">Note</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                placeholder="Optional invoice note"
                {...register("note")}
              />
            </div>

            {updateQuoteStatus.error ? (
              <p className="text-xs text-secondary-light">{extractApiError(updateQuoteStatus.error)}</p>
            ) : null}
            {updateInvoice.error ? (
              <p className="text-xs text-secondary-light">{extractApiError(updateInvoice.error)}</p>
            ) : null}
            {actionError ? <p className="text-xs text-secondary-light">{actionError}</p> : null}
          </div>

          <div className="p-6 pt-0 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-tetiary text-sm font-medium disabled:opacity-70"
            >
              {pending ? "Generating..." : "Generate Invoice"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-border text-primary-dark text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

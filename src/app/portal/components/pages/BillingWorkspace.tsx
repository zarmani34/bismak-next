"use client";

import { useMemo, useState } from "react";
import { FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import {
  FaClockRotateLeft,
  FaFileCircleCheck,
  FaFileInvoice,
  FaPlus,
} from "react-icons/fa6";
import DashboardStatsCard from "../DashBoardStatsCard";
import BillingInvoicesTable from "../tables/BillingInvoicesTable";
import BillingQuotesTable from "../tables/BillingQuotesTable";
import { formatDate } from "@/src/utils/date";
import { useInvoices, useQuotes } from "@/hooks/useBilling";
import StatsCardsSkeleton from "../skeletons/StatsCardsSkeleton";
import ErrorState from "../states/ErrorState";
import CreateQuoteModal from "../modals/CreateQuoteModal";
import GenerateInvoiceModal from "../modals/GenerateInvoiceModal";

type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "revised";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

type QuoteRow = {
  code: string;
  project: string | null;
  service_request: string | null;
  amount: number;
  status: string;
  status_display: string;
  quoted_by: string;
  valid_until: string | null;
  created_at: string;
};

type InvoiceRow = {
  code: string;
  quote: string;
  amount: number;
  status: string;
  status_display: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const getQuoteStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-primary-light/20 text-primary-dark";
    case "sent":
      return "bg-info/20 text-info";
    case "accepted":
      return "bg-primary/20 text-primary";
    case "rejected":
      return "bg-error/20 text-error";
    case "revised":
      return "bg-secondary/20 text-secondary";
    default:
      return "bg-primary-light/20 text-primary-dark";
  }
};

const getInvoiceStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-primary-light/20 text-primary-dark";
    case "sent":
      return "bg-info/20 text-info";
    case "paid":
      return "bg-primary/20 text-primary";
    case "overdue":
      return "bg-error/20 text-error";
    case "cancelled":
      return "bg-secondary/20 text-secondary";
    default:
      return "bg-primary-light/20 text-primary-dark";
  }
};

const quoteStatusFilters: Array<{ label: string; value: QuoteStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Revised", value: "revised" },
];

const invoiceStatusFilters: Array<{ label: string; value: InvoiceStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
  { label: "Cancelled", value: "cancelled" },
];

type BillingWorkspaceProps = {
  role: "admin" | "client";
  canCreateBilling: boolean;
};

export default function BillingWorkspace({ role, canCreateBilling }: BillingWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"invoices" | "quotes">("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus | "all">("all");
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus | "all">("all");
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);

  const {
    data: quoteData = [],
    isLoading: isQuotesLoading,
    isError: isQuotesError,
    refetch: refetchQuotes,
  } = useQuotes();
  const {
    data: invoiceData = [],
    isLoading: isInvoicesLoading,
    isError: isInvoicesError,
    refetch: refetchInvoices,
  } = useInvoices();

  const quoteRows = useMemo<QuoteRow[]>(() => {
    return quoteData.map((quote) => ({
      code: quote.code,
      project: quote.project,
      service_request: quote.service_request,
      amount: Number.parseFloat(quote.amount || "0"),
      status: quote.status,
      status_display: quote.status_display,
      quoted_by: quote.quoted_by?.full_name || quote.quoted_by?.user_id || "-",
      valid_until: quote.valid_until,
      created_at: quote.created_at,
    }));
  }, [quoteData]);

  const invoiceRows = useMemo<InvoiceRow[]>(() => {
    return invoiceData.map((invoice) => ({
      code: invoice.code,
      quote: invoice.quote,
      amount: Number.parseFloat(invoice.amount || "0"),
      status: invoice.status,
      status_display: invoice.status_display,
      due_date: invoice.due_date,
      paid_at: invoice.paid_at,
      created_at: invoice.created_at,
    }));
  }, [invoiceData]);

  const hasError = isQuotesError || isInvoicesError;
  const isLoading = isQuotesLoading || isInvoicesLoading;

  const billingStats = useMemo(() => {
    const totalQuotes = quoteRows.length;
    const openInvoices = invoiceRows.filter((item) => ["sent", "overdue"].includes(item.status)).length;
    const paidValue = invoiceRows
      .filter((item) => item.status === "paid")
      .reduce((acc, item) => acc + item.amount, 0);
    const overdue = invoiceRows.filter((item) => item.status === "overdue").length;

    return [
      {
        label: "Total Quotes",
        value: String(totalQuotes),
        icon: <FaFileCircleCheck />,
        color: "primary" as const,
      },
      {
        label: "Outstanding Invoices",
        value: String(openInvoices),
        icon: <FaClockRotateLeft />,
        color: "warning" as const,
      },
      {
        label: "Paid This Cycle",
        value: formatCurrency(paidValue),
        icon: <FaMoneyBillWave />,
        color: "info" as const,
      },
      {
        label: "Overdue",
        value: String(overdue),
        icon: <FaFileInvoiceDollar />,
        color: "error" as const,
      },
    ];
  }, [invoiceRows, quoteRows]);

  const filteredQuotes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return quoteRows.filter((item) => {
      const matchesStatus = quoteStatus === "all" ? true : item.status === quoteStatus;
      const matchesSearch =
        q.length === 0
          ? true
          : item.code.toLowerCase().includes(q) ||
            (item.project ? item.project.toLowerCase().includes(q) : false) ||
            (item.service_request ? item.service_request.toLowerCase().includes(q) : false) ||
            item.quoted_by.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, quoteRows, quoteStatus]);

  const filteredInvoices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return invoiceRows.filter((item) => {
      const matchesStatus = invoiceStatus === "all" ? true : item.status === invoiceStatus;
      const matchesSearch =
        q.length === 0
          ? true
          : item.code.toLowerCase().includes(q) || item.quote.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, invoiceRows, invoiceStatus]);

  const handleRetry = () => {
    void refetchQuotes();
    void refetchInvoices();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Billing & Invoices</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Monitor quote lifecycle and invoice collections in one place.
          </p>
        </div>
        {canCreateBilling ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateQuoteModal(true)}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-primary-light/20 text-primary-dark text-sm font-medium"
            >
              <FaPlus className="w-3 h-3" />
              Create Quote
            </button>
            <button
              type="button"
              onClick={() => setShowGenerateInvoiceModal(true)}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-tetiary text-sm font-medium"
            >
              <FaFileInvoice className="w-3 h-3" />
              Generate Invoice
            </button>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <StatsCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
          {billingStats.map((stat) => (
            <DashboardStatsCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      {hasError ? (
        <ErrorState
          message="Unable to load billing data."
          onRetry={handleRetry}
        />
      ) : null}

      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary-light/40 px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center rounded-lg border border-border p-1 bg-primary-light/10 w-fit">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "invoices"
                  ? "bg-primary text-tetiary"
                  : "text-primary-dark hover:bg-primary-light/20"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "quotes"
                  ? "bg-primary text-tetiary"
                  : "text-primary-dark hover:bg-primary-light/20"
              }`}
            >
              Quotes
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={
                activeTab === "invoices"
                  ? "Search invoice code"
                  : "Search quote, project or requester"
              }
              className="px-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary-dark min-w-72 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            {activeTab === "invoices" ? (
              <select
                value={invoiceStatus}
                onChange={(event) =>
                  setInvoiceStatus(event.target.value as InvoiceStatus | "all")
                }
                className="px-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {invoiceStatusFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={quoteStatus}
                onChange={(event) =>
                  setQuoteStatus(event.target.value as QuoteStatus | "all")
                }
                className="px-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {quoteStatusFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 shadow-md transition duration-200">
          {activeTab === "invoices" ? (
            <BillingInvoicesTable
              invoices={filteredInvoices}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getInvoiceStatusColor={getInvoiceStatusColor}
              role={role}
              isLoading={isInvoicesLoading}
            />
          ) : (
            <BillingQuotesTable
              quotes={filteredQuotes}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getQuoteStatusColor={getQuoteStatusColor}
              role={role}
              isLoading={isQuotesLoading}
            />
          )}
        </div>
      </div>

      <CreateQuoteModal
        open={showCreateQuoteModal}
        onClose={() => setShowCreateQuoteModal(false)}
      />

      <GenerateInvoiceModal
        open={showGenerateInvoiceModal}
        onClose={() => setShowGenerateInvoiceModal(false)}
      />

    </div>
  );
}

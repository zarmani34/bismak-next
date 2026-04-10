"use client";

import { useMemo, useState } from "react";
import {
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  FaClockRotateLeft,
  FaFileCircleCheck,
  FaFileInvoice,
  FaPlus,
} from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import BillingInvoicesTable from "../../../components/tables/BillingInvoicesTable";
import BillingQuotesTable from "../../../components/tables/BillingQuotesTable";

type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "revised";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

type QuoteRow = {
  code: string;
  project: string | null;
  service_request: string | null;
  amount: number;
  status: QuoteStatus;
  status_display: string;
  quoted_by: string;
  valid_until: string;
  created_at: string;
};

type InvoiceRow = {
  code: string;
  quote: string;
  amount: number;
  status: InvoiceStatus;
  status_display: string;
  due_date: string;
  paid_at: string | null;
  created_at: string;
};

const quotes: QuoteRow[] = [
  {
    code: "BE-PR-26-04-03-091401",
    project: "BE-PR-26-03-20-082211",
    service_request: null,
    amount: 1540000,
    status: "sent",
    status_display: "Sent",
    quoted_by: "BE-STF-0008",
    valid_until: "2026-04-16",
    created_at: "2026-04-03T09:14:01Z",
  },
  {
    code: "BE-PR-26-04-02-154501",
    project: null,
    service_request: "95d11ef9-6f44-46de-b5a5-5b09005fa38a",
    amount: 820000,
    status: "accepted",
    status_display: "Accepted",
    quoted_by: "BE-ADM-0001",
    valid_until: "2026-04-15",
    created_at: "2026-04-02T15:45:01Z",
  },
  {
    code: "BE-PR-26-03-29-123001",
    project: null,
    service_request: "61f2de98-f983-4fb9-9f3b-f6f5019e9e38",
    amount: 640000,
    status: "draft",
    status_display: "Draft",
    quoted_by: "BE-STF-0005",
    valid_until: "2026-04-12",
    created_at: "2026-03-29T12:30:01Z",
  },
];

const invoices: InvoiceRow[] = [
  {
    code: "BE-INV-26-04-04-111550",
    quote: "BE-PR-26-04-02-154501",
    amount: 820000,
    status: "sent",
    status_display: "Sent",
    due_date: "2026-04-18",
    paid_at: null,
    created_at: "2026-04-04T11:15:50Z",
  },
  {
    code: "BE-INV-26-03-30-170200",
    quote: "BE-PR-26-03-26-091015",
    amount: 1260000,
    status: "paid",
    status_display: "Paid",
    due_date: "2026-04-13",
    paid_at: "2026-04-06T10:02:11Z",
    created_at: "2026-03-30T17:02:00Z",
  },
  {
    code: "BE-INV-26-03-22-082010",
    quote: "BE-PR-26-03-15-140023",
    amount: 980000,
    status: "overdue",
    status_display: "Overdue",
    due_date: "2026-04-01",
    paid_at: null,
    created_at: "2026-03-22T08:20:10Z",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getQuoteStatusColor = (status: QuoteStatus) => {
  switch (status) {
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

const getInvoiceStatusColor = (status: InvoiceStatus) => {
  switch (status) {
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

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "quotes">("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus | "all">("all");
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus | "all">("all");

  const billingStats = useMemo(() => {
    const totalQuotes = quotes.length;
    const openInvoices = invoices.filter((item) => ["sent", "overdue"].includes(item.status)).length;
    const paidValue = invoices
      .filter((item) => item.status === "paid")
      .reduce((acc, item) => acc + item.amount, 0);
    const overdue = invoices.filter((item) => item.status === "overdue").length;

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
  }, []);

  const filteredQuotes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return quotes.filter((item) => {
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
  }, [searchTerm, quoteStatus]);

  const filteredInvoices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return invoices.filter((item) => {
      const matchesStatus = invoiceStatus === "all" ? true : item.status === invoiceStatus;
      const matchesSearch =
        q.length === 0
          ? true
          : item.code.toLowerCase().includes(q) || item.quote.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, invoiceStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Billing & Invoices</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Monitor quote lifecycle and invoice collections in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-primary-dark hover:bg-primary-light/20 transition-colors text-sm font-medium">
            <FaPlus className="w-3 h-3" />
            Create Quote
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
            <FaFileInvoice className="w-3 h-3" />
            Generate Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {billingStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary-light/40 px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center rounded-lg border border-border p-1 bg-white/80 w-fit">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "invoices"
                  ? "bg-primary text-white"
                  : "text-primary-dark hover:bg-primary-light/20"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "quotes"
                  ? "bg-primary text-white"
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
              placeholder={activeTab === "invoices" ? "Search invoice code or quote" : "Search quote, project or requester"}
              className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-primary-dark min-w-72 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            {activeTab === "invoices" ? (
              <select
                value={invoiceStatus}
                onChange={(event) => setInvoiceStatus(event.target.value as InvoiceStatus | "all")}
                className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                onChange={(event) => setQuoteStatus(event.target.value as QuoteStatus | "all")}
                className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
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
            />
          ) : (
            <BillingQuotesTable
              quotes={filteredQuotes}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getQuoteStatusColor={getQuoteStatusColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export type BillingPortalRole = "admin" | "client";

export type QuoteActionKey =
  | "accept_quote"
  | "reject_quote"
  | "mark_revised"
  | "mark_sent"
  | "view_invoice";

export type InvoiceActionKey =
  | "mark_paid"
  | "mark_overdue"
  | "mark_cancelled"
  | "mark_sent";

type QuoteAction = {
  key: QuoteActionKey;
  label: string;
  tone: "primary" | "neutral";
};

type InvoiceAction = {
  key: InvoiceActionKey;
  label: string;
  tone: "primary" | "neutral";
};

type QuoteActionsInput = {
  role: BillingPortalRole;
  status: string;
  hasInvoice: boolean;
};

type InvoiceActionsInput = {
  role: BillingPortalRole;
  status: string;
};

export const getQuoteActions = ({
  role,
  status,
  hasInvoice,
}: QuoteActionsInput): QuoteAction[] => {
  const normalizedStatus = status.toLowerCase();
  const actions: QuoteAction[] = [];

  if (role === "client") {
    if (normalizedStatus === "sent" || normalizedStatus === "revised") {
      actions.push(
        { key: "accept_quote", label: "Accept", tone: "primary" },
        { key: "reject_quote", label: "Reject", tone: "neutral" },
      );
    }
  }

  if (role === "admin") {
    if (normalizedStatus === "sent" || normalizedStatus === "rejected") {
      actions.push({ key: "mark_revised", label: "Mark Revised", tone: "neutral" });
    }

    if (normalizedStatus === "revised") {
      actions.push({ key: "mark_sent", label: "Mark Sent", tone: "primary" });
    }
  }

  if (hasInvoice) {
    actions.push({ key: "view_invoice", label: "View Invoice", tone: "neutral" });
  }

  return actions;
};

export const getInvoiceActions = ({
  role,
  status,
}: InvoiceActionsInput): InvoiceAction[] => {
  const normalizedStatus = status.toLowerCase();
  const actions: InvoiceAction[] = [];

  if (role === "admin") {
    if (normalizedStatus === "sent" || normalizedStatus === "overdue") {
      actions.push({ key: "mark_paid", label: "Mark Paid", tone: "primary" });
    }

    if (normalizedStatus === "sent") {
      actions.push({ key: "mark_overdue", label: "Mark Overdue", tone: "neutral" });
      actions.push({ key: "mark_cancelled", label: "Cancel", tone: "neutral" });
    }

    if (normalizedStatus === "overdue") {
      actions.push({ key: "mark_cancelled", label: "Cancel", tone: "neutral" });
    }
  }

  if (role === "admin" && normalizedStatus === "cancelled") {
    actions.push({ key: "mark_sent", label: "Restore Sent", tone: "neutral" });
  }

  return actions;
};

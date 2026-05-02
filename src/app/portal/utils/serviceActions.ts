import { ServiceStatus } from "@/schemas/services";

export type PortalRole = "admin" | "client" | "staff";
export type ServiceActionScope = "table" | "detail";

export type ServiceActionKey =
  | "mark_reviewed"
  | "create_quote"
  | "accept_quote"
  | "reject_quote"
  | "assign_staff"
  | "mark_completed"
  | "view_invoice";

export type ServiceAction = {
  key: ServiceActionKey;
  label: string;
  tone: "primary" | "secondary";
};

type ServiceActionContext = {
  role: PortalRole;
  status: ServiceStatus;
  hasQuote: boolean;
  hasInvoice: boolean;
  scope: ServiceActionScope;
};

const tableActionsByRoleStatus: Partial<
  Record<PortalRole, Partial<Record<ServiceStatus, ServiceAction[]>>>
> = {
  admin: {
    pending: [{ key: "mark_reviewed", label: "Mark Reviewed", tone: "primary" }],
    in_progress: [{ key: "mark_completed", label: "Mark Completed", tone: "primary" }],
    completed: [{ key: "view_invoice", label: "View Invoice", tone: "secondary" }],
  },
  client: {
    quoted: [
      { key: "accept_quote", label: "Accept Quote", tone: "primary" },
      { key: "reject_quote", label: "Reject Quote", tone: "secondary" },
    ],
    completed: [{ key: "view_invoice", label: "View Invoice", tone: "secondary" }],
  },
  // staff: {
  //   in_progress: [{ key: "mark_completed", label: "Mark Completed", tone: "primary" }],
  //   completed: [{ key: "view_invoice", label: "View Invoice", tone: "secondary" }],
  // },
};

const detailActionsByRoleStatus: Partial<
  Record<PortalRole, Partial<Record<ServiceStatus, ServiceAction[]>>>
> = {
  admin: {
    // pending: [{ key: "mark_reviewed", label: "Mark Reviewed", tone: "primary" }],
    pending: [{ key: "create_quote", label: "Create Quote", tone: "primary" }],
    accepted: [{ key: "create_quote", label: "Create Quote", tone: "primary" }],
    // accepted: [{ key: "assign_staff", label: "Assign Staff", tone: "primary" }],
    in_progress: [{ key: "mark_completed", label: "Mark Completed", tone: "primary" }],
    completed: [{ key: "view_invoice", label: "View Invoice", tone: "secondary" }],
  },
  client: {
    quoted: [
      { key: "accept_quote", label: "Accept Quote", tone: "primary" },
      { key: "reject_quote", label: "Reject Quote", tone: "secondary" },
    ],
    completed: [{ key: "view_invoice", label: "View Invoice", tone: "secondary" }],
  },
  staff: {
    in_progress: [{ key: "mark_completed", label: "Mark Completed", tone: "primary" }],
    completed: [{ key: "view_invoice", label: "View Invoice", tone: "secondary" }],
  },
};

export const getServiceActions = ({
  role,
  status,
  hasQuote,
  hasInvoice,
  scope,
}: ServiceActionContext): ServiceAction[] => {
  const source =
    scope === "table" ? tableActionsByRoleStatus : detailActionsByRoleStatus;
  const actions = source[role]?.[status] ?? [];

  return actions.filter((action) => {
    if ((action.key === "accept_quote" || action.key === "reject_quote") && !hasQuote) {
      return false;
    }
    if (action.key === "view_invoice" && !hasInvoice) {
      return false;
    }
    return true;
  });
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value !== "object" || value === null) return null;
  return value as Record<string, unknown>;
};

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return null;
};

export const extractQuoteCode = (source: unknown) => {
  const record = asRecord(source);
  if (!record) return null;

  const quoteRecord = asRecord(record.quote);
  const latestQuoteRecord = asRecord(record.latest_quote);

  return pickString(
    record.quote_code,
    record.quote_id,
    quoteRecord?.code,
    latestQuoteRecord?.code,
  );
};

export const extractInvoiceCode = (source: unknown) => {
  const record = asRecord(source);
  if (!record) return null;

  const invoiceRecord = asRecord(record.invoice);
  const latestInvoiceRecord = asRecord(record.latest_invoice);

  return pickString(
    record.invoice_code,
    record.invoice_id,
    invoiceRecord?.code,
    latestInvoiceRecord?.code,
  );
};

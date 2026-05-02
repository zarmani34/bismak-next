import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  QuoteListItem,
  QuoteDetail,
  CreateQuoteData,
  UpdateQuoteData,
  Invoice,
  UpdateInvoiceData,
} from "@/schemas/billing";

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const normalizeListResponse = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray((data as PaginatedResponse<T>).results)
  ) {
    return (data as PaginatedResponse<T>).results;
  }

  return [];
};

// ---- Query Keys ----

export const billingKeys = {
  // all quotes (admin view)
  allQuotes: ["quotes"] as const,
  allInvoices: ["invoices"] as const,

  // quotes under a service request
  serviceRequestQuotes: (serviceRequestCode: string) =>
    ["service-requests", serviceRequestCode, "quotes"] as const,

  // quotes under a project
  projectQuotes: (projectCode: string) =>
    ["projects", projectCode, "quotes"] as const,

  // single quote detail
  quoteDetail: (code: string) => ["quotes", code] as const,

  // invoice under a quote
  invoice: (quoteCode: string) => ["quotes", quoteCode, "invoice"] as const,
  invoiceDetail: (invoiceId: string) => ["invoices", invoiceId] as const,
};

type UpdateQuoteStatusInput = {
  quoteCode: string;
  status: "sent" | "accepted" | "rejected" | "revised";
};

// ---- Quote Hooks ----

/**
 * All quotes — admin only
 */
export function useQuotes() {
  return useQuery<QuoteListItem[]>({
    queryKey: billingKeys.allQuotes,
    queryFn: async () => {
      const { data } = await api.get("/quotes/");
      return normalizeListResponse<QuoteListItem>(data);
    },
  });
}

/**
 * Quotes under a service request
 */
export function useServiceRequestQuotes(serviceRequestCode: string) {
  return useQuery<QuoteListItem[]>({
    queryKey: billingKeys.serviceRequestQuotes(serviceRequestCode),
    queryFn: async () => {
      const { data } = await api.get(`/services/${serviceRequestCode}/quotes/`);
      return normalizeListResponse<QuoteListItem>(data);
    },
    enabled: !!serviceRequestCode,
  });
}

/**
 * Quotes under a project
 */
export function useProjectQuotes(projectCode: string) {
  return useQuery<QuoteListItem[]>({
    queryKey: billingKeys.projectQuotes(projectCode),
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectCode}/quotes/`);
      return normalizeListResponse<QuoteListItem>(data);
    },
    enabled: !!projectCode,
  });
}

/**
 * Single quote detail
 */
export function useQuote(code: string) {
  return useQuery<QuoteDetail>({
    queryKey: billingKeys.quoteDetail(code),
    queryFn: async () => {
      const { data } = await api.get(`/quotes/${code}/`);
      return data;
    },
    enabled: !!code,
  });
}

/**
 * Create quote under a service request
 */
export function useCreateServiceRequestQuote(serviceRequestCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: CreateQuoteData) => {
      const { data } = await api.post(`/services/${serviceRequestCode}/quotes/`, quoteData);
      return data as QuoteDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.serviceRequestQuotes(serviceRequestCode),
      });
      queryClient.invalidateQueries({ queryKey: billingKeys.allQuotes });
      queryClient.invalidateQueries({ queryKey: billingKeys.allInvoices });
    },
  });
}

/**
 * Create quote under a project
 */
export function useCreateProjectQuote(projectCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: CreateQuoteData) => {
      const { data } = await api.post(
        `/projects/${projectCode}/quotes/`,
        quoteData
      );
      return data as QuoteDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.projectQuotes(projectCode),
      });
      queryClient.invalidateQueries({ queryKey: billingKeys.allQuotes });
      queryClient.invalidateQueries({ queryKey: billingKeys.allInvoices });
    },
  });
}

/**
 * Update quote
 */
export function useUpdateQuote(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: UpdateQuoteData) => {
      const { data } = await api.patch(`/quotes/${code}/`, quoteData);
      return data as QuoteDetail;
    },
    onSuccess: (updatedQuote) => {
      queryClient.setQueryData(billingKeys.quoteDetail(code), updatedQuote);
      queryClient.invalidateQueries({ queryKey: billingKeys.allQuotes });
      queryClient.invalidateQueries({ queryKey: billingKeys.allInvoices });
    },
  });
}

/**
 * Update quote status using workflow endpoint
 */
export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteCode, status }: UpdateQuoteStatusInput) => {
      const { data } = await api.patch(`/quotes/${quoteCode}/update-status/`, {
        status,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.allQuotes });
      queryClient.invalidateQueries({ queryKey: billingKeys.allInvoices });
      queryClient.invalidateQueries({
        queryKey: billingKeys.quoteDetail(variables.quoteCode),
      });
      queryClient.invalidateQueries({
        queryKey: billingKeys.invoice(variables.quoteCode),
      });
    },
  });
}

// ---- Invoice Hooks ----

/**
 * All invoices (admin + client)
 */
export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: billingKeys.allInvoices,
    queryFn: async () => {
      const { data } = await api.get("/invoices/");
      return normalizeListResponse<Invoice>(data);
    },
  });
}

/**
 * Get invoice under a quote
 */
export function useInvoice(quoteCode: string) {
  return useQuery<Invoice | null>({
    queryKey: billingKeys.invoice(quoteCode),
    queryFn: async () => {
      const { data } = await api.get(`/quotes/${quoteCode}/invoice/`);
      const list = normalizeListResponse<Invoice>(data);
      return list[0] ?? null;
    },
    enabled: !!quoteCode,
  });
}

/**
 * Get a single invoice by its invoice code from invoice list cache.
 */
export function useInvoiceByCode(invoiceCode: string) {
  const invoicesQuery = useInvoices();

  return {
    ...invoicesQuery,
    data: (invoicesQuery.data ?? []).find((invoice) => invoice.code === invoiceCode) ?? null,
  };
}

/**
 * Update invoice by invoice id (standalone invoice endpoint)
 */
export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { invoiceId: string; invoiceData: UpdateInvoiceData }) => {
      const { data } = await api.patch(`/invoices/${input.invoiceId}/`, input.invoiceData);
      return data as Invoice;
    },
    onSuccess: (updatedInvoice) => {
      queryClient.setQueryData(
        billingKeys.invoiceDetail(updatedInvoice.id),
        updatedInvoice
      );
      queryClient.invalidateQueries({ queryKey: billingKeys.allInvoices });

      if (updatedInvoice.quote) {
        queryClient.setQueryData(billingKeys.invoice(updatedInvoice.quote), updatedInvoice);
      }

      queryClient.invalidateQueries({
        queryKey: billingKeys.quoteDetail(updatedInvoice.quote),
      });
    },
  });
}

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

// ---- Query Keys ----

export const billingKeys = {
  // all quotes (admin view)
  allQuotes: ["quotes"] as const,

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
      return data;
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
      const { data } = await api.get(
        `/service-requests/${serviceRequestCode}/quotes/`
      );
      return data;
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
      return data;
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
      const { data } = await api.post(
        `/service-requests/${serviceRequestCode}/quotes/`,
        quoteData
      );
      return data as QuoteDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.serviceRequestQuotes(serviceRequestCode),
      });
      queryClient.invalidateQueries({ queryKey: billingKeys.allQuotes });
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
    },
  });
}

// ---- Invoice Hooks ----

/**
 * Get invoice under a quote
 */
export function useInvoice(quoteCode: string) {
  return useQuery<Invoice>({
    queryKey: billingKeys.invoice(quoteCode),
    queryFn: async () => {
      const { data } = await api.get(`/quotes/${quoteCode}/invoice/`);
      return data;
    },
    enabled: !!quoteCode,
  });
}

/**
 * Update invoice under a quote
 */
export function useUpdateInvoice(quoteCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceData: UpdateInvoiceData) => {
      const { data } = await api.patch(
        `/quotes/${quoteCode}/invoice/`,
        invoiceData
      );
      return data as Invoice;
    },
    onSuccess: (updatedInvoice) => {
      // update invoice cache immediately
      queryClient.setQueryData(billingKeys.invoice(quoteCode), updatedInvoice);
      // invalidate quote detail so invoice field updates
      queryClient.invalidateQueries({
        queryKey: billingKeys.quoteDetail(quoteCode),
      });
    },
  });
}
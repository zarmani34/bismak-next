import { z } from "zod";
import { UserSchema } from "@/schemas/user";

// ---- Invoice ----

export const InvoiceSchema = z.object({
  id: z.string(),
  code: z.string(),
  amount: z.string(), // DecimalField returns string in DRF
  status: z.string(),
  status_display: z.string(),
  due_date: z.string().nullable(),
  paid_at: z.string().nullable(),
  note: z.string().nullable(),
  created_at: z.string(),
});

export const UpdateInvoiceSchema = z.object({
  status: z.string().optional(),
  due_date: z.string().nullable().optional(),
  paid_at: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

// ---- Quote ----

export const QuoteItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  unit_price: z.string(), // DecimalField returns string in DRF
  total: z.string(),
})

export const QuoteListItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  service_request: z.string().nullable(),
  project: z.string().nullable(),
  owner: UserSchema.nullable(),
  amount: z.string(),
  status: z.string(),
  status_display: z.string(),
  valid_until: z.string().nullable(),
  quoted_by: UserSchema,
  created_at: z.string(),
});

export const QuoteDetailSchema = z.object({
  id: z.string(),
  code: z.string(),
  service_request: z.string().nullable(),
  project: z.string().nullable(),
  owner: UserSchema.nullable(),
  amount: z.string(),
  note: z.string().nullable(),
  status: z.string(),
  status_display: z.string(),
  valid_until: z.string().nullable(),
  accepted_at: z.string().nullable(),
  rejected_at: z.string().nullable(),
  quoted_by: UserSchema,
  invoice: InvoiceSchema.nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  items: QuoteItemSchema.array(),
});

// Write schema — only writable fields
export const CreateQuoteSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  note: z.string().nullable().optional(),
  valid_until: z.string().nullable().optional(),
  status: z.string().optional(),
});

export const UpdateQuoteSchema = CreateQuoteSchema.partial();

// TypeScript types
export type Invoice = z.infer<typeof InvoiceSchema>;
export type UpdateInvoiceData = z.infer<typeof UpdateInvoiceSchema>;
export type QuoteListItem = z.infer<typeof QuoteListItemSchema>;
export type QuoteDetail = z.infer<typeof QuoteDetailSchema>;
export type CreateQuoteData = z.infer<typeof CreateQuoteSchema>;
export type UpdateQuoteData = z.infer<typeof UpdateQuoteSchema>;
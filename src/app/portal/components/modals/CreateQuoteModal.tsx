"use client";

import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCircleInfo, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import {
  useCreateProjectQuote,
  useCreateServiceRequestQuote,
  useInvoices,
  useQuotes,
} from "@/hooks/useBilling";
import { useProjects } from "@/hooks/useProjects";
import { useServiceRequests } from "@/hooks/useServices";
import { extractApiError } from "@/lib/errors";
import { ServiceRequest } from "@/schemas/services";

const itemSchema = z.object({
  description: z.string().optional(),
  quantity: z.number().optional(),
  unit_price: z.string().optional(),
});

const formSchema = z
  .object({
    linkType: z.enum(["project", "service"]),
    linkedCode: z.string().min(1, "Select a record"),
    amount: z.string().optional(),
    valid_until: z.string().optional(),
    note: z.string().optional(),
    is_itemized: z.boolean(),
    items: z.array(itemSchema),
  })
  .superRefine((data, context) => {
    if (data.is_itemized) {
      if (data.items.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items"],
          message: "Add at least one item",
        });
        return;
      }

      const subtotal = data.items.reduce((total, item, index) => {
        const description = item.description?.trim() ?? "";
        const quantity = Number(item.quantity ?? 0);
        const unitPrice = Number.parseFloat(item.unit_price || "0");

        if (!description) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["items", index, "description"],
            message: "Description is required",
          });
        }

        if (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["items", index, "quantity"],
            message: "Quantity must be at least 1",
          });
        }

        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["items", index, "unit_price"],
            message: "Unit price is required",
          });
        }

        if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) return total;
        return total + quantity * unitPrice;
      }, 0);

      if (subtotal <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items"],
          message: "Itemized quote total must be greater than 0",
        });
      }

      return;
    }

    const amount = data.amount?.trim() || "";
    const parsed = Number.parseFloat(amount);
    if (!amount || !Number.isFinite(parsed) || parsed <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Enter a valid amount greater than 0",
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

type CreateQuoteModalProps = {
  open: boolean;
  onClose: () => void;
  defaultLinkType?: "project" | "service";
  defaultLinkedCode?: string;
  lockLinkedRecord?: boolean;
  onSuccess?: () => void | Promise<void>;
};

type ServiceListResponse = { results: ServiceRequest[] };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);

export default function CreateQuoteModal({
  open,
  onClose,
  defaultLinkType,
  defaultLinkedCode,
  lockLinkedRecord = false,
  onSuccess,
}: CreateQuoteModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkType: defaultLinkType ?? "service",
      linkedCode: defaultLinkedCode ?? "",
      amount: "",
      valid_until: "",
      note: "",
      is_itemized: true,
      items: [{ description: "", quantity: 1, unit_price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!open) return;

    if (defaultLinkType) {
      setValue("linkType", defaultLinkType, { shouldValidate: true });
    }

    if (defaultLinkedCode) {
      setValue("linkedCode", defaultLinkedCode, { shouldValidate: true });
    }
  }, [defaultLinkType, defaultLinkedCode, open, setValue]);

  const linkType = useWatch({ control, name: "linkType" }) ?? "service";
  const linkedCode = useWatch({ control, name: "linkedCode" }) ?? "";
  const watchedItems = useWatch({ control, name: "items" });
  const isItemized = useWatch({ control, name: "is_itemized" }) ?? true;

  const {
    data: projects,
    isLoading: isProjectsLoading,
  } = useProjects();

  const {
    data: serviceRequests,
    isLoading: isServicesLoading,
  } = useServiceRequests();

  const createProjectQuote = useCreateProjectQuote(linkedCode || "");
  const createServiceQuote = useCreateServiceRequestQuote(linkedCode || "");
  const { data: quotes = [] } = useQuotes();
  const { data: invoices = [] } = useInvoices();

  const serviceOptions = useMemo(() => {
    if (Array.isArray(serviceRequests)) return serviceRequests;
    if (
      serviceRequests &&
      typeof serviceRequests === "object" &&
      "results" in (serviceRequests as ServiceListResponse)
    ) {
      return (serviceRequests as ServiceListResponse).results;
    }

    return [];
  }, [serviceRequests]);

  const existingProjectQuoteCodes = useMemo(
    () => new Set(quotes.map((quote) => quote.project).filter(Boolean)),
    [quotes],
  );
  const existingServiceQuoteCodes = useMemo(
    () => new Set(quotes.map((quote) => quote.service_request).filter(Boolean)),
    [quotes],
  );

  const invoicedQuoteCodes = useMemo(
    () => new Set(invoices.map((invoice) => invoice.quote)),
    [invoices],
  );

  const projectOptions = useMemo(() => {
    const items = projects ?? [];
    return items.filter((project) => {
      const projectCode = project.code;
      if (!projectCode) return false;
      if (existingProjectQuoteCodes.has(projectCode)) return false;
      return true;
    });
  }, [existingProjectQuoteCodes, projects?.results]);

  const filteredServiceOptions = useMemo(() => {
    return serviceOptions.filter((service) => {
      const serviceCode = service.code;
      if (!serviceCode) return false;
      if (existingServiceQuoteCodes.has(serviceCode)) return false;
      return true;
    });
  }, [existingServiceQuoteCodes, serviceOptions]);

  const isLoadingOptions =
    linkType === "project" ? isProjectsLoading : isServicesLoading;

  const activeMutation =
    linkType === "project" ? createProjectQuote : createServiceQuote;

  const computedAmount = useMemo(() => {
    const itemRows = watchedItems ?? [];

    return itemRows.reduce((total, item) => {
      const quantity = Number(item?.quantity ?? 0);
      const unitPrice = Number.parseFloat(item?.unit_price ?? "0");

      if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
        return total;
      }

      return total + quantity * unitPrice;
    }, 0);
  }, [watchedItems]);

  useEffect(() => {
    if (isItemized) {
      setValue("amount", computedAmount > 0 ? computedAmount.toFixed(2) : "", {
        shouldValidate: false,
      });
    }
  }, [computedAmount, isItemized, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      amount: data.is_itemized ? computedAmount.toFixed(2) : (data.amount?.trim() || "0"),
      valid_until: data.valid_until?.trim() ? data.valid_until : null,
      note: data.note?.trim() ? data.note.trim() : null,
      status: "sent",
      items: data.is_itemized
        ? data.items.map((item) => ({
            description: item.description ?? "",
            quantity: Number(item.quantity),
            unit_price: Number.parseFloat(item.unit_price || "0").toFixed(2),
          }))
        : undefined,
    };

    if (data.linkType === "project") {
      await createProjectQuote.mutateAsync(payload);
    } else {
      await createServiceQuote.mutateAsync(payload);
    }

    if (onSuccess) {
      await onSuccess();
    }

    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-dark/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl border border-primary-light bg-tetiary shadow-xl overflow-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark/80">Create Quote</h2>
              <p className="text-sm text-primary/70">
                Build quote details with optional line-item breakdown.
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

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">Link Type</label>
                <select
                  disabled={lockLinkedRecord}
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("linkType")}
                >
                  <option value="service">Service Request</option>
                  <option value="project">Project</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">
                  {linkType === "project" ? "Project" : "Service Request"}
                </label>
                <select
                  disabled={lockLinkedRecord}
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("linkedCode")}
                >
                  <option value="" disabled>
                    {isLoadingOptions ? "Loading options..." : "Select record"}
                  </option>
                  {linkType === "project"
                    ? projectOptions.map((project) => (
                        <option key={project.code} value={project.code}>
                          {project.name} ({project.code})
                        </option>
                      ))
                    : filteredServiceOptions.map((service) => (
                        <option key={service.code} value={service.code}>
                          {service.service_name} ({service.code})
                        </option>
                      ))}
                </select>
                {!lockLinkedRecord &&
                !isLoadingOptions &&
                ((linkType === "project" && projectOptions.length === 0) ||
                  (linkType === "service" && filteredServiceOptions.length === 0)) ? (
                  <p className="text-xs text-secondary-text mt-1">
                    All {linkType === "project" ? "projects" : "service requests"} already have quotes.
                  </p>
                ) : null}
                {errors.linkedCode ? (
                  <p className="text-xs text-secondary-light mt-1">{errors.linkedCode.message}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">Valid Until</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                  {...register("valid_until")}
                />
              </div>

              <div>
                <label className="text-xs text-primary-dark font-semibold tracking-wide">Amount</label>
                <input
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark disabled:opacity-70"
                  placeholder="e.g. 2500000"
                  disabled={isItemized}
                  {...register("amount")}
                />
                {errors.amount ? (
                  <p className="text-xs text-secondary-light mt-1">{errors.amount.message}</p>
                ) : null}
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-primary-dark font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                {...register("is_itemized")}
              />
              Use itemized breakdown (QuoteItems)
            </label>

            {isItemized ? (
              <div className="rounded-xl border border-border p-4 bg-primary-light/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-primary-dark">Quote Items</h3>
                  <button
                    type="button"
                    onClick={() => append({ description: "", quantity: 1, unit_price: "" })}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-tetiary text-xs font-medium"
                  >
                    <FaPlus className="w-3 h-3" />
                    Add Item
                  </button>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full min-w-[720px]">
                    <thead className="bg-primary-light/30 border-b border-border">
                      <tr>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Description</th>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Qty</th>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Unit Price</th>
                        <th className="p-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">Line Total</th>
                        <th className="p-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => {
                        const qty = Number(watchedItems?.[index]?.quantity ?? 0);
                        const unitPrice = Number.parseFloat(watchedItems?.[index]?.unit_price ?? "0");
                        const lineTotal = Number.isFinite(qty) && Number.isFinite(unitPrice)
                          ? qty * unitPrice
                          : 0;

                        return (
                          <tr key={field.id} className="border-b border-border/70 last:border-0">
                            <td className="p-3 align-top">
                              <input
                                className="w-full rounded-lg border border-border px-3 py-2 bg-primary/20 text-primary-dark"
                                {...register(`items.${index}.description`)}
                              />
                              {errors.items?.[index]?.description ? (
                                <p className="text-xs text-secondary-light mt-1">
                                  {errors.items[index]?.description?.message}
                                </p>
                              ) : null}
                            </td>
                            <td className="p-3 align-top">
                              <input
                                type="number"
                                min={1}
                                className="w-24 rounded-lg border border-border px-3 py-2 bg-primary/20 text-primary-dark"
                                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                              />
                              {errors.items?.[index]?.quantity ? (
                                <p className="text-xs text-secondary-light mt-1">
                                  {errors.items[index]?.quantity?.message}
                                </p>
                              ) : null}
                            </td>
                            <td className="p-3 align-top">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-36 rounded-lg border border-border px-3 py-2 bg-primary/20 text-primary-dark"
                                {...register(`items.${index}.unit_price`)}
                              />
                              {errors.items?.[index]?.unit_price ? (
                                <p className="text-xs text-secondary-light mt-1">
                                  {errors.items[index]?.unit_price?.message}
                                </p>
                              ) : null}
                            </td>
                            <td className="p-3 text-sm font-medium text-primary-dark align-top">
                              {formatCurrency(lineTotal)}
                            </td>
                            <td className="p-3 align-top text-right">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="inline-flex items-center gap-1 px-2 py-2 rounded-lg border border-error/40 text-error text-xs"
                              >
                                <FaTrash className="w-3 h-3" />
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {errors.items?.message ? (
                  <p className="text-xs text-secondary-light">{errors.items.message}</p>
                ) : null}

                <div className="flex items-center justify-between rounded-lg border border-border bg-primary/10 p-3">
                  <p className="text-xs text-secondary-text inline-flex items-center gap-2">
                    <FaCircleInfo className="w-3 h-3" />
                    Total amount is auto-computed from item rows.
                  </p>
                  <p className="text-sm font-semibold text-primary-dark">
                    Total: {formatCurrency(computedAmount)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-primary-light/10 p-3 text-xs text-secondary-text">
                Itemized breakdown is off. Enter a single total amount above.
              </div>
            )}

            <div>
              <label className="text-xs text-primary-dark font-semibold tracking-wide">Note</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 bg-primary/20 text-primary-dark"
                placeholder="Optional quote note"
                {...register("note")}
              />
            </div>

            {activeMutation.error ? (
              <p className="text-xs text-secondary-light">{extractApiError(activeMutation.error)}</p>
            ) : null}
            {invoicedQuoteCodes.size > 0 ? (
              <p className="text-xs text-secondary-text">
                Records with existing quotes or invoices are excluded automatically.
              </p>
            ) : null}
          </div>

          <div className="p-6 pt-0 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || activeMutation.isPending}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-tetiary text-sm font-medium disabled:opacity-70"
            >
              {activeMutation.isPending ? "Saving..." : "Save Quote"}
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

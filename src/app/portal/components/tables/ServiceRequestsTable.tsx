"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { FaEye, FaMagnifyingGlass } from "react-icons/fa6";
import { ServiceRequest, ServiceStatus } from "@/schemas/services";
import { formatDate } from "@/src/utils/date";
import {
  extractInvoiceCode,
  extractQuoteCode,
  getServiceActions,
  PortalRole,
  ServiceActionKey,
} from "../../utils/serviceActions";
import {
  useUpdateQuoteStatus,
  useUpdateServiceRequestStatus,
} from "@/hooks/useServices";
import { extractApiError } from "@/lib/errors";
import { getStatusColor } from "../../constants";
import { DataTable } from "./Datatable";

const statusOptions: Array<{ label: string; value: ServiceStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Quoted", value: "quoted" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

type Props = {
  serviceRequests: ServiceRequest[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  basePath?: string;
  role?: PortalRole;
};

export default function ServiceRequestsTable({
  serviceRequests,
  isLoading,
  isError,
  onRetry,
  basePath = "/portal/admin/services",
  role,
}: Props) {
  const router = useRouter();
  const updateServiceStatus = useUpdateServiceRequestStatus();
  const updateQuoteStatus = useUpdateQuoteStatus();
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");

  const handleViewRequest = (serviceCode: string) => {
    router.push(`${basePath}/${serviceCode}`);
  };

  const filteredRequests = useMemo(() => {
    return serviceRequests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" ? true : request.status === statusFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q.length === 0
          ? true
          : request.service_name.toLowerCase().includes(q) ||
            request.owner_name.toLowerCase().includes(q) ||
            request.location.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [serviceRequests, searchTerm, statusFilter]);

  const handleQuickAction = async (
    service: ServiceRequest,
    actionKey: ServiceActionKey,
  ) => {
    setActionError(null);

    try {
      if (actionKey === "mark_reviewed") {
        await updateServiceStatus.mutateAsync({
          serviceCode: service.code,
          status: "reviewed",
        });
        return;
      }

      if (actionKey === "mark_completed") {
        await updateServiceStatus.mutateAsync({
          serviceCode: service.code,
          status: "completed",
        });
        return;
      }

      if (actionKey === "accept_quote" || actionKey === "reject_quote") {
        const quoteCode = extractQuoteCode(service);
        if (!quoteCode) return;

        await updateQuoteStatus.mutateAsync({
          quoteCode,
          status: actionKey === "accept_quote" ? "accepted" : "rejected",
        });
        return;
      }

      if (actionKey === "view_invoice") {
        const invoiceCode = extractInvoiceCode(service);
        if (!role) return;

        const billingBase =
          role === "admin"
            ? "/portal/admin/billing"
            : role === "client"
              ? "/portal/client/billings"
              : "/portal/staff/billings";
        const query = invoiceCode ? `?invoice=${encodeURIComponent(invoiceCode)}` : "";
        router.push(`${billingBase}${query}`);
      }
    } catch (error) {
      setActionError(extractApiError(error));
    }
  };

  const columns = useMemo<ColumnDef<ServiceRequest>[]>(
    () => [
      {
        accessorKey: "service_name",
        header: "Request",
        cell: ({ row, getValue }) => (
          <button
            type="button"
            onClick={() => handleViewRequest(row.original.code)}
            className="text-left"
          >
            <p className="text-sm font-medium text-primary-dark">
              {getValue() as string}
            </p>
            <p className="text-xs text-secondary-text">{row.original.company_name}</p>
            <p className="text-xs text-secondary-text">{row.original.code}</p>
          </button>
        ),
      },
      {
        accessorKey: "owner_name",
        header: "Client",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "status_display",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
              row.original.status,
            )}`}
          >
            {row.original.status_display}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ getValue }) => (
          <span className="text-sm text-body-text">
            {formatDate(getValue() as string)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const service = row.original;
          const rowRole = role ?? "client";
          const quickActions = getServiceActions({
            role: rowRole,
            status: service.status,
            hasQuote: !!extractQuoteCode(service),
            hasInvoice: !!extractInvoiceCode(service),
            scope: "table",
          });

          return (
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                if (action.key === "view_invoice") {
                  const invoiceCode = extractInvoiceCode(service);
                  if (invoiceCode) {
                    const billingBase =
                      rowRole === "admin"
                        ? "/portal/admin/billing"
                        : rowRole === "client"
                          ? "/portal/client/billings"
                          : "/portal/staff/billings";
                    return (
                      <Link
                        key={action.key}
                        href={`${billingBase}/invoices/${invoiceCode}`}
                        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary-dark hover:bg-primary-light/20"
                      >
                        {action.label}
                      </Link>
                    );
                  }
                }

                return (
                  <button
                    key={action.key}
                    type="button"
                    disabled={updateServiceStatus.isPending || updateQuoteStatus.isPending}
                    onClick={() => void handleQuickAction(service, action.key)}
                    className={`rounded-md border px-2 py-1 text-xs font-medium disabled:opacity-60 ${
                      action.tone === "primary"
                        ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                        : "border-border text-primary-dark hover:bg-primary-light/20"
                    }`}
                  >
                    {action.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleViewRequest(service.code)}
                className="p-2 text-body-text hover:text-primary-light"
                aria-label="View request"
              >
                <FaEye className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [role, updateQuoteStatus.isPending, updateServiceStatus.isPending],
  );

  return (
    <div className="rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border bg-primary-light/40 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-semibold text-primary-dark">All Requests</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-xs" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by client, name or location"
              className="min-w-72 rounded-lg border border-border bg-tetiary py-2 pl-9 pr-3 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ServiceStatus | "all")
            }
            className="rounded-lg border border-border bg-tetiary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionError ? (
        <div className="border-b border-border px-6 py-3 text-xs text-secondary-light">
          {actionError}
        </div>
      ) : null}

      <DataTable
        data={filteredRequests}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        pageSize={10}
        onRowClick={(row) => handleViewRequest(row.code)}
      />

      {!isLoading && isError ? (
        <div className="px-6 py-4 text-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light/30"
          >
            Retry
          </button>
        </div>
      ) : null}
    </div>
  );
}

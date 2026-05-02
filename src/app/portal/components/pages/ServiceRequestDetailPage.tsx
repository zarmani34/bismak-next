"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaFileInvoice, FaLink } from "react-icons/fa6";
import { useServiceRequest } from "@/hooks/useServices";
import ErrorState from "../states/ErrorState";
import { getStatusColor } from "../../constants";
import { formatDate, formatDateTime } from "@/src/utils/date";
import ServiceUpdateStatus from "../project-details/ServiceUpdateStatus";
import { extractInvoiceCode, extractQuoteCode } from "../../utils/serviceActions";

type ServiceRequestDetailPageProps = {
  role: "admin" | "client" | "staff";
};

const toTitleCaseStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getOwnerLabel = (
  ownerName?: string,
  owner?: string | { full_name?: string } | null,
) => {
  if (ownerName) return ownerName;
  if (!owner) return "--";
  if (typeof owner === "string") return owner;
  return owner.full_name || "--";
};

export default function ServiceRequestDetailPage({
  role,
}: ServiceRequestDetailPageProps) {
  const params = useParams();
  const serviceCode =
    typeof params?.code === "string"
      ? params.code
      : typeof params?.id === "string"
        ? params.id
        : "";
  const {
    data: serviceRequest,
    isLoading,
    isError,
    refetch,
  } = useServiceRequest(serviceCode);
  const billingBase =
    role === "admin"
      ? "/portal/admin/billing"
      : role === "client"
        ? "/portal/client/billings"
        : "/portal/staff/billings";

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading service request...
      </div>
    );
  }

  if (isError || !serviceRequest) {
    return (
      <ErrorState
        message="Unable to load service request details."
        onRetry={() => refetch()}
      />
    );
  }

  const serviceLabel =
    serviceRequest.service_name ||
    serviceRequest.service_type?.name ||
    serviceRequest.custom_service ||
    "Service Request";
  const quoteCode = extractQuoteCode(serviceRequest);
  const invoiceCode = extractInvoiceCode(serviceRequest);
  const ownerLabel = getOwnerLabel(serviceRequest.owner_name, serviceRequest.owner);
  const statusLabel = serviceRequest.status_display || toTitleCaseStatus(serviceRequest.status);
  const createdAt = formatDateTime(serviceRequest.created_at, { fallback: "--" });
  const updatedAt = formatDateTime(serviceRequest.updated_at, { fallback: "--" });
  const serviceTypeLabel = serviceRequest.service_type?.name || "--";
  const customServiceLabel = serviceRequest.custom_service || "--";
  const hasDescription = Boolean(serviceRequest.description?.trim());
  const hasLinkedRecords = Boolean(quoteCode || invoiceCode);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href={`/portal/${role}/services`}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Service Requests
        </Link>

        <div className="flex items-center gap-2">
          {quoteCode ? (
            <Link
              href={`${billingBase}/quotes/${quoteCode}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-primary-dark hover:bg-primary-light/20"
            >
              <FaLink className="w-3 h-3" />
              View Quote
            </Link>
          ) : null}
          {invoiceCode ? (
            <Link
              href={`${billingBase}/invoices/${invoiceCode}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-tetiary text-sm"
            >
              <FaFileInvoice className="w-3 h-3" />
              View Invoice
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-primary-light/20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-secondary-text">
                  SERVICE REQUEST
                </p>
                <h1 className="text-2xl font-bold text-primary-dark mt-1">{serviceLabel}</h1>
                <p className="text-xs text-secondary-text mt-1">{serviceCode}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(
                  serviceRequest.status,
                )}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Client</p>
                <p className="mt-2 text-sm font-semibold text-primary-dark">{ownerLabel}</p>
                <p className="mt-1 text-xs text-secondary-text">
                  {serviceRequest.company_name || "--"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-text">Location</p>
                <p className="mt-2 text-sm font-semibold text-primary-dark">
                  {serviceRequest.location || "--"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-tetiary/80 p-4">
              <h2 className="text-sm font-semibold text-primary-dark">Request Information</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-secondary-text">Service Type</p>
                  <p className="text-primary-dark font-medium mt-1">{serviceTypeLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-text">Custom Service</p>
                  <p className="text-primary-dark font-medium mt-1">{customServiceLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-text">Created</p>
                  <p className="text-primary-dark font-medium mt-1">{createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-text">Updated</p>
                  <p className="text-primary-dark font-medium mt-1">{updatedAt}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-tetiary/80 p-4">
              <h2 className="text-sm font-semibold text-primary-dark">Description</h2>
              <p className="mt-2 text-sm text-primary-dark leading-relaxed">
                {hasDescription
                  ? serviceRequest.description
                  : "No description was provided for this request."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {role === "admin" ? (
            <ServiceUpdateStatus
              serviceRequest={serviceRequest}
              role={role}
              serviceCode={serviceCode}
            />
          ) : (
            <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
              <h3 className="text-sm font-semibold text-primary-dark">Request Status</h3>
              <p className="text-xs text-secondary-text mt-2">
                Current state:{" "}
                <span className="text-primary-dark font-medium">{statusLabel}</span>
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Linked Records</h3>
            {hasLinkedRecords ? (
              <div className="mt-3 space-y-3">
                {quoteCode ? (
                  <Link
                    href={`${billingBase}/quotes/${quoteCode}`}
                    className="block rounded-lg border border-border px-3 py-2 text-sm text-primary-dark hover:bg-primary-light/20"
                  >
                    Quote: {quoteCode}
                  </Link>
                ) : null}
                {invoiceCode ? (
                  <Link
                    href={`${billingBase}/invoices/${invoiceCode}`}
                    className="block rounded-lg border border-border px-3 py-2 text-sm text-primary-dark hover:bg-primary-light/20"
                  >
                    Invoice: {invoiceCode}
                  </Link>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-secondary-text mt-2">
                No quote or invoice linked yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Timeline</h3>
            <div className="mt-3 space-y-3 text-xs text-secondary-text">
              <div>
                <p className="uppercase tracking-wide">Submitted On</p>
                <p className="text-primary-dark mt-1">
                  {formatDate(serviceRequest.created_at, { fallback: "--" })}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Last Updated</p>
                <p className="text-primary-dark mt-1">
                  {formatDateTime(serviceRequest.updated_at, { fallback: "--" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-primary-dark">Request Snapshot</h2>
            <p className="text-sm text-secondary-text mt-1">
              Quick status view for intake, quotation, and fulfillment tracking.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(
              serviceRequest.status,
            )}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Service Type</p>
            <p className="mt-1 text-sm font-semibold text-primary-dark">{serviceTypeLabel}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Quote</p>
            <p className="mt-1 text-sm font-semibold text-primary-dark">{quoteCode || "--"}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Invoice</p>
            <p className="mt-1 text-sm font-semibold text-primary-dark">{invoiceCode || "--"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

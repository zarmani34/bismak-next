"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useServiceRequest } from "@/hooks/useServices";
import ErrorState from "../states/ErrorState";
import { getStatusColor } from "../../constants";
import { formatDate, formatDateTime } from "@/src/utils/date";
import ServiceUpdateStatus from "../project-details/ServiceUpdateStatus";

type ServiceRequestDetailPageProps = {
  role: "admin" | "client";
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
  const serviceCode = typeof params?.code === "string" ? params.code : "";
  {console.log(serviceCode)}
  const {
    data: serviceRequest,
    isLoading,
    isError,
    refetch,
  } = useServiceRequest(serviceCode);

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
  const ownerLabel = getOwnerLabel(serviceRequest.owner_name, serviceRequest.owner);
  const statusLabel = serviceRequest.status_display || toTitleCaseStatus(serviceRequest.status);
  const createdAt = formatDateTime(serviceRequest.created_at, { fallback: "--" });
  const updatedAt = formatDateTime(serviceRequest.updated_at, { fallback: "--" });

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href={`/portal/${role}/services`}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Service Requests
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-primary-light/20 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-dark">{serviceLabel}</h1>
              <p className="text-sm text-secondary-text mt-1">{serviceCode}</p>
              <p className="text-sm text-secondary-text mt-2">
                {serviceRequest.company_name || "Unknown Company"}
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
        </div>
        {role === "admin" && <ServiceUpdateStatus serviceRequest={serviceRequest} />}
        <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
          <h2 className="text-lg font-semibold text-primary-dark mb-3">Service Type</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-dark border border-primary/20">
              {serviceLabel}
            </span>
            {serviceRequest.service_type_id !== undefined &&
            serviceRequest.service_type_id !== null ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-tetiary border border-border text-secondary-text">
                ID: {String(serviceRequest.service_type_id)}
              </span>
            ) : null}
          </div>
          <p className="text-xs text-secondary-text mt-3">
            Submitted on {formatDate(serviceRequest.created_at, { fallback: "--" })}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Client</p>
            <p className="mt-2 text-sm font-medium text-primary-dark">{ownerLabel}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Location</p>
            <p className="mt-2 text-sm font-medium text-primary-dark">
              {serviceRequest.location || "--"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Created</p>
            <p className="mt-2 text-sm font-medium text-primary-dark">{createdAt}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Updated</p>
            <p className="mt-2 text-sm font-medium text-primary-dark">{updatedAt}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-3">Request Description</h2>
        <p className="text-sm text-primary-dark leading-relaxed">
          {serviceRequest.description || "No description provided."}
        </p>
      </div>

    </div>
  );
}

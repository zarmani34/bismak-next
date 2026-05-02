"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaClockRotateLeft, FaScrewdriverWrench } from "react-icons/fa6";
import {
  useEquipment,
  useEquipmentItemRequests,
  useEquipmentMaintenanceRequests,
} from "@/hooks/useEquipment";
import { formatDate, formatDateTime } from "@/src/utils/date";
import ErrorState from "../states/ErrorState";
import { getStatusColor } from "../../constants";

type EquipmentDetailPageProps = {
  role: "admin" | "staff";
};

const getEquipmentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-primary/20 text-primary";
    case "in_use":
      return "bg-info/20 text-info";
    case "under_maintenance":
      return "bg-secondary/20 text-secondary";
    case "retired":
      return "bg-error/20 text-error";
    default:
      return "bg-primary-light/20 text-primary-dark";
  }
};

export default function EquipmentDetailPage({ role }: EquipmentDetailPageProps) {
  const params = useParams();
  const equipmentId =
    typeof params?.id === "string"
      ? params.id
      : typeof params?.code === "string"
        ? params.code
        : "";
  const toolsBasePath = role === "admin" ? "/portal/admin/tools" : "/portal/staff/tools";

  const {
    data: equipment,
    isLoading: isEquipmentLoading,
    isError: isEquipmentError,
    refetch: refetchEquipment,
  } = useEquipment(equipmentId);

  const {
    data: equipmentRequests = [],
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    refetch: refetchRequests,
  } = useEquipmentItemRequests(equipmentId);

  const {
    data: maintenanceRequests = [],
    isLoading: isMaintenanceLoading,
    isError: isMaintenanceError,
    refetch: refetchMaintenance,
  } = useEquipmentMaintenanceRequests(equipmentId);

  if (isEquipmentLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading product details...
      </div>
    );
  }

  if (isEquipmentError || !equipment) {
    return (
      <ErrorState
        message="Unable to load product details."
        onRetry={() => refetchEquipment()}
      />
    );
  }

  const activeMaintenanceCount = maintenanceRequests.filter((item) =>
    ["pending", "scheduled", "in_progress"].includes(item.status),
  ).length;

  return (
    <div className="space-y-6">
      <Link
        href={toolsBasePath}
        className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back to Tools & Machines
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-primary-light/20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-secondary-text">
                  PRODUCT PROFILE
                </p>
                <h1 className="text-2xl font-bold text-primary-dark mt-1">{equipment.name}</h1>
                <p className="text-xs text-secondary-text mt-1">ID: {equipment.id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getEquipmentStatusColor(
                  equipment.status,
                )}`}
              >
                {equipment.status_display}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs text-secondary-text">Category</p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">{equipment.category}</p>
              </div>
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs text-secondary-text">Model</p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">{equipment.model}</p>
              </div>
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs text-secondary-text">Serial Number</p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  {equipment.serial_number}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs text-secondary-text">Last Maintenance</p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  {formatDate(equipment.last_maintenance_date, { fallback: "--" })}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs text-secondary-text">Next Maintenance</p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  {formatDate(equipment.next_maintenance_date, { fallback: "--" })}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-tetiary/80 p-4">
                <p className="text-xs text-secondary-text">Created</p>
                <p className="mt-1 text-sm font-semibold text-primary-dark">
                  {formatDateTime(equipment.created_at, { fallback: "--" })}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-tetiary/80 p-4">
              <h2 className="text-sm font-semibold text-primary-dark">Description</h2>
              <p className="mt-2 text-sm text-primary-dark leading-relaxed">
                {equipment.description?.trim() || "No description was provided for this asset."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Quick Summary</h3>
            <div className="mt-3 space-y-3 text-xs text-secondary-text">
              <div className="rounded-lg border border-border bg-tetiary/70 p-3">
                <p className="uppercase tracking-wide">Equipment Requests</p>
                <p className="text-lg font-semibold text-primary-dark mt-1">
                  {equipmentRequests.length}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-tetiary/70 p-3">
                <p className="uppercase tracking-wide">Maintenance Records</p>
                <p className="text-lg font-semibold text-primary-dark mt-1">
                  {maintenanceRequests.length}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-tetiary/70 p-3">
                <p className="uppercase tracking-wide">Active Maintenance</p>
                <p className="text-lg font-semibold text-primary-dark mt-1">
                  {activeMaintenanceCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-primary-light/20 p-5">
            <h3 className="text-sm font-semibold text-primary-dark">Latest Update</h3>
            <div className="mt-3 flex items-start gap-2 text-xs text-secondary-text">
              <FaClockRotateLeft className="w-3 h-3 mt-0.5" />
              <p className="text-primary-dark">
                {formatDateTime(equipment.updated_at, { fallback: "--" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-primary-light/20">
            <h2 className="text-sm font-semibold text-primary-dark">Equipment Requests</h2>
          </div>
          <div className="p-4 max-h-[22rem] overflow-y-auto space-y-3">
            {isRequestsLoading ? (
              <p className="text-sm text-secondary-text">Loading requests...</p>
            ) : isRequestsError ? (
              <div className="space-y-2 text-sm text-secondary-light">
                <p>Unable to load equipment requests.</p>
                <button
                  type="button"
                  onClick={() => refetchRequests()}
                  className="rounded-lg border border-border px-3 py-1 text-xs text-primary-dark hover:bg-primary-light/20"
                >
                  Retry
                </button>
              </div>
            ) : equipmentRequests.length === 0 ? (
              <p className="text-sm text-secondary-text">No equipment requests found.</p>
            ) : (
              equipmentRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-border bg-tetiary/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary-dark">
                        {request.requested_by || "Unknown Requester"}
                      </p>
                      <p className="text-xs text-secondary-text mt-1">
                        Project: {request.project_code || "--"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${getStatusColor(
                        request.status,
                      )}`}
                    >
                      {request.status_display}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-text mt-2">
                    Needed: {formatDate(request.date_needed, { fallback: "--" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          id="maintenance"
          className="rounded-2xl border border-border bg-primary-light/10 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-primary-light/20 flex items-center gap-2">
            <FaScrewdriverWrench className="w-4 h-4 text-primary-dark" />
            <h2 className="text-sm font-semibold text-primary-dark">Maintenance Records</h2>
          </div>
          <div className="p-4 max-h-[22rem] overflow-y-auto space-y-3">
            {isMaintenanceLoading ? (
              <p className="text-sm text-secondary-text">Loading maintenance...</p>
            ) : isMaintenanceError ? (
              <div className="space-y-2 text-sm text-secondary-light">
                <p>Unable to load maintenance records.</p>
                <button
                  type="button"
                  onClick={() => refetchMaintenance()}
                  className="rounded-lg border border-border px-3 py-1 text-xs text-primary-dark hover:bg-primary-light/20"
                >
                  Retry
                </button>
              </div>
            ) : maintenanceRequests.length === 0 ? (
              <p className="text-sm text-secondary-text">No maintenance records found.</p>
            ) : (
              maintenanceRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-border bg-tetiary/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary-dark">{request.type_display}</p>
                      <p className="text-xs text-secondary-text mt-1">
                        Requested by: {request.requested_by || "--"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${getStatusColor(
                        request.status,
                      )}`}
                    >
                      {request.status_display}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-text mt-2">
                    Scheduled: {formatDate(request.scheduled_date, { fallback: "--" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaWrench } from "react-icons/fa";
import {
  FaClock,
  FaMagnifyingGlass,
  FaPlus,
  FaScrewdriverWrench,
  FaToolbox,
  FaTriangleExclamation,
} from "react-icons/fa6";
import {
  useEquipmentList,
  useEquipmentRequests,
  useMaintenanceRequests,
  useUpdateEquipmentRequestStatus,
} from "@/hooks/useEquipment";
import DashboardStatsCard from "../DashBoardStatsCard";
import { formatDate } from "@/src/utils/date";
import ErrorState from "../states/ErrorState";
import StatsCardsSkeleton from "../skeletons/StatsCardsSkeleton";
import TableSkeleton from "../skeletons/TableSkeleton";
import CreateEquipmentRequestModal from "../modals/CreateEquipmentRequestModal";
import RegisterEquipmentModal from "../modals/RegisterEquipmentModal";
import { extractApiError } from "@/lib/errors";
import {
  getEquipmentStatusColor,
  getRequestStatusColor,
} from "../../utils/toolsStatusColor";
import { EquipmentListItem } from "@/schemas/equipment";
import { ColumnDef } from "@tanstack/react-table";
import { SearchBar } from "../SearchBar";
import { DataTable } from "../tables/Datatable";

type ToolsWorkspaceProps = {
  role: "admin" | "staff";
};


function StatusBadge({ status, display }: { status: string; display: string }) {
  const colors: Record<string, string> = {
    available: "bg-success/10 text-success",
    in_use: "bg-primary/10 text-primary",
    under_maintenance: "bg-warning/10 text-warning",
    retired: "bg-muted/10 text-muted",
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] ?? "bg-muted/10 text-muted"}`}
    >
      {display}
    </span>
  );
}

const columns: ColumnDef<EquipmentListItem>[] = [
  {
    accessorKey: "name",
    header: "Equipment",
    cell: ({ getValue }) => (
      <span className="font-semibold text-primary-dark">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    accessorFn: (row) => row.category?.name ?? "—",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "serial_number",
    header: "Serial No.",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        display={row.original.status_display}
      />
    ),
  },
  {
    accessorKey: "next_maintenance_date",
    header: "Next Maintenance",
    cell: ({ getValue }) => {
      const val = getValue() as string | null;
      return val ? (
        new Date(val).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      ) : (
        <span className="text-muted">—</span>
      );
    },
  },
];

export default function ToolsWorkspace({ role }: ToolsWorkspaceProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [requestActionError, setRequestActionError] = useState<string | null>(
    null,
  );

  const {
    data: equipment = [],
    isLoading: isEquipmentLoading,
    isError: isEquipmentError,
    refetch: refetchEquipment,
  } = useEquipmentList();

  const {
    data: maintenanceRequests = [],
    isLoading: isMaintenanceLoading,
    isError: isMaintenanceError,
    refetch: refetchMaintenance,
  } = useMaintenanceRequests();
  const {
    data: equipmentRequests = [],
    isLoading: isEquipmentRequestsLoading,
    isError: isEquipmentRequestsError,
    refetch: refetchEquipmentRequests,
  } = useEquipmentRequests();
  const updateEquipmentRequestStatus = useUpdateEquipmentRequestStatus();

  const isLoading =
    isEquipmentLoading || isMaintenanceLoading || isEquipmentRequestsLoading;
  const hasError =
    isEquipmentError || isMaintenanceError || isEquipmentRequestsError;
  const toolsBasePath =
    role === "admin" ? "/portal/admin/tools" : "/portal/staff/tools";

  const maintenanceQueue = useMemo(() => {
    return maintenanceRequests
      .filter((item) =>
        ["pending", "scheduled", "in_progress"].includes(item.status),
      )
      .sort((a, b) => {
        const left = a.scheduled_date || a.created_at;
        const right = b.scheduled_date || b.created_at;
        return new Date(left).getTime() - new Date(right).getTime();
      })
      .slice(0, 8);
  }, [maintenanceRequests]);
  const equipmentRequestQueue = useMemo(() => {
    return equipmentRequests
      .filter((item) =>
        ["pending", "approved", "rejected", "returned"].includes(item.status),
      )
      .slice(0, 8);
  }, [equipmentRequests]);

  const toolStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalAssets = equipment.length;
    const inUse = equipment.filter((item) => item.status === "in_use").length;
    const underMaintenance = equipment.filter(
      (item) => item.status === "under_maintenance",
    ).length;
    const overdueMaintenance = equipment.filter((item) => {
      if (!item.next_maintenance_date) return false;
      const nextDate = new Date(item.next_maintenance_date);
      nextDate.setHours(0, 0, 0, 0);
      return nextDate < today;
    }).length;

    return [
      {
        label: "Total Assets",
        value: String(totalAssets),
        icon: <FaToolbox />,
        color: "primary" as const,
      },
      {
        label: "In Use",
        value: String(inUse),
        icon: <FaScrewdriverWrench />,
        color: "info" as const,
      },
      {
        label: "Under Maintenance",
        value: String(underMaintenance),
        icon: <FaWrench />,
        color: "warning" as const,
      },
      {
        label: "Overdue Maintenance",
        value: String(overdueMaintenance),
        icon: <FaTriangleExclamation />,
        color: "error" as const,
      },
    ];
  }, [equipment]);

  const handleRetry = () => {
    void refetchEquipment();
    void refetchMaintenance();
    void refetchEquipmentRequests();
  };

  const handleEquipmentRequestAction = async (
    requestCode: string,
    status: string,
  ) => {
    setRequestActionError(null);
    try {
      await updateEquipmentRequestStatus.mutateAsync({
        code: requestCode,
        status,
      });
    } catch (error) {
      setRequestActionError(extractApiError(error));
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">
            Tools & Machines
          </h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Monitor asset availability, assignments, and maintenance schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === "admin" ? (
            <>
              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-primary-dark text-sm hover:bg-primary-light/20 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Request Tool
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-tetiary text-sm font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Register Asset
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-tetiary text-sm font-medium"
            >
              <FaPlus className="w-4 h-4" />
              Request Machine or Tool
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <StatsCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
          {toolStats.map((stat) => (
            <DashboardStatsCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      {hasError ? (
        <ErrorState
          message="Unable to load tools and maintenance data."
          onRetry={handleRetry}
        />
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h2 className="text-lg font-semibold text-primary-dark">
              Asset Register
            </h2>

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
              className="w-full sm:w-64"
            />
          </div>

          <DataTable
        data={equipment ?? []}
        columns={columns}
        isLoading={isLoading}
        isError={isEquipmentError}
        globalFilter={search}
        onGlobalFilterChange={setSearch}
        onRowClick={(row) => router.push(`/portal/admin/equipment/${row.id}`)}
      />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary-dark">
                Maintenance Queue
              </h2>
            </div>

            <div className="p-4 bg-primary-light/10 space-y-3 max-h-128 overflow-y-auto">
              {isMaintenanceLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-primary-light/30 p-4 bg-primary-light/20 animate-pulse"
                  >
                    <div className="h-4 w-40 bg-primary/20 rounded" />
                    <div className="mt-2 h-3 w-24 bg-primary/10 rounded" />
                    <div className="mt-3 h-3 w-32 bg-primary/10 rounded" />
                  </div>
                ))
              ) : maintenanceQueue.length === 0 ? (
                <p className="text-sm text-secondary-text">
                  No maintenance tasks in queue.
                </p>
              ) : (
                maintenanceQueue.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-primary-light/30 p-4 bg-primary-light/20 hover:bg-primary-light/30 transition-colors"
                  >
                    <p className="text-sm font-semibold text-primary-dark">
                      {task.equipment_name}
                    </p>
                    <p className="text-sm text-body-text">
                      {task.type_display}
                    </p>
                    <p className="text-xs text-secondary-text mt-1">
                      {task.status_display}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-secondary-text">
                      <FaClock className="w-3 h-3" />
                      Due {formatDate(task.scheduled_date || task.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary-dark">
                Equipment Requests
              </h2>
            </div>

            <div className="p-4 bg-primary-light/10 space-y-3 max-h-80 overflow-y-auto">
              {requestActionError ? (
                <p className="text-xs text-secondary-light">
                  {requestActionError}
                </p>
              ) : null}
              {isEquipmentRequestsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-primary-light/30 p-4 bg-primary-light/20 animate-pulse"
                  >
                    <div className="h-4 w-40 bg-primary/20 rounded" />
                    <div className="mt-2 h-3 w-24 bg-primary/10 rounded" />
                    <div className="mt-3 h-3 w-32 bg-primary/10 rounded" />
                  </div>
                ))
              ) : equipmentRequestQueue.length === 0 ? (
                <p className="text-sm text-secondary-text">
                  No active equipment requests.
                </p>
              ) : (
                equipmentRequestQueue.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg border border-primary-light/30 p-4 bg-primary-light/20 hover:bg-primary-light/30 transition-colors"
                  >
                    <p className="text-sm font-semibold text-primary-dark">
                      {request.equipment_name}
                    </p>
                    <p className="text-xs text-secondary-text mt-1">
                      Requested by {request.requested_by || "--"}
                    </p>
                    <p className="text-xs text-secondary-text mt-1">
                      Project: {request.project_code || "--"}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-medium ${getRequestStatusColor(
                          request.status,
                        )}`}
                      >
                        {request.status_display}
                      </span>
                      {role === "admin" && request.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            disabled={updateEquipmentRequestStatus.isPending}
                            onClick={() =>
                              void handleEquipmentRequestAction(
                                request.code,
                                "approved",
                              )
                            }
                            className="px-2 py-1 rounded-md text-[11px] font-medium border border-secondary/40 text-secondary hover:bg-secondary/10 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={updateEquipmentRequestStatus.isPending}
                            onClick={() =>
                              void handleEquipmentRequestAction(
                                request.code,
                                "rejected",
                              )
                            }
                            className="px-2 py-1 rounded-md text-[11px] font-medium border border-error/40 text-error hover:bg-error/10 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      {role === "staff" && request.status === "approved" ? (
                        <button
                          type="button"
                          disabled={updateEquipmentRequestStatus.isPending}
                          onClick={() =>
                            void handleEquipmentRequestAction(
                              request.id,
                              "returned",
                            )
                          }
                          className="px-2 py-1 rounded-md text-[11px] font-medium border border-info/40 text-info hover:bg-info/10 disabled:opacity-60"
                        >
                          Return
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateEquipmentRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />

      {role === "admin" ? (
        <RegisterEquipmentModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      ) : null}
    </div>
  );
}

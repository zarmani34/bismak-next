"use client";

import { useMemo, useState } from "react";
import { FaEye, FaWrench } from "react-icons/fa";
import {
  FaClock,
  FaMagnifyingGlass,
  FaPlus,
  FaScrewdriverWrench,
  FaToolbox,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { useEquipmentList, useMaintenanceRequests } from "@/hooks/useEquipment";
import DashboardStatsCard from "../DashBoardStatsCard";
import { formatDate } from "@/src/utils/date";
import ErrorState from "../states/ErrorState";
import StatsCardsSkeleton from "../skeletons/StatsCardsSkeleton";
import TableSkeleton from "../skeletons/TableSkeleton";
import CreateEquipmentRequestModal from "../modals/CreateEquipmentRequestModal";
import RegisterEquipmentModal from "../modals/RegisterEquipmentModal";

type ToolsWorkspaceProps = {
  role: "admin" | "staff";
};

type EquipmentStatusFilter = "all" | "available" | "in_use" | "under_maintenance" | "retired";

const statusFilters: Array<{ label: string; value: EquipmentStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "In Use", value: "in_use" },
  { label: "Maintenance", value: "under_maintenance" },
  { label: "Retired", value: "retired" },
];

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

export default function ToolsWorkspace({ role }: ToolsWorkspaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatusFilter>("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  const isLoading = isEquipmentLoading || isMaintenanceLoading;
  const hasError = isEquipmentError || isMaintenanceError;

  const filteredEquipment = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return equipment.filter((item) => {
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
      const matchesSearch =
        q.length === 0
          ? true
          : item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.serial_number.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [equipment, searchTerm, statusFilter]);

  const maintenanceQueue = useMemo(() => {
    return maintenanceRequests
      .filter((item) => ["pending", "scheduled", "in_progress"].includes(item.status))
      .sort((a, b) => {
        const left = a.scheduled_date || a.created_at;
        const right = b.scheduled_date || b.created_at;
        return new Date(left).getTime() - new Date(right).getTime();
      })
      .slice(0, 8);
  }, [maintenanceRequests]);

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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Tools & Machines</h1>
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
        <ErrorState message="Unable to load tools and maintenance data." onRetry={handleRetry} />
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h2 className="text-lg font-semibold text-primary-dark">Asset Register</h2>

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="relative">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-xs" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search equipment"
                  className="pl-9 pr-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary min-w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as EquipmentStatusFilter)}
                className="px-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {statusFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 shadow-md transition duration-200">
            <table className="w-full min-w-[820px]">
              <thead className="bg-primary-light/40 border-b border-tetiary">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Model
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Next Service
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isEquipmentLoading ? (
                  <TableSkeleton rows={5} />
                ) : filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary-text">
                      No equipment match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredEquipment.map((item) => (
                    <tr key={item.id} className="border-b border-tetiary hover:bg-primary/20">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                        {item.serial_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                        {item.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                        {formatDate(item.next_maintenance_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEquipmentStatusColor(
                            item.status,
                          )}`}
                        >
                          {item.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="p-2 text-body-text hover:text-primary-light" type="button">
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-body-text hover:text-primary-light" type="button">
                            <FaWrench className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-primary-dark">Maintenance Queue</h2>
          </div>

          <div className="p-4 bg-primary-light/10 space-y-3 max-h-[32rem] overflow-y-auto">
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
              <p className="text-sm text-secondary-text">No maintenance tasks in queue.</p>
            ) : (
              maintenanceQueue.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-primary-light/30 p-4 bg-primary-light/20 hover:bg-primary-light/30 transition-colors"
                >
                  <p className="text-sm font-semibold text-primary-dark">{task.equipment_name}</p>
                  <p className="text-sm text-body-text">{task.type_display}</p>
                  <p className="text-xs text-secondary-text mt-1">{task.status_display}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-secondary-text">
                    <FaClock className="w-3 h-3" />
                    Due {formatDate(task.scheduled_date || task.created_at)}
                  </div>
                </div>
              ))
            )}
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

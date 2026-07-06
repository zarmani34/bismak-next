"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FaClipboardCheck, FaToolbox, FaTriangleExclamation } from "react-icons/fa6";
import DashboardWelcome from "@/src/components/DashboardWelcome";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import StatsCardsSkeleton from "../../../components/skeletons/StatsCardsSkeleton";
import ErrorState from "../../../components/states/ErrorState";
import { useProjects } from "@/hooks/useProjects";
import { useEquipmentList, useMaintenanceRequests } from "@/hooks/useEquipment";
import { formatDate } from "@/src/utils/date";
import { FaCheckCircle } from "react-icons/fa";

export default function StaffDashboardPage() {
  const {
    data: projectData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useProjects();
  const {
    data: equipment = [],
    isLoading: isEquipmentLoading,
    isError: isEquipmentError,
    refetch: refetchEquipment,
  } = useEquipmentList();
  const {
    data: maintenance = [],
    isLoading: isMaintenanceLoading,
    isError: isMaintenanceError,
    refetch: refetchMaintenance,
  } = useMaintenanceRequests();

  const projects = useMemo(() => projectData ?? [], [projectData]);
  const activeProjects = projects.filter((project) => project.status === "in_progress");
  const completedProjects = projects.filter((project) => project.status === "completed");

  const pendingMaintenance = maintenance.filter((item) =>
    ["pending", "scheduled", "in_progress"].includes(item.status),
  );

  const overdueMaintenance = maintenance.filter((item) => item.status === "overdue");

  const staffStats = useMemo(
    () => [
      {
        label: "Assigned Projects",
        value: String(projects.length),
        icon: <FaClipboardCheck />,
        color: "primary" as const,
      },
      {
        label: "Active Work",
        value: String(activeProjects.length),
        icon: <FaToolbox />,
        color: "info" as const,
      },
      {
        label: "Completed",
        value: String(completedProjects.length),
        icon: <FaCheckCircle />,
        color: "primary" as const,
      },
      {
        label: "Overdue Maintenance",
        value: String(overdueMaintenance.length),
        icon: <FaTriangleExclamation />,
        color: "error" as const,
      },
    ],
    [activeProjects.length, completedProjects.length, overdueMaintenance.length, projects.length],
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
        )
        .slice(0, 5),
    [projects],
  );

  const queuedMaintenance = useMemo(
    () =>
      [...pendingMaintenance]
        .sort(
          (left, right) =>
            new Date(left.scheduled_date || left.created_at).getTime() -
            new Date(right.scheduled_date || right.created_at).getTime(),
        )
        .slice(0, 6),
    [pendingMaintenance],
  );

  const isLoading = isProjectsLoading || isEquipmentLoading || isMaintenanceLoading;
  const hasError = isProjectsError || isEquipmentError || isMaintenanceError;

  const handleRetry = () => {
    void refetchProjects();
    void refetchEquipment();
    void refetchMaintenance();
  };

  return (
    <div className="space-y-6">
      <DashboardWelcome text="Live summary of assigned projects, tools and maintenance queue." />

      {isLoading ? (
        <StatsCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staffStats.map((stat) => (
            <DashboardStatsCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      {hasError ? (
        <ErrorState message="Unable to load staff dashboard data." onRetry={handleRetry} />
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/20 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-dark">Recent Assigned Projects</h2>
            <Link href="/portal/staff/projects" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-secondary-text">No projects assigned yet.</p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.code}
                  href={`/portal/staff/projects/${project.code}`}
                  className="block rounded-lg border border-border bg-tetiary/80 p-4 hover:bg-primary-light/20 transition-colors"
                >
                  <p className="text-sm font-semibold text-primary-dark">{project.name}</p>
                  <p className="text-xs text-secondary-text mt-1">{project.code}</p>
                  <p className="text-xs text-secondary-text mt-1">
                    {project.location} • {project.status_display}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/20">
            <h2 className="text-lg font-semibold text-primary-dark">Maintenance Queue</h2>
          </div>
          <div className="p-4 space-y-3 max-h-[28rem] overflow-y-auto">
            {queuedMaintenance.length === 0 ? (
              <p className="text-sm text-secondary-text">No pending maintenance jobs.</p>
            ) : (
              queuedMaintenance.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-tetiary/80 p-3">
                  <p className="text-sm font-semibold text-primary-dark">{item.equipment_name}</p>
                  <p className="text-xs text-secondary-text mt-1">{item.type_display}</p>
                  <p className="text-xs text-secondary-text mt-1">
                    Due {formatDate(item.scheduled_date || item.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-primary-light/10 p-6">
        <h2 className="text-lg font-semibold text-primary-dark">Equipment Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Total Assets</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">{equipment.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">In Use</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">
              {equipment.filter((item) => item.status === "in_use").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Under Maintenance</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">
              {equipment.filter((item) => item.status === "under_maintenance").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

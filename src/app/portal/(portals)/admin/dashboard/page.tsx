"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  FaClockRotateLeft,
  FaFileInvoiceDollar,
  FaFolderOpen,
} from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import DashboardWelcome from "@/src/components/DashboardWelcome";
import StatsCardsSkeleton from "../../../components/skeletons/StatsCardsSkeleton";
import ErrorState from "../../../components/states/ErrorState";
import { useProjectStats, useProjects } from "@/hooks/useProjects";
import { useServiceRequests, useServiceStats } from "@/hooks/useServices";
import { useInvoices, useQuotes } from "@/hooks/useBilling";
import { formatDate } from "@/src/utils/date";
import { FaCheckCircle } from "react-icons/fa";

const toCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminDashboardPortal() {
  const {
    data: projectStats,
    isLoading: isProjectStatsLoading,
    isError: isProjectStatsError,
    refetch: refetchProjectStats,
  } = useProjectStats();
  const {
    data: serviceStats,
    isLoading: isServiceStatsLoading,
    isError: isServiceStatsError,
    refetch: refetchServiceStats,
  } = useServiceStats();
  const {
    data: projectData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useProjects();
  const {
    data: serviceData,
    isLoading: isServicesLoading,
    isError: isServicesError,
    refetch: refetchServices,
  } = useServiceRequests();
  const {
    data: invoices = [],
    isLoading: isInvoicesLoading,
    isError: isInvoicesError,
    refetch: refetchInvoices,
  } = useInvoices();
  const {
    data: quotes = [],
    isLoading: isQuotesLoading,
    isError: isQuotesError,
    refetch: refetchQuotes,
  } = useQuotes();

  const projectList = useMemo(() => projectData?.results ?? [], [projectData]);
  const serviceList = useMemo(
    () => (Array.isArray(serviceData) ? serviceData : serviceData?.results ?? []),
    [serviceData],
  );

  const dashboardStats = useMemo(() => {
    const collected = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount || "0"), 0);

    const overdue = invoices.filter((invoice) => invoice.status === "overdue").length;

    return [
      {
        label: "Total Projects",
        value: String(projectStats?.total ?? projectList.length),
        icon: <FaFolderOpen />,
        color: "primary" as const,
      },
      {
        label: "Completed Projects",
        value: String(projectStats?.completed ?? 0),
        icon: <FaCheckCircle />,
        color: "info" as const,
      },
      {
        label: "Service Requests",
        value: String(serviceStats?.total ?? serviceList.length),
        icon: <FaClockRotateLeft />,
        color: "warning" as const,
      },
      {
        label: "Collected Revenue",
        value: toCurrency(collected),
        icon: <FaFileInvoiceDollar />,
        color: overdue > 0 ? ("warning" as const) : ("primary" as const),
      },
    ];
  }, [invoices, projectList.length, projectStats, serviceList.length, serviceStats]);

  const recentProjects = useMemo(
    () =>
      [...projectList]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
        )
        .slice(0, 5),
    [projectList],
  );

  const recentServices = useMemo(
    () =>
      [...serviceList]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
        )
        .slice(0, 5),
    [serviceList],
  );

  const hasError =
    isProjectStatsError ||
    isServiceStatsError ||
    isProjectsError ||
    isServicesError ||
    isInvoicesError ||
    isQuotesError;
  const isLoading =
    isProjectStatsLoading ||
    isServiceStatsLoading ||
    isProjectsLoading ||
    isServicesLoading ||
    isInvoicesLoading ||
    isQuotesLoading;

  const handleRetry = () => {
    void refetchProjectStats();
    void refetchServiceStats();
    void refetchProjects();
    void refetchServices();
    void refetchInvoices();
    void refetchQuotes();
  };

  return (
    <div className="space-y-6">
      <DashboardWelcome text="Live overview of projects, service requests, and billing performance." />

      {isLoading ? (
        <StatsCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => (
            <DashboardStatsCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      {hasError ? (
        <ErrorState
          message="Unable to load some dashboard metrics."
          onRetry={handleRetry}
        />
      ) : null}

      <div className="rounded-2xl border border-border bg-primary-light/10 p-6">
        <h2 className="text-lg font-semibold text-primary-dark">Billing Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Total Quotes</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">{quotes.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Outstanding Invoices</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">
              {invoices.filter((invoice) => ["sent", "overdue"].includes(invoice.status)).length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Overdue Invoices</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">
              {invoices.filter((invoice) => invoice.status === "overdue").length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/20 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-dark">Recent Projects</h2>
            <Link href="/portal/admin/projects" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-4 space-y-3 max-h-[28rem] overflow-y-auto">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-secondary-text">No projects available yet.</p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.code}
                  href={`/portal/admin/projects/${project.code}`}
                  className="block rounded-lg border border-border bg-tetiary/80 p-4 hover:bg-primary-light/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-primary-dark">{project.name}</p>
                      <p className="text-xs text-secondary-text mt-1">{project.code}</p>
                      <p className="text-xs text-secondary-text mt-1">
                        {project.company} • {project.location}
                      </p>
                    </div>
                    <span className="text-xs text-primary-dark">{project.status_display}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/20">
            <h2 className="text-lg font-semibold text-primary-dark">Service Pulse</h2>
          </div>
          <div className="p-4 space-y-3 max-h-[28rem] overflow-y-auto">
            {recentServices.length === 0 ? (
              <p className="text-sm text-secondary-text">No recent service requests.</p>
            ) : (
              recentServices.map((service) => (
                <Link
                  key={service.code}
                  href={`/portal/admin/services/${service.code}`}
                  className="block rounded-lg border border-border bg-tetiary/80 p-3 hover:bg-primary-light/20 transition-colors"
                >
                  <p className="text-sm font-semibold text-primary-dark">{service.service_name}</p>
                  <p className="text-xs text-secondary-text mt-1">{service.owner_name}</p>
                  <p className="text-xs text-secondary-text mt-1">{formatDate(service.created_at)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

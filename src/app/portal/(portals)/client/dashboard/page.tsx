"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FaClockRotateLeft, FaFileInvoiceDollar, FaFolderOpen } from "react-icons/fa6";
import DashboardWelcome from "@/src/components/DashboardWelcome";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import StatsCardsSkeleton from "../../../components/skeletons/StatsCardsSkeleton";
import ErrorState from "../../../components/states/ErrorState";
import { useProjects } from "@/hooks/useProjects";
import { useServiceRequests } from "@/hooks/useServices";
import { useInvoices, useQuotes } from "@/hooks/useBilling";
import { formatDate } from "@/src/utils/date";
import { FaCheckCircle } from "react-icons/fa";

export default function ClientDashboard() {
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

  const projects = useMemo(() => projectData?.results ?? [], [projectData]);
  const services = useMemo(
    () => (Array.isArray(serviceData) ? serviceData : serviceData?.results ?? []),
    [serviceData],
  );

  const clientStats = useMemo(
    () => [
      {
        label: "My Projects",
        value: String(projects.length),
        icon: <FaFolderOpen />,
        color: "primary" as const,
      },
      {
        label: "Active Services",
        value: String(
          services.filter((service) => ["pending", "reviewed", "quoted", "in_progress"].includes(service.status)).length,
        ),
        icon: <FaClockRotateLeft />,
        color: "warning" as const,
      },
      {
        label: "Outstanding Invoices",
        value: String(invoices.filter((invoice) => ["sent", "overdue"].includes(invoice.status)).length),
        icon: <FaFileInvoiceDollar />,
        color: "error" as const,
      },
      {
        label: "Completed Services",
        value: String(services.filter((service) => service.status === "completed").length),
        icon: <FaCheckCircle />,
        color: "info" as const,
      },
    ],
    [invoices, projects.length, services],
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
        )
        .slice(0, 4),
    [projects],
  );

  const recentServices = useMemo(
    () =>
      [...services]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
        )
        .slice(0, 4),
    [services],
  );

  const isLoading = isProjectsLoading || isServicesLoading || isInvoicesLoading || isQuotesLoading;
  const hasError = isProjectsError || isServicesError || isInvoicesError || isQuotesError;

  const handleRetry = () => {
    void refetchProjects();
    void refetchServices();
    void refetchInvoices();
    void refetchQuotes();
  };

  return (
    <div className="space-y-6">
      <DashboardWelcome text="Track your ongoing projects, services, and billing updates in real time." />

      {isLoading ? (
        <StatsCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientStats.map((stat) => (
            <DashboardStatsCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      {hasError ? (
        <ErrorState message="Unable to load dashboard data." onRetry={handleRetry} />
      ) : null}

      <div className="rounded-2xl border border-border bg-primary-light/10 p-6">
        <h2 className="text-lg font-semibold text-primary-dark">Billing Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Quotes Issued</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">{quotes.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Invoices Sent</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">
              {invoices.filter((invoice) => invoice.status === "sent").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-tetiary/80 p-4">
            <p className="text-xs text-secondary-text">Invoices Paid</p>
            <p className="mt-1 text-lg font-semibold text-primary-dark">
              {invoices.filter((invoice) => invoice.status === "paid").length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/20 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-dark">Recent Projects</h2>
            <Link href="/portal/client/projects" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-4 space-y-3 max-h-[24rem] overflow-y-auto">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-secondary-text">No projects yet.</p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.code}
                  href={`/portal/client/projects/${project.code}`}
                  className="block rounded-lg border border-border bg-tetiary/80 p-4 hover:bg-primary-light/20 transition-colors"
                >
                  <p className="text-sm font-semibold text-primary-dark">{project.name}</p>
                  <p className="text-xs text-secondary-text mt-1">{project.code}</p>
                  <p className="text-xs text-secondary-text mt-1">{project.status_display}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-primary-light/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/20 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-dark">Recent Service Requests</h2>
            <Link href="/portal/client/services" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-4 space-y-3 max-h-[24rem] overflow-y-auto">
            {recentServices.length === 0 ? (
              <p className="text-sm text-secondary-text">No service requests yet.</p>
            ) : (
              recentServices.map((service) => (
                <Link
                  key={service.code}
                  href={`/portal/client/services/${service.code}`}
                  className="block rounded-lg border border-border bg-tetiary/80 p-4 hover:bg-primary-light/20 transition-colors"
                >
                  <p className="text-sm font-semibold text-primary-dark">{service.service_name}</p>
                  <p className="text-xs text-secondary-text mt-1">{service.status_display}</p>
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

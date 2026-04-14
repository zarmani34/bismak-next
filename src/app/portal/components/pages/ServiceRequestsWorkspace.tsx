"use client";

import { useMemo, useState } from "react";
import { FaEdit, FaEye, FaFileAlt, FaRegCheckCircle } from "react-icons/fa";
import {
  FaClockRotateLeft,
  FaListCheck,
  FaMagnifyingGlass,
  FaPlus,
} from "react-icons/fa6";
import DashboardStatsCard from "../DashBoardStatsCard";
import ServiceStats from "../ServiceStats";

type ServiceStatus =
  | "pending"
  | "reviewed"
  | "quoted"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed";

type ServiceRequestRow = {
  id: string;
  name: string;
  service_name: string;
  location: string;
  status: ServiceStatus;
  status_display: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
};

const serviceRequests: ServiceRequestRow[] = [
  {
    id: "95d11ef9-6f44-46de-b5a5-5b09005fa38a",
    name: "LPG Plant Recertification",
    service_name: "MITSDO Compliance",
    location: "Apapa, Lagos",
    status: "pending",
    status_display: "Pending",
    owner_name: "MRS Nigeria",
    created_at: "2026-04-01T09:12:00Z",
    updated_at: "2026-04-01T09:12:00Z",
  },
  {
    id: "3e00ea26-6c3b-4d40-8e81-57622d04de3a",
    name: "Tank Farm Risk Assessment",
    service_name: "Site Survey",
    location: "Port Harcourt",
    status: "reviewed",
    status_display: "Reviewed",
    owner_name: "NNPC Retail",
    created_at: "2026-03-28T11:34:00Z",
    updated_at: "2026-04-02T13:20:00Z",
  },
  {
    id: "61f2de98-f983-4fb9-9f3b-f6f5019e9e38",
    name: "Pressure Vessel Verification",
    service_name: "Custom Integrity Test",
    location: "Warri",
    status: "quoted",
    status_display: "Quoted",
    owner_name: "Conoil Plc",
    created_at: "2026-03-25T10:10:00Z",
    updated_at: "2026-04-03T15:48:00Z",
  },
  {
    id: "760c5fa3-d538-4906-abf5-1dbf500f8024",
    name: "Depot Safety Audit",
    service_name: "Safety Audit",
    location: "Ibadan",
    status: "in_progress",
    status_display: "In Progress",
    owner_name: "Matrix Energy",
    created_at: "2026-03-17T08:42:00Z",
    updated_at: "2026-04-04T08:57:00Z",
  },
  {
    id: "44299e58-cd2a-425b-aedb-71a1a1702147",
    name: "Fire Certificate Renewal",
    service_name: "Fire Certificate",
    location: "Lekki",
    status: "completed",
    status_display: "Completed",
    owner_name: "Forte Oil",
    created_at: "2026-03-10T12:24:00Z",
    updated_at: "2026-03-22T16:25:00Z",
  },
];

const statusOptions: Array<{ label: string; value: ServiceStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Quoted", value: "quoted" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

const getServiceStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case "pending":
      return "bg-secondary/20 text-secondary";
    case "reviewed":
    case "quoted":
    case "in_progress":
      return "bg-info/20 text-info";
    case "accepted":
    case "completed":
      return "bg-primary/20 text-primary";
    case "rejected":
      return "bg-error/20 text-error";
    default:
      return "bg-primary-light/20 text-primary-dark";
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ServiceRequestsWorkspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");

  const filteredRequests = useMemo(() => {
    return serviceRequests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" ? true : request.status === statusFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q.length === 0
          ? true
          : request.name.toLowerCase().includes(q) ||
            request.service_name.toLowerCase().includes(q) ||
            request.owner_name.toLowerCase().includes(q) ||
            request.location.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  const requestStats = useMemo(() => {
    const total = serviceRequests.length;
    const pending = serviceRequests.filter(
      (item) => item.status === "pending",
    ).length;
    const active = serviceRequests.filter((item) =>
      ["reviewed", "quoted", "in_progress"].includes(item.status),
    ).length;
    const closed = serviceRequests.filter((item) =>
      ["accepted", "completed", "rejected"].includes(item.status),
    ).length;

    return [
      {
        label: "Total Requests",
        value: String(total),
        icon: <FaFileAlt />,
        color: "primary" as const,
      },
      {
        label: "Pending Review",
        value: String(pending),
        icon: <FaClockRotateLeft />,
        color: "warning" as const,
      },
      {
        label: "Active Pipeline",
        value: String(active),
        icon: <FaListCheck />,
        color: "info" as const,
      },
      {
        label: "Closed Requests",
        value: String(closed),
        icon: <FaRegCheckCircle />,
        color: "primary" as const,
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Service Requests</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Review incoming service requests and keep operations moving from
            intake to execution.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
          <FaPlus className="w-3 h-3" />
          Create Request
        </button>
      </div>

      <ServiceStats />

      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary-light/40 px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <h2 className="text-lg font-semibold text-primary-dark">All Requests</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="relative">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-xs" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by client, name or location"
                className="pl-9 pr-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary min-w-72 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ServiceStatus | "all")
              }
              className="px-3 py-2 rounded-lg border border-border bg-tetiary text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 shadow-md transition duration-200">
          <table className="w-full">
            <thead className="bg-primary-light/40 border-b border-tetiary">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Request
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Client
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Location
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Created
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Updated
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-tetiary hover:bg-primary/20"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-primary-dark">
                      {service.service_name}
                    </p>
                    <p className="text-xs text-secondary-text">{service.name}</p>
                    <p className="text-xs text-secondary-text">
                      #{service.id.slice(0, 8)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                    {service.owner_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                    {service.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceStatusColor(
                        service.status,
                      )}`}
                    >
                      {service.status_display}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                    {formatDate(service.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                    {formatDate(service.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-body-text hover:text-primary-light"
                        aria-label="View request"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-body-text hover:text-primary-light"
                        aria-label="Edit request"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-secondary-text"
                  >
                    No service requests match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ServiceRequest } from "@/schemas/services";
import { useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaEye, FaMagnifyingGlass } from "react-icons/fa6";


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

type ServiceStatus =
  | "pending"
  | "reviewed"
  | "quoted"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed";

const statusOptions: Array<{ label: string; value: ServiceStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Quoted", value: "quoted" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

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


const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  type Props = {
    serviceRequests: ServiceRequest[],
    isLoading: boolean,
    isError: boolean,
    onRetry: () => void,
  } 
export default function ServiceRequestsTable({
  serviceRequests,
  isLoading,
  isError,
  onRetry,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">(
    "all",
  );

  const filteredRequests = useMemo(() => {
      return serviceRequests.filter((request) => {
        const matchesStatus =
          statusFilter === "all" ? true : request.status === statusFilter;
        const q = searchTerm.trim().toLowerCase();
        const matchesSearch =
          q.length === 0
            ? true
            : request.service_name.toLowerCase().includes(q) ||
              request.service_name.toLowerCase().includes(q) ||
              request.owner_name.toLowerCase().includes(q) ||
              request.location.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      });
    }, [searchTerm, statusFilter]);

  return (
    <div className="rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="bg-primary-light/40 px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <h2 className="text-lg font-semibold text-primary-dark">
          All Requests
        </h2>
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
                  <p className="text-xs text-secondary-text">{service.service_name}</p>
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
  );
}

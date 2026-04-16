"use client";

import {
  FaPlus,
} from "react-icons/fa6";
import ServiceStats from "../ServiceStats";
import ServiceRequestsTable from "../tables/ServiceRequestsTable";
import { useServiceRequests } from "@/hooks/useServices";

export default function ServiceRequestsWorkspace() {
  const {
    data: serviceRequests,
    isLoading,
    isError, 
    refetch,
  } = useServiceRequests();
  const serviceRequestList = Array.isArray(serviceRequests)
    ? serviceRequests
    : serviceRequests?.results ?? [];

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

      <ServiceRequestsTable
        serviceRequests={serviceRequestList}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </div>
  );
}

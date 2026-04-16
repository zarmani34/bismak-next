"use client";

import { useState } from "react";
import {
  FaPlus,
} from "react-icons/fa6";
import ServiceStats from "../ServiceStats";
import ServiceRequestsTable from "../tables/ServiceRequestsTable";
import { useServiceRequests, useServiceTypes } from "@/hooks/useServices";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import CreateServiceRequestModal from "../modals/CreateServiceRequestModal";
import CreateServiceTypeModal from "../modals/CreateServiceTypeModal";
import ServiceTypesPanel from "../ServiceTypesPanel";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import SecondaryButton from "@/src/components/buttons/SecondaryButton";

export default function ServiceRequestsWorkspace() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateServiceTypeModal, setShowCreateServiceTypeModal] =
    useState(false);
  const {
    data: serviceRequests,
    isLoading,
    isError, 
    refetch,
  } = useServiceRequests();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const canCreateServiceType = currentUser?.role === "admin";
  const servicesBasePath =
    currentUser?.role === "client" ? "/portal/client/services" : "/portal/admin/services";
  const {
    data: serviceTypes = [],
    isLoading: isServiceTypesLoading,
    isError: isServiceTypesError,
    refetch: refetchServiceTypes,
  } = useServiceTypes({ enabled: canCreateServiceType });
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
       <div className="flex items-center gap-2">
          {canCreateServiceType ? (
            <div onClick={() => setShowCreateServiceTypeModal(true)}>
              <SecondaryButton tittle="Create service type" icon={<FaPlus />} disabled={isCurrentUserLoading} />
            </div>
          ) : null}

          <div
            onClick={() => setShowCreateModal(true)}
          >
            <PrimaryButton tittle="Create service request" icon={<FaPlus />} disabled={isCurrentUserLoading || !currentUser?.role} />
          </div>
        </div>
      </div>

      <ServiceStats />

      <ServiceRequestsTable
        serviceRequests={serviceRequestList}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        basePath={servicesBasePath}
      />

      {canCreateServiceType ? (
        <ServiceTypesPanel
          serviceTypes={serviceTypes}
          isLoading={isServiceTypesLoading}
          isError={isServiceTypesError}
          onRetry={() => refetchServiceTypes()}
        />
      ) : null}
      
      <CreateServiceRequestModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        role={currentUser?.role}
      />

      <CreateServiceTypeModal
        open={showCreateServiceTypeModal}
        onClose={() => setShowCreateServiceTypeModal(false)}
      />
    </div>
  );
}

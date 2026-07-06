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
import { ColumnDef } from "@tanstack/react-table";
import { UserListItem } from "@/schemas/users";

type ServiceRequestsWorkspaceProps = {
  role: "admin" | "client";
};

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    admin: "bg-primary/10 text-primary",
    staff: "bg-secondary/10 text-secondary",
    client: "bg-info/10 text-info",
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colors[role] ?? ""}`}>
      {role}
    </span>
  );
}
 
// Column definitions — each object describes one column
const columns: ColumnDef<UserListItem>[] = [
  {
    accessorKey: "user_id",
    header: "ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ getValue }) => (
      <span className="font-semibold text-primary-dark">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => <RoleBadge role={getValue() as string} />,
  },
  {
    accessorKey: "is_verified",
    header: "Verified",
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="text-success text-xs font-semibold">✓ Yes</span>
      ) : (
        <span className="text-muted text-xs">Pending</span>
      ),
  },
  {
    accessorKey: "date_joined",
    header: "Joined",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      }),
  },
];

export default function ServiceRequestsWorkspace({ role }: ServiceRequestsWorkspaceProps) {
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
    role === "client" ? "/portal/client/services" : "/portal/admin/services";
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
        role={role}
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

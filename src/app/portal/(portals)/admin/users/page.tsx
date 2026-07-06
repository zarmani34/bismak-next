"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import CreateStaffAdminModal from "../../../components/modals/CraeteStaffAdminModal";
import { useUsers } from "@/hooks/useUsers";
import { formatDateTime } from "@/src/utils/date";
import { DataTable } from "@/src/app/portal/components/tables/Datatable";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { UserListItem } from "@/schemas/users";

type RoleTab = "all" | "admin" | "staff" | "client";

const TABS: { key: RoleTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admin" },
  { key: "staff", label: "Staff" },
  { key: "client", label: "Client" },
];

const columns: ColumnDef<UserListItem>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row, getValue }) => (
      <div className="space-y-1">
        <p className="font-medium text-primary-dark">{getValue() as string}</p>
        <p className="text-xs text-secondary-text">{row.original.user_id}</p>
      </div>
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
    cell: ({ getValue }) => {
      const role = getValue() as string;
      const tone =
        role === "admin"
          ? "bg-primary/10 text-primary"
          : role === "staff"
            ? "bg-secondary/10 text-secondary"
            : "bg-info/10 text-info";

      return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "is_verified",
    header: "Verified",
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="text-success text-xs font-semibold">Verified</span>
      ) : (
        <span className="text-secondary-text text-xs">Pending</span>
      ),
  },
  {
    accessorKey: "date_joined",
    header: "Joined",
    cell: ({ getValue }) => (
      <span className="text-xs text-secondary-text">
        {formatDateTime(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "last_login",
    header: "Last login",
    cell: ({ getValue }) => (
      <span className="text-xs text-secondary-text">
        {formatDateTime(getValue() as string)}
      </span>
    ),
  },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading, isError } = useUsers(
    activeTab === "all" ? undefined : { role: activeTab },
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Users</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Manage admin, staff, and client accounts
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center"
        >
          <PrimaryButton tittle="+ Add Staff / Admin" />
        </button>
      </div>

      <div>
        <div className="flex gap-1 overflow-x-auto rounded-tl-xl rounded-tr-xl border-b border-tetiary bg-primary-light/40">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative whitespace-nowrap px-4 py-2.5 text-sm transition-colors sm:text-base ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-secondary-text hover:text-body-text"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
              )}
            </button>
          ))}
        </div>
        <DataTable
          data={users ?? []}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          pageSize={10}
        />
      </div>

      <CreateStaffAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useAllProjects } from "@/hooks/useProjects";
import { ProjectListItem } from "@/schemas/project";
import { SearchBar } from "../../../components/SearchBar";
import { DataTable } from "../../../components/tables/Datatable";
import ProjectStats from "../../../components/ProjectStats";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import CreateProjectModal from "../../../components/modals/CreateProjectModal";

function StatusBadge({ status, display }: { status: string; display: string }) {
  const colors: Record<string, string> = {
    planning: "bg-info/10 text-info",
    in_progress: "bg-primary/10 text-primary",
    on_hold: "bg-warning/10 text-warning",
    completed: "bg-success/10 text-success",
    cancelled: "bg-muted/10 text-muted",
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] ?? "bg-muted/10 text-muted"}`}
    >
      {display}
    </span>
  );
}

const columns: ColumnDef<ProjectListItem>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ getValue }) => (
      <span className="font-semibold text-primary-dark">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        display={row.original.status_display}
      />
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ getValue }) => {
      const val = getValue() as string | null;
      return val ? (
        new Date(val).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      ) : (
        <span className="text-muted">—</span>
      );
    },
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useAllProjects();
  const { data: currentUser } = useCurrentUser();
  const canCreateProject =
    currentUser?.role === "admin" || currentUser?.role === "client";

  return (
    <div className="space-y-8">
      <ProjectStats />
      <div className="">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between
        gap-4 bg-primary-light/40 rounded-t-xl px-5 py-4 border border-primary-light/20"
        >
          <div>
            <h1 className="text-xl font-semibold text-primary-dark">
              All Projects
            </h1>
            <p className="text-xs text-muted mt-0.5">
              {isLoading ? "Loading..." : `${data?.length ?? 0} projects`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Search bar in header */}
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
              className="w-full sm:w-64"
            />
        {canCreateProject ? (
          <button type="button" onClick={() => setShowCreateModal(true)}>
            <PrimaryButton tittle="Create Project" />
          </button>
        ) : null}
          </div>
        </div>

        {/* Table — no toolbar inside, search is external */}
        <DataTable
          data={data ?? []}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          globalFilter={search}
          onGlobalFilterChange={setSearch}
          onRowClick={(row) =>
            router.push(`/portal/admin/projects/${row.code}`)
          }
        />
      </div>
      {canCreateProject ? (
              <CreateProjectModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                role={currentUser?.role}
              />
            ) : null}
    </div>
  );
}

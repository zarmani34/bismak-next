"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDeleteProject, useProject } from "@/hooks/useProjects";
import ErrorState from "../../../../components/states/ErrorState";
import { getStatusColor } from "../../../../constants";
import {
  FaArrowLeft,
  FaBuilding,
  FaCalendarDays,
  FaClipboardList,
  FaLocationDot,
  FaTrash,
  FaUserTie,
} from "react-icons/fa6";

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getProgressValue = (status: string) => {
  switch (status) {
    case "planning":
      return 25;
    case "in_progress":
      return 75;
    case "completed":
      return 100;
    case "on_hold":
      return 50;
    case "cancelled":
      return 0;
    default:
      return 0;
  }
};

function DetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-40 bg-primary/20 rounded" />
      <div className="h-24 bg-primary-light/20 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 bg-primary-light/20 rounded-xl" />
        ))}
      </div>
      <div className="h-40 bg-primary-light/20 rounded-xl" />
    </div>
  );
}

export default function AdminProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params?.code === "string" ? params.code : "";
  const { data: project, isLoading, isError, refetch } = useProject(code);
  const deleteProject = useDeleteProject();

  const handleDelete = async () => {
    if (!code || deleteProject.isPending) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteProject.mutateAsync(code);
      router.push("/portal/admin/projects");
    } catch {
      // handled by React Query
    }
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (isError || !project) {
    return (
      <ErrorState
        message="Unable to load project details."
        onRetry={() => refetch()}
      />
    );
  }

  const progress = getProgressValue(project.status);
  const ownerName =
    typeof project.owner === "string" ? project.owner : project.owner.full_name;
  const leakTest = project.leak_test as any | null;
  const pressureTest = project.pressure_test as any | null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          href="/portal/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/portal/admin/projects/${project.code}/edit`}
            className="px-4 py-2 rounded-xl border border-border text-primary-dark hover:bg-primary-light/10 transition-colors"
          >
            Update Project
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-secondary text-tetiary hover:bg-secondary-dark transition-colors inline-flex items-center gap-2"
          >
            <FaTrash className="w-4 h-4" />
            Delete Project
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-dark">{project.name}</h1>
            <p className="text-secondary-text text-sm">{project.code}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              project.status_display
            )}`}
          >
            {project.status_display}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-secondary-text">
          <FaClipboardList className="w-4 h-4" />
          {project.type || "General Project"}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-primary-light/10 p-4">
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <FaBuilding className="w-4 h-4" />
              Company
            </div>
            <p className="mt-2 text-sm font-medium text-primary-dark">{project.company}</p>
          </div>
          <div className="rounded-xl border border-border bg-primary-light/10 p-4">
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <FaLocationDot className="w-4 h-4" />
              Location
            </div>
            <p className="mt-2 text-sm font-medium text-primary-dark">{project.location}</p>
          </div>
          <div className="rounded-xl border border-border bg-primary-light/10 p-4">
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <FaUserTie className="w-4 h-4" />
              Owner
            </div>
            <p className="mt-2 text-sm font-medium text-primary-dark">{ownerName}</p>
          </div>
          <div className="rounded-xl border border-border bg-primary-light/10 p-4">
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <FaCalendarDays className="w-4 h-4" />
              Due Date
            </div>
            <p className="mt-2 text-sm font-medium text-primary-dark">
              {formatDate(project.due_date)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-primary-dark mb-3">Progress</h2>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-secondary-light/40 rounded-full h-2">
              <div
                className="bg-primary/90 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-body-text">{progress}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-primary-dark mb-3">Description</h2>
          <p className="text-sm text-secondary-text">
            {project.description || "No description provided for this project."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-white/70 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-primary-dark">Assignments</h2>
            {project.assignments?.length ? (
              <span className="text-xs text-secondary-text">{project.assignments.length} items</span>
            ) : null}
          </div>
          {project.assignments?.length ? (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {project.assignments.map((assignment: any) => (
                <div key={assignment.id} className="rounded-lg border border-border p-4">
                  <p className="text-sm font-semibold text-primary-dark">
                    {assignment.assignee?.full_name || "Unassigned"}
                  </p>
                  <p className="text-xs text-secondary-text">
                    {assignment.assignment_role}
                  </p>
                  <p className="text-xs text-secondary-text">
                    Assigned by: {assignment.assigned_by}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary-text">No assignments yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-white/70 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-primary-dark">Timeline</h2>
            {project.events?.length ? (
              <span className="text-xs text-secondary-text">{project.events.length} events</span>
            ) : null}
          </div>
          {project.events?.length ? (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {project.events.map((event: any) => (
                <div key={event.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary-dark">{event.title}</p>
                    <p className="text-xs text-secondary-text">
                      {formatDateTime(event.created_at)}
                    </p>
                  </div>
                  <p className="text-xs text-secondary-text mt-1">{event.description}</p>
                  <p className="text-xs text-secondary-text mt-1">
                    By: {event.created_by?.full_name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary-text">No timeline events yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-primary-dark mb-3">Test Records</h2>
        {!pressureTest && !leakTest ? (
          <p className="text-sm text-secondary-text">
            No test records yet. This project was created but has not been executed.
          </p>
        ) : (
          <div className="space-y-6">
            {leakTest && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-primary-dark">Leak Test</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-secondary-text">
                  <div>Station: {leakTest.station_name}</div>
                  <div>Location: {leakTest.location}</div>
                  <div>Date of Test: {formatDate(leakTest.date_of_test)}</div>
                  <div>Expiry: {formatDate(leakTest.expiring_date)}</div>
                  <div>Equipment: {leakTest.equipment_tested}</div>
                  <div>Result: {leakTest.result_display}</div>
                </div>
                {leakTest.tanks?.length ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs text-secondary-text">
                        <tr>
                          <th className="py-2">Tank No</th>
                          <th className="py-2">Product</th>
                          <th className="py-2">Capacity</th>
                          <th className="py-2">Age</th>
                          <th className="py-2">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leakTest.tanks.map((tank: any) => (
                          <tr key={tank.id} className="border-t">
                            <td className="py-2">{tank.tank_no}</td>
                            <td className="py-2">{tank.product_stored}</td>
                            <td className="py-2">{tank.capacity}</td>
                            <td className="py-2">{tank.age_of_tank}</td>
                            <td className="py-2">{tank.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            )}

            {pressureTest && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-primary-dark">Pressure Test</h3>
                <p className="text-sm text-secondary-text mt-2">
                  Pressure test data is available for this project.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

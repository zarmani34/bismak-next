"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getStatusColor } from "../../constants";
import ProjectsTableSkeleton from "../skeletons/ProjectsTableSkeleton";
import ErrorState from "../states/ErrorState";
import { ProjectListItem } from "@/schemas/project";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import CreateProjectModal from "../modals/CreateProjectModal";

type Props = {
  projects: ProjectListItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  basePath?: string;
};

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

export default function ProjectsTable({
  projects,
  isLoading,
  isError,
  onRetry,
  emptyMessage = "No projects found.",
  basePath = "/portal/admin/projects",
}: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const handleRowClick = (code: string) => {
    router.push(`${basePath}/${code}`);
  };

  const canCreateProject = currentUser?.role !== "staff";


  return (
    <>
      <div className="flex items-center justify-between bg-primary-light/40 rounded-t-xl p-4">
        <h1 className="text-xl font-semibold text-primary-dark">
          All Projects
        </h1>
        {canCreateProject ? (
          <button type="button" onClick={() => setShowCreateModal(true)}>
            <PrimaryButton tittle="Create Project" />
          </button>
        ) : null}
      </div>
      <table className="w-full">
        <thead className="bg-primary-light/40 border-b border-tetiary">
          <tr>
            <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
              Project
            </th>
            <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
              Status
            </th>
            <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
              Location
            </th>
            <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
              Owner
            </th>
            <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
              Progress
            </th>
          </tr>
        </thead>
        {isLoading ? (
          <ProjectsTableSkeleton />
        ) : isError ? (
          <tbody>
            <tr>
              <td colSpan={5} className="p-6">
                <ErrorState
                  message="Unable to load projects."
                  onRetry={onRetry}
                />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {projects.map((project) => {
              const progress = getProgressValue(project.status);
              return (
                <tr
                  key={project.code}
                  className="border-b border-tetiary hover:bg-primary/20 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRowClick(project.code)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleRowClick(project.code);
                    }
                  }}
                  aria-label={`View details for ${project.name}`}
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-primary-dark">
                        {project.name}
                      </p>
                      <p className="text-sm text-secondary-text">
                        Due: {formatDate(project.due_date)}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status_display,
                      )}`}
                    >
                      {project.status_display}
                    </span>
                  </td>
                  <td className="p-4 text-sm sm:text-base text-body-text">
                    {project.location}
                  </td>
                  <td className="p-4 text-sm sm:text-base text-body-text">
                    {project.owner}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-secondary-light/80 rounded-full h-2">
                        <div
                          className="bg-primary/90 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-body-text">
                        {progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!projects.length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-secondary-text">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
      
      {canCreateProject ? (
        <CreateProjectModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      ) : null}
    </>
  );
}

"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AdminProjectStats from "../AdminProjectStats";
import ProjectsTable from "../../../components/tables/ProjectsTable";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import CreateProjectModal from "../../../components/modals/CreateProjectModal";

export default function AdminProjectsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError,
    refetch,
  } = useProjects();
  const projectList = projectsData?.results ?? [];
  const canCreateProject = currentUser?.role === "admin";

  return (
    <div className="space-y-8">
      <AdminProjectStats />

      <div className="">
        <div className="flex items-center justify-between bg-primary-light/40 rounded-t-xl p-4">
          <h1 className="text-xl font-semibold text-primary-dark">All Projects</h1>
          {canCreateProject ? (
            <button type="button" onClick={() => setShowCreateModal(true)}>
              <PrimaryButton tittle="Create Project" />
            </button>
          ) : null}
        </div>

        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
          <ProjectsTable
            projects={projectList}
            isLoading={projectsLoading}
            isError={isError}
            onRetry={() => refetch()}
            basePath="/portal/admin/projects"
          />
        </div>
      </div>

      {canCreateProject ? (
        <CreateProjectModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      ) : null}
    </div>
  );
}

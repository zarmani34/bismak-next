"use client";

import { useProjects } from "@/hooks/useProjects";
import AdminProjectStats from "../AdminProjectStats";
import ProjectsTable from "../../../components/tables/ProjectsTable";

export default function AdminProjectsPage() {
  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError,
    refetch,
  } = useProjects();
  const projectList = projectsData?.results ?? [];

  return (
    <div className="space-y-8">
      <AdminProjectStats />
      <div className="">
        <ProjectsTable
          projects={projectList}
          isLoading={projectsLoading}
          isError={isError}
          onRetry={() => refetch()}
          basePath="/portal/admin/projects"
        />
      </div>
    </div>
  );
}

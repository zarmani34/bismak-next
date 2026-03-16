"use client";

import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "../../../components/tables/ProjectsTable";
import ProjectStats from "../../../components/ProjectStats";

export default function StaffProjectsPage() {
  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError,
    refetch,
  } = useProjects();
  const projectList = projectsData?.results ?? [];

  return (
    <div>
      <ProjectStats />
      <div className="space-y-8">
        <div className="">
          <ProjectsTable
            projects={projectList}
            isLoading={projectsLoading}
            isError={isError}
            onRetry={() => refetch()}
            basePath="/portal/staff/projects"
          />
        </div>
      </div>
    </div>
  );
}

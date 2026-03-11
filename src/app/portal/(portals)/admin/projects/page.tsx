"use client";

import { useProjects } from "@/hooks/useProjects";
import AdminProjectStats from "../AdminProjectStats";
import ProjectsTable from "../../../components/tables/ProjectsTable";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import Link from "next/link";

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
        <div className="flex items-center justify-between bg-primary-light/40 rounded-t-xl p-4">
          <h1 className="text-xl font-semibold text-primary-dark">All Projects</h1>
          <Link href="/portal/admin/projects/new">
            <PrimaryButton tittle="Create Project" />
          </Link>
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
    </div>
  );
}

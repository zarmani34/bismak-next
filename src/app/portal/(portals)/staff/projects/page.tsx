"use client";

import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaTelegram } from "react-icons/fa";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import { staffProjectStats } from "../../../constants";
import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "../../../components/tables/ProjectsTable";
import DashboardWelcome from "@/src/components/DashboardWelcome";

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
      <DashboardWelcome text='Manage and track all your assigned projects.' />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {staffProjectStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="space-y-8">
        <div className="">
          <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
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

    </div>
  );
}

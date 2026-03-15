import DashboardWelcome from "@/src/components/DashboardWelcome";
import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "../../../components/tables/ProjectsTable";

export default function Projects() {
  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError,
    refetch,
  } = useProjects();
  const projectList = projectsData?.results ?? [];

  return (
    <div className="space-y-8">
      <DashboardWelcome text="Track and manage your ongoing projects and services." />

      <div className="">
        <div className="flex items-center justify-between bg-primary-light/40 rounded-t-xl p-4">
          <h1 className="text-xl font-semibold text-primary-dark">
            All Projects
          </h1>
          <div className="flex space-x-3">
            {/* <button className="flex text-primary items-center space-x-2 border border-primary px-4 py-2 rounded-lg hover:bg-tetiary">
              <FaFilter className="w-4 h-4" />
              <span>Filter</span>
            </button> */}
          </div>
        </div>

        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
          <ProjectsTable
            projects={projectList}
            isLoading={projectsLoading}
            isError={isError}
            onRetry={() => refetch()}
            basePath="/portal/client/projects"
          />
        </div>
      </div>
    </div>
  );
}

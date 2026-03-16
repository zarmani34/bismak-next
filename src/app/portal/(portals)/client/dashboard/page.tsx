
import {
  dashboardStats,
  PROJECT_REQUESTS,
  SERVICE_REQUESTS,
} from "../../../constants";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import QuickActions from "../../../components/QuickActions";
import ProjectCard from "../../../components/ProjectCard";
import ViewAll from "@/src/components/buttons/ViewAll";
import ServiceRequestsCard from "../../../components/ServiceRequestsCard";
import DashboardWelcome from "@/src/components/DashboardWelcome";

export default function ClientDashboard() {
  return (
    <div>
      <DashboardWelcome text="Track and manage your ongoing projects and services." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        {dashboardStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
      <QuickActions />
      <div className="space-y-8 mb-4">
        <div className="">
          <div className="flex items-center justify-between my-2">
            <h2 className="text-primary-dark text-xl font-bold">
              Active Projects
            </h2>
            <ViewAll />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {PROJECT_REQUESTS.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div className="">
          <div className="flex items-center justify-between my-2">
            <h2 className="text-primary-dark text-xl font-bold">
              Recent Service Request
            </h2>
            <ViewAll />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {SERVICE_REQUESTS.map((request) => (
              <ServiceRequestsCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

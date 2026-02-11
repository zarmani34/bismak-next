import { FaHardHat } from "react-icons/fa";
import QuickActions from "../../../components/QuickActions";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import { PROJECT_REQUESTS, staffDasboardStats } from "../../../constants";
import ProjectCard from "../../../components/ProjectCard";
import ViewAll from "@/src/components/buttons/ViewAll";

export default function StaffDashboardPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg p-4 rounded-2xl w-full transition-all duration-300">
        <h2 className="text-primary-dark text-2xl font-medium">
          Welcome back, <span className="text-secondary-dark">Bayo</span>
          <p className="text-secondary-text text-base">
            Here's an overview of your activities and updates.
          </p>
        </h2>
        {/* <div>
          <PrimaryButton tittle={"Quick actions"} icon={<FaPlus />} />
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {staffDasboardStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="py-4 flex flex-col md:flex-row gap-6">
        <div className="h-fit bg-linear-to-br from-secondary-dark to-secondary rounded-xl p-4 text-tetiary shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/40 rounded-full flex items-center justify-center">
              <FaHardHat />
            </div>
            <h3 className="font-bold text-lg">Safety First!</h3>
          </div>
          <p className="text-sm my-4 md:my-6">
            Please always wear your PPE and follow safety protocols on site.
          </p>
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
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
    </div>
  );
}

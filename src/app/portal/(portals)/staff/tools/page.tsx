import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaCog, FaPlus } from "react-icons/fa";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import { staffToolsStats } from "../../../constants";

export default function StaffToolsPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg p-4 rounded-2xl w-full transition-all duration-300">
        <h2 className="text-primary-dark text-2xl font-medium">
          Tools and Machines
          <p className="text-secondary-text text-base">
            Track every tools and machine requested for.{" "}
          </p>
        </h2>
        <div>
          <PrimaryButton
            tittle={"Request machine or tools"}
            icon={<FaPlus />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {staffToolsStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}

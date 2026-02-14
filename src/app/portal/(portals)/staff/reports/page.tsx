import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaPlus } from "react-icons/fa";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import { staffReportStats } from "../../../constants";

export default function StaffReportsPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg p-4 rounded-2xl w-full transition-all duration-300">
        <h2 className="text-primary-dark text-2xl font-medium">
          Reports Overview
          <p className="text-secondary-text text-base">
            Create, manage and submit field reports.
          </p>
        </h2>
        <div>
          <PrimaryButton tittle={"Submit Report"} icon={<FaPlus />} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {staffReportStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}

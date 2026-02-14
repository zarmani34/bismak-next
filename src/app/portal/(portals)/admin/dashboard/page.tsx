import { FaChartBar } from "react-icons/fa";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import QuickActions from "../../../components/QuickActions";
import { adminDashboardStats } from "../../../constants";

export default function AdminDashboardPortal() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg p-4 rounded-2xl w-full transition-all duration-300">
        <h2 className="text-primary-dark text-2xl font-medium">
          Welcome back, <span className="text-secondary-dark">Bayo</span>
          <p className="text-secondary-text text-base">
            Here's an overview of today's activities and updates.
          </p>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {adminDashboardStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
      <QuickActions />
      <div className="bg-primary-light/20 p-6  mb-8 rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-[#333333]">
            Project Completion Rate
          </h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-tetiary rounded-lg">
            <div className="text-center">
              <FaChartBar size={48} className="text-[#8a8a8a] mx-auto mb-3" />
              <p className="text-[#8a8a8a]">Chart visualization</p>
              <p className="text-sm text-[#8a8a8a] mt-1">
                Connect analytics library
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center bg-tetiary rounded-lg py-2">
              <p className="text-2xl font-bold text-success">87%</p>
              <p className="text-xs text-[#8a8a8a] mt-1">On Time</p>
            </div>
            <div className="text-center bg-tetiary rounded-lg py-2">
              <p className="text-2xl font-bold text-info">10%</p>
              <p className="text-xs text-[#8a8a8a] mt-1">Delayed</p>
            </div>
            <div className="text-center bg-tetiary rounded-lg py-2">
              <p className="text-2xl font-bold text-error">3%</p>
              <p className="text-xs text-[#8a8a8a] mt-1">Overdue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

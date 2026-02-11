import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaCheckCircle, FaEdit, FaFileAlt, FaPaperPlane, FaPlus } from "react-icons/fa";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";

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
        {[
            { label: 'Total Reports', value: '12', color: 'primary', icon: <FaFileAlt /> },
            { label: 'Drafts', value: '3', color: 'info', icon: <FaEdit /> },
            { label: 'Submitted', value: '5', color: 'warning', icon: <FaPaperPlane /> },
            { label: 'Approved', value: '4', color: 'success', icon: <FaCheckCircle /> }
          ].map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}

import { FaCalendar, FaMapLocationDot } from "react-icons/fa6";
import { getProgressPercentage, getStatusColor } from "../constants";

type Project={
    id: number;
    name: string;
    status: string;
    location: string;
    nextAction: string;
    dueDate: string;
}
export default function ProjectCard({ project }: { project: Project }) {
  const StatusChip = ({ status, size = "md" }: { status: string; size?: string }) => {
    const getStatusColor = (status:string) => {
      switch (status) {
        case "active":
        case "in-progress":
          return "bg-blue-100 text-blue-800";
        case "completed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "planning":
          return "bg-purple-100 text-purple-800";
        case "overdue":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const sizeClasses =
      size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm";

    return (
      <span
        className={`inline-flex items-center rounded-full font-medium ${getStatusColor(
          status
        )} ${sizeClasses}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };
  const percentage = getProgressPercentage(project.status);
  return (
    <div className="bg-primary-light/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary-dark">
          {project.name}
        </h3>
        <span
          className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-body-text mb-4">
        <div className="flex items-center">
          <FaMapLocationDot className="w-4 h-4 mr-2" />
          {project.location}
        </div>
        <div className="flex items-center">
          <FaCalendar className="w-4 h-4 mr-2" />
          Created: {project.dueDate}
        </div>
        <div className="flex items-center">
          <FaCalendar className="w-4 h-4 mr-2" />
          Company: {project.dueDate}
        </div>
        {/* <div className="flex items-center">
          <FaClipboardList className="w-4 h-4 mr-2" />
          {project.nextAction}
        </div> */}
      </div>
      <div className="">
        <div className="flex justify-between text-sm text-body-text mb-1">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-secondary-light/80 rounded-full h-4">
          <div
            className="bg-primary/90 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      {/* <div className="flex space-x-2 text-tetiary">
      <button className="flex-1 bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
        View Details
      </button>
      <button className="px-4 py-2 text-primary text-lg border-2 border-primary rounded-lg font-medium bg-tetiary/40 transition-colors ">
        <FaEye />
      </button>
    </div> */}
    </div>
  );
}
import {
  FaBuilding,
  FaCalendarDays,
  FaLocationDot,
  FaUserTie,
} from "react-icons/fa6";
import { formatDate } from "@/src/utils/date";

type ProjectBasicInfoCardProps = {
  company: string;
  location: string;
  ownerName: string;
  dueDate?: string | null;
};

export default function ProjectBasicInfoCard({
  company,
  location,
  ownerName,
  dueDate,
}: ProjectBasicInfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-primary-light/20 p-6">
      <h2 className="text-lg font-semibold text-primary-dark mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-tetiary/80 p-4">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <FaBuilding className="w-4 h-4" />
            Company
          </div>
          <p className="mt-2 text-sm font-medium text-primary-dark">{company}</p>
        </div>
        <div className="rounded-xl border border-border bg-tetiary/80 p-4">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <FaLocationDot className="w-4 h-4" />
            Location
          </div>
          <p className="mt-2 text-sm font-medium text-primary-dark">{location}</p>
        </div>
        <div className="rounded-xl border border-border bg-tetiary/80 p-4">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <FaUserTie className="w-4 h-4" />
            Owner
          </div>
          <p className="mt-2 text-sm font-medium text-primary-dark">{ownerName}</p>
        </div>
        <div className="rounded-xl border border-border bg-tetiary/80 p-4">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <FaCalendarDays className="w-4 h-4" />
            Due Date
          </div>
          <p className="mt-2 text-sm font-medium text-primary-dark">{formatDate(dueDate)}</p>
        </div>
      </div>
    </div>
  );
}

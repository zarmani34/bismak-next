import { FaClipboardList } from "react-icons/fa6";
import { getStatusColor } from "../../constants";

type ProjectDetailHeaderProps = {
  name: string;
  code: string;
  statusDisplay: string;
  typeLabel?: string | null;
};

export default function ProjectDetailHeader({
  name,
  code,
  statusDisplay,
  typeLabel,
}: ProjectDetailHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-primary-light/20 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">{name}</h1>
          <p className="text-secondary-text text-sm">{code}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(statusDisplay)}`}>
          {statusDisplay}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-secondary-text">
        <FaClipboardList className="w-4 h-4" />
        {typeLabel || name}
      </div>
    </div>
  );
}

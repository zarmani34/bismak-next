import { FaClipboardList } from "react-icons/fa6";
import { getPriorityColor, getStatusColor } from "../constants";

type Service={
  id: number;
    type: string;
    client: string;
    priority: string;
    status: string;
    created: string;
    description: string;
    nextAction: string;
}
export default function ServiceRequestsCard({ request }: { request: Service }) {
    return <div className="bg-primary-light/20 rounded-xl shadow-md hover:shadow-lg p-6 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-semibold text-header-color mb-1">{request.type}</h3>
        <p className="text-sm text-secondary-text">{request.client}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            request.priority
          )}`}
        >
          {request.priority}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            request.status
          )}`}
        >
          {request.status}
        </span>
      </div>
    </div>

    <p className="text-sm text-primary-dark mb-4">{request.description}</p>

    <div className="flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center">
          <FaClipboardList className="w-4 h-4 mr-2" />
          {request.nextAction}
        </div>
      <span>Created: {new Date(request.created).toLocaleDateString()}</span>
    </div>
  </div>
}
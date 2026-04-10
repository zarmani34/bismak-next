"use client";

import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

type ServiceRequestRow = {
  id: number | string;
  type: string;
  status: string;
  created: string;
  priority: string;
};

type ServiceRequestsTableProps = {
  requests: ServiceRequestRow[];
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
};

export default function ServiceRequestsTable({
  requests,
  getStatusColor,
  getPriorityColor,
}: ServiceRequestsTableProps) {
  return (
    <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
      <table className="w-full">
        <thead className="bg-primary-light/40">
          <tr>
            <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
              Service Type
            </th>
            <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
              Status
            </th>
            <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
              Created
            </th>
            <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
              Priority
            </th>
            <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((service) => (
            <tr
              key={service.id}
              className="border-b border-tetiary hover:bg-primary/20"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-primary-dark">
                  {service.type}
                </div>
                <div className="text-xs text-gray-500">
                  #{service.id.toString().padStart(4, "0")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    service.status,
                  )}`}
                >
                  {service.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">
                {service.created}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    service.priority,
                  )}`}
                >
                  {service.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="p-2 text-body-text hover:text-primary-light">
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-body-text hover:text-primary-light">
                    <FaEdit className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


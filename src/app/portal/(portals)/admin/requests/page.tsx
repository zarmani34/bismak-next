import { FaEdit, FaEye } from "react-icons/fa";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import { adminRequestStats, getPriorityColor, getStatusColor, SERVICE_REQUESTS } from "../../../constants";

export default function AdminRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {adminRequestStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-primary-dark">
                  All Requests
                </h2>
              </div>
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
                  <tbody className="">
                    {SERVICE_REQUESTS.map((service) => (
                      <tr className="border-b border-tetiary hover:bg-primary/20">
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
                              service.status
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
                              service.priority
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
            </div>
    </div>
  );
}

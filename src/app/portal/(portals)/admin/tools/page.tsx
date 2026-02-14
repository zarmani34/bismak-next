import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaDownload, FaEye, FaWrench } from "react-icons/fa";
import { FaClock, FaScrewdriverWrench, FaToolbox, FaTriangleExclamation } from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";

const toolStats = [
  {
    label: "Total Assets",
    value: "146",
    icon: <FaToolbox />,
    color: "primary" as const,
  },
  {
    label: "In Use",
    value: "38",
    icon: <FaScrewdriverWrench />,
    color: "info" as const,
  },
  {
    label: "Under Maintenance",
    value: "9",
    icon: <FaWrench />,
    color: "warning" as const,
  },
  {
    label: "Overdue Return",
    value: "4",
    icon: <FaTriangleExclamation />,
    color: "error" as const,
  },
];

const toolRows = [
  {
    id: "AST-2201",
    name: "Hydraulic Pressure Tester",
    category: "Machine",
    assignedTo: "Projects Team B",
    location: "Yard A",
    nextService: "2026-03-02",
    status: "In use",
  },
  {
    id: "AST-2202",
    name: "Gas Leak Detector",
    category: "Tool",
    assignedTo: "Compliance Unit",
    location: "Main Store",
    nextService: "2026-02-20",
    status: "Available",
  },
  {
    id: "AST-2203",
    name: "Welding Machine - WM4",
    category: "Machine",
    assignedTo: "Maintenance Team",
    location: "Workshop",
    nextService: "2026-02-16",
    status: "Maintenance",
  },
  {
    id: "AST-2204",
    name: "Ultrasonic Thickness Gauge",
    category: "Tool",
    assignedTo: "Projects Team A",
    location: "Site Bay 3",
    nextService: "2026-02-25",
    status: "In use",
  },
];

const maintenanceQueue = [
  {
    asset: "Welding Machine - WM4",
    type: "Calibration",
    dueDate: "2026-02-16",
  },
  {
    asset: "Hydraulic Jack - HJ9",
    type: "Parts Replacement",
    dueDate: "2026-02-18",
  },
  {
    asset: "Compressor Unit - C12",
    type: "Routine Service",
    dueDate: "2026-02-21",
  },
];

const getToolStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-primary/20 text-primary";
    case "in use":
      return "bg-info/40 text-info";
    case "maintenance":
      return "bg-secondary/20 text-secondary";
    default:
      return "bg-error/30 text-error";
  }
};

export default function AdminToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Tools & Machines</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Monitor asset availability, assignments, and maintenance schedules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-primary-dark text-sm hover:bg-primary-light/20 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Register
          </button>
          <PrimaryButton tittle={"Register Asset"} icon={<FaScrewdriverWrench />} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {toolStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary-dark">Asset Register</h2>
          </div>

          <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
            <table className="w-full">
              <thead className="bg-primary-light/40 border-b border-tetiary">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Location
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Next Service
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {toolRows.map((item) => (
                  <tr key={item.id} className="border-b border-tetiary hover:bg-primary/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-primary-dark">{item.name}</p>
                      <p className="text-xs text-secondary-text">{item.id}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{item.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{item.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{item.nextService}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getToolStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-2 text-body-text hover:text-primary-light">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-body-text hover:text-primary-light">
                          <FaWrench className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary-dark">Maintenance Queue</h2>
          </div>

          <div className="p-4 bg-primary-light/10 space-y-3">
            {maintenanceQueue.map((task) => (
              <div
                key={task.asset}
                className="rounded-lg border border-primary-light/30 p-4 bg-white/60 hover:bg-primary-light/20 transition-colors"
              >
                <p className="text-sm font-semibold text-primary-dark">{task.asset}</p>
                <p className="text-sm text-body-text">{task.type}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-secondary-text">
                  <FaClock className="w-3 h-3" />
                  Due {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

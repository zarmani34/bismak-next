import { FaChartBar, FaChartLine, FaClock, FaDownload, FaUsers } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp, FaCheck, FaCircleExclamation, FaFileInvoiceDollar, FaFolderOpen } from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";

const overviewStats = [
  {
    label: "Active Projects",
    value: "27",
    icon: <FaFolderOpen />,
    color: "primary" as const,
  },
  {
    label: "Open Service Requests",
    value: "14",
    icon: <FaClock />,
    color: "warning" as const,
  },
  {
    label: "Active Clients",
    value: "54",
    icon: <FaUsers />,
    color: "info" as const,
  },
  {
    label: "Monthly Revenue",
    value: "NGN 45M",
    icon: <FaFileInvoiceDollar />,
    color: "primary" as const,
  },
];

const kpiCards = [
  {
    label: "Project Delivery Rate",
    value: "87%",
    trend: "+3.2% vs last month",
    trendUp: true,
  },
  {
    label: "Invoice Collection Rate",
    value: "92%",
    trend: "+1.4% vs last month",
    trendUp: true,
  },
  {
    label: "Client Satisfaction",
    value: "4.6 / 5",
    trend: "-0.2 vs last month",
    trendUp: false,
  },
  {
    label: "Compliance Health",
    value: "96%",
    trend: "+2.0% vs last month",
    trendUp: true,
  },
];

const departmentPerformance = [
  {
    name: "Projects",
    metric: "On-time completion",
    value: "89%",
    status: "Strong",
  },
  {
    name: "Operations",
    metric: "Request turnaround",
    value: "2.1 days",
    status: "Stable",
  },
  {
    name: "Finance",
    metric: "Outstanding invoices",
    value: "17",
    status: "Needs attention",
  },
  {
    name: "Compliance",
    metric: "Certificate validity",
    value: "96%",
    status: "Strong",
  },
];

const executiveHighlights = [
  {
    title: "Growth Signal",
    detail: "Revenue is trending upward for the third consecutive month.",
    icon: <FaArrowTrendUp className="w-4 h-4 text-primary" />,
  },
  {
    title: "Risk Area",
    detail: "17 invoices remain unpaid beyond standard payment window.",
    icon: <FaCircleExclamation className="w-4 h-4 text-error" />,
  },
  {
    title: "Operational Note",
    detail: "Service request turnaround improved from 2.8 to 2.1 days.",
    icon: <FaCheck className="w-4 h-4 text-primary" />,
  },
];

const getDepartmentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "strong":
      return "bg-primary/20 text-primary";
    case "stable":
      return "bg-info/40 text-info";
    case "needs attention":
      return "bg-error/30 text-error";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Reports & Analytics</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Company-wide performance overview across projects, finance, operations, and compliance.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm hover:bg-primary-dark transition-colors">
          <FaDownload className="w-4 h-4" />
          Export Executive Summary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {overviewStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-primary-light/20 rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-primary-dark">Company Performance Trend</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-tetiary rounded-lg">
              <div className="text-center">
                <FaChartLine size={44} className="text-[#8a8a8a] mx-auto mb-3" />
                <p className="text-[#8a8a8a]">Company analytics trend chart</p>
                <p className="text-sm text-[#8a8a8a] mt-1">Connect chart library for live performance data</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="bg-tetiary rounded-lg p-3">
                  <p className="text-xs text-secondary-text">{kpi.label}</p>
                  <p className="text-lg font-bold text-primary-dark">{kpi.value}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    {kpi.trendUp ? (
                      <FaArrowTrendUp className="text-primary w-3 h-3" />
                    ) : (
                      <FaArrowTrendDown className="text-error w-3 h-3" />
                    )}
                    <span className={kpi.trendUp ? "text-primary" : "text-error"}>{kpi.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary-dark">Executive Highlights</h2>
          </div>
          <div className="p-4 bg-primary-light/10 space-y-3">
            {executiveHighlights.map((item) => (
              <div key={item.title} className="rounded-lg border border-primary-light/30 p-4 bg-white/70">
                <div className="flex items-center gap-2 mb-1">
                  {item.icon}
                  <p className="text-sm font-semibold text-primary-dark">{item.title}</p>
                </div>
                <p className="text-sm text-body-text">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <FaChartBar className="w-4 h-4 text-primary-dark" />
          <h2 className="text-lg font-semibold text-primary-dark">Department Performance Snapshot</h2>
        </div>

        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
          <table className="w-full">
            <thead className="bg-primary-light/40 border-b border-tetiary">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Department
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Key Metric
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Current Value
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Health
                </th>
              </tr>
            </thead>
            <tbody>
              {departmentPerformance.map((row) => (
                <tr key={row.name} className="border-b border-tetiary hover:bg-primary/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">{row.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{row.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{row.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentStatusColor(row.status)}`}>
                      {row.status}
                    </span>
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

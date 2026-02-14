import { FaDownload, FaEye, FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import { FaClockRotateLeft, FaTriangleExclamation } from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";
import { getStatusColor } from "../../../constants";

const billingStats = [
  {
    label: "Total Invoices",
    value: "128",
    icon: <FaFileInvoiceDollar />,
    color: "primary" as const,
  },
  {
    label: "Paid This Month",
    value: "NGN 9.8M",
    icon: <FaMoneyBillWave />,
    color: "info" as const,
  },
  {
    label: "Pending Payment",
    value: "NGN 2.4M",
    icon: <FaClockRotateLeft />,
    color: "warning" as const,
  },
  {
    label: "Overdue",
    value: "17",
    icon: <FaTriangleExclamation />,
    color: "error" as const,
  },
];

const invoiceRows = [
  {
    id: "INV-2026-1001",
    client: "MRS Nigeria",
    amount: "NGN 1,250,000",
    dueDate: "2026-02-18",
    issuedDate: "2026-02-02",
    status: "Pending",
  },
  {
    id: "INV-2026-0999",
    client: "NNPC Limited",
    amount: "NGN 890,000",
    dueDate: "2026-02-10",
    issuedDate: "2026-01-27",
    status: "Completed",
  },
  {
    id: "INV-2026-0988",
    client: "Conoil Plc",
    amount: "NGN 620,000",
    dueDate: "2026-01-28",
    issuedDate: "2026-01-08",
    status: "In progress",
  },
  {
    id: "INV-2026-0977",
    client: "Seplat Energy",
    amount: "NGN 1,540,000",
    dueDate: "2026-01-22",
    issuedDate: "2026-01-02",
    status: "Pending",
  },
];

export default function AdminBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Billing & Invoices</h1>
        <p className="text-secondary-text text-sm sm:text-base">
          Track payments, monitor overdue balances, and review invoice activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {billingStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary-dark">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
          <table className="w-full">
            <thead className="bg-primary-light/40 border-b border-tetiary">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Client
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Amount
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Issued
                </th>
                <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  Due Date
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
              {invoiceRows.map((invoice) => (
                <tr key={invoice.id} className="border-b border-tetiary hover:bg-primary/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{invoice.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{invoice.issuedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{invoice.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="p-2 text-body-text hover:text-primary-light">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-body-text hover:text-primary-light">
                        <FaDownload className="w-4 h-4" />
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

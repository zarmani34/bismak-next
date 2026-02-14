import { FaDownload, FaEye, FaPaperPlane, FaPlus, FaTrash } from "react-icons/fa";
import { FaFileCirclePlus, FaFloppyDisk } from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";

const invoiceGeneratorStats = [
  {
    label: "Draft Invoices",
    value: "14",
    icon: <FaFileCirclePlus />,
    color: "warning" as const,
  },
  {
    label: "Sent Today",
    value: "6",
    icon: <FaPaperPlane />,
    color: "info" as const,
  },
  {
    label: "Generated This Month",
    value: "63",
    icon: <FaEye />,
    color: "primary" as const,
  },
  {
    label: "Archived",
    value: "89",
    icon: <FaTrash />,
    color: "primary" as const,
  },
];

const draftInvoices = [
  {
    id: "DRAFT-2301",
    client: "MRS Nigeria",
    project: "Pipeline Integrity Audit",
    total: "NGN 1,250,000",
    lastUpdated: "2026-02-13",
  },
  {
    id: "DRAFT-2302",
    client: "Seplat Energy",
    project: "Tank Calibration",
    total: "NGN 860,000",
    lastUpdated: "2026-02-11",
  },
  {
    id: "DRAFT-2303",
    client: "NNPC Limited",
    project: "MITSDO Certification",
    total: "NGN 1,540,000",
    lastUpdated: "2026-02-10",
  },
];

const lineItems = [
  {
    service: "MITSDO Compliance Inspection",
    quantity: 1,
    rate: "NGN 900,000",
    amount: "NGN 900,000",
  },
  {
    service: "Site Risk Assessment",
    quantity: 1,
    rate: "NGN 250,000",
    amount: "NGN 250,000",
  },
  {
    service: "Final Technical Report",
    quantity: 1,
    rate: "NGN 100,000",
    amount: "NGN 100,000",
  },
];

export default function AdminInvoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Invoice Generator</h1>
        <p className="text-secondary-text text-sm sm:text-base">
          Build invoice drafts with project line items, taxes, and client-ready totals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {invoiceGeneratorStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-dark">Create Invoice</h2>
            <div className="flex items-center gap-2">
              <button className="bg-white text-primary-dark text-sm px-4 py-2 rounded-lg border border-border hover:bg-primary-light/20 transition-colors inline-flex items-center gap-2">
                <FaFloppyDisk className="w-4 h-4" />
                Save Draft
              </button>
              <button className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2">
                <FaPaperPlane className="w-4 h-4" />
                Send Invoice
              </button>
            </div>
          </div>

          <div className="p-6 bg-primary-light/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-primary-dark font-medium">Invoice Number</label>
                <input
                  value="INV-2026-1032"
                  readOnly
                  className="w-full rounded-lg border border-border px-4 py-3 bg-white/70 text-body-text text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-primary-dark font-medium">Client Name</label>
                <input
                  value="MRS Nigeria"
                  readOnly
                  className="w-full rounded-lg border border-border px-4 py-3 bg-white/70 text-body-text text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-primary-dark font-medium">Issue Date</label>
                <input
                  value="2026-02-14"
                  readOnly
                  className="w-full rounded-lg border border-border px-4 py-3 bg-white/70 text-body-text text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-primary-dark font-medium">Due Date</label>
                <input
                  value="2026-02-28"
                  readOnly
                  className="w-full rounded-lg border border-border px-4 py-3 bg-white/70 text-body-text text-sm"
                />
              </div>
            </div>

            <div className="rounded-xl border border-primary-light/30 overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary-light/40 border-b border-tetiary">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                      Service
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.service} className="border-b border-tetiary hover:bg-primary/20">
                      <td className="p-4 text-sm text-primary-dark font-medium">{item.service}</td>
                      <td className="p-4 text-sm text-body-text">{item.quantity}</td>
                      <td className="p-4 text-sm text-body-text">{item.rate}</td>
                      <td className="p-4 text-sm text-body-text">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="inline-flex items-center gap-2 text-sm text-primary-dark px-4 py-2 border border-border rounded-lg hover:bg-primary-light/20 transition-colors">
              <FaPlus className="w-3 h-3" />
              Add Line Item
            </button>

            <div className="rounded-lg border border-border p-4 bg-white/70">
              <p className="text-sm text-primary-dark font-medium mb-1">Internal Note</p>
              <p className="text-sm text-body-text">
                Include signed service completion sheet before dispatching this invoice.
              </p>
            </div>

            <div className="flex flex-col items-end space-y-2 text-sm">
              <div className="flex w-full max-w-sm justify-between text-body-text">
                <span>Subtotal</span>
                <span>NGN 1,250,000</span>
              </div>
              <div className="flex w-full max-w-sm justify-between text-body-text">
                <span>VAT (7.5%)</span>
                <span>NGN 93,750</span>
              </div>
              <div className="flex w-full max-w-sm justify-between text-lg font-semibold text-primary-dark pt-2 border-t border-border">
                <span>Total</span>
                <span>NGN 1,343,750</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary-dark">Recent Drafts</h2>
          </div>

          <div className="p-4 bg-primary-light/10 space-y-3">
            {draftInvoices.map((draft) => (
              <div
                key={draft.id}
                className="rounded-lg border border-primary-light/30 p-4 bg-white/60 hover:bg-primary-light/20 transition-colors"
              >
                <p className="text-sm font-semibold text-primary-dark">{draft.id}</p>
                <p className="text-sm text-body-text">{draft.client}</p>
                <p className="text-xs text-secondary-text">{draft.project}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-secondary-text">
                  <span>{draft.lastUpdated}</span>
                  <span className="text-primary-dark font-medium">{draft.total}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="text-xs px-3 py-1 rounded-md border border-border hover:bg-primary-light/20 text-primary-dark inline-flex items-center gap-1">
                    <FaEye className="w-3 h-3" />
                    Open
                  </button>
                  <button className="text-xs px-3 py-1 rounded-md border border-border hover:bg-primary-light/20 text-primary-dark inline-flex items-center gap-1">
                    <FaDownload className="w-3 h-3" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaDownload, FaEye } from "react-icons/fa";
import { FaClock, FaFileCircleCheck, FaFileCircleXmark, FaUpload } from "react-icons/fa6";
import DashboardStatsCard from "../../../components/DashBoardStatsCard";

const documentStats = [
  {
    label: "Total Documents",
    value: "248",
    icon: <FaFileCircleCheck />,
    color: "primary" as const,
  },
  {
    label: "Valid Certificates",
    value: "192",
    icon: <FaFileCircleCheck />,
    color: "info" as const,
  },
  {
    label: "Expiring Soon",
    value: "21",
    icon: <FaClock />,
    color: "warning" as const,
  },
  {
    label: "Expired",
    value: "8",
    icon: <FaFileCircleXmark />,
    color: "error" as const,
  },
];

const documentRows = [
  {
    id: "DOC-1031",
    title: "MITSDO Safety Compliance",
    client: "MRS Nigeria",
    type: "Certificate",
    issuedDate: "2025-12-20",
    expiryDate: "2026-12-20",
    status: "Valid",
  },
  {
    id: "DOC-1032",
    title: "Tank Calibration Report",
    client: "NNPC Limited",
    type: "Report",
    issuedDate: "2026-01-14",
    expiryDate: "2026-08-14",
    status: "Valid",
  },
  {
    id: "DOC-1033",
    title: "Fire Safety Clearance",
    client: "Seplat Energy",
    type: "Certificate",
    issuedDate: "2025-03-09",
    expiryDate: "2026-03-09",
    status: "Expiring",
  },
  {
    id: "DOC-1034",
    title: "Environmental Impact Assessment",
    client: "Conoil Plc",
    type: "Report",
    issuedDate: "2024-11-02",
    expiryDate: "2025-11-02",
    status: "Expired",
  },
];

const expiringCertificates = [
  {
    certificate: "Fire Safety Clearance",
    client: "Seplat Energy",
    daysLeft: "23 days",
  },
  {
    certificate: "Pressure Vessel Fitness",
    client: "MRS Nigeria",
    daysLeft: "17 days",
  },
  {
    certificate: "Pipeline Integrity Permit",
    client: "NNPC Limited",
    daysLeft: "9 days",
  },
];

const getDocumentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "valid":
      return "bg-primary/20 text-primary";
    case "expiring":
      return "bg-secondary/20 text-secondary";
    case "expired":
      return "bg-error/30 text-error";
    default:
      return "bg-info/40 text-info";
  }
};

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Documents & Certificates</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Manage uploaded files, issued certificates, and expiration timelines.
          </p>
        </div>
        <PrimaryButton tittle={"Upload Document"} icon={<FaUpload />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {documentStats.map((stat) => (
          <DashboardStatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary-dark">Document Register</h2>
          </div>

          <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
            <table className="w-full">
              <thead className="bg-primary-light/40 border-b border-tetiary">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Document
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Client
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Type
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Issued
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider">
                    Expiry
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
                {documentRows.map((document) => (
                  <tr key={document.id} className="border-b border-tetiary hover:bg-primary/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-primary-dark">{document.title}</p>
                      <p className="text-xs text-secondary-text">{document.id}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{document.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{document.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{document.issuedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-body-text">{document.expiryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(document.status)}`}
                      >
                        {document.status}
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

        <div className="rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary-dark">Expiring Certificates</h2>
          </div>

          <div className="p-4 bg-primary-light/10 space-y-3">
            {expiringCertificates.map((item) => (
              <div
                key={item.certificate}
                className="rounded-lg border border-primary-light/30 p-4 bg-white/60 hover:bg-primary-light/20 transition-colors"
              >
                <p className="text-sm font-semibold text-primary-dark">{item.certificate}</p>
                <p className="text-sm text-body-text">{item.client}</p>
                <p className="text-xs text-secondary-text mt-1">Expires in {item.daysLeft}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

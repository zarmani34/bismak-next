import { ReactNode } from "react";
import { FaChartLine, FaCog, FaFileInvoiceDollar, FaProjectDiagram, FaRegClipboard, FaRegWindowMaximize } from "react-icons/fa";
import { FaBriefcase, FaClipboardCheck, FaCreditCard, FaFile, FaFileContract } from "react-icons/fa6";

export const currentUser = {
  name: "Bayo Ismail",
  role: "client", // client, staff, admin
  avatar: "/api/placeholder/40/40",
  company: "TechCorp Industries",
};

type Stat ={
        label: string;
      value: string;
      icon: ReactNode;
      color: "primary" | "error" | "warning" | "info";
}

type Project={
  id: number;
    name: string;
    status: string;
    location: string;
    nextAction: string;
    dueDate: string;
}

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

export const CLIENTPORTALMENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <FaRegWindowMaximize className="w-5 h-5" />, // grid/dashboard
  },
  {
    key: "projects",
    label: "Projects",
    icon: <FaProjectDiagram className="w-5 h-5" />, // project flows
  },
  {
    key: "requests",
    label: "Service Requests",
    icon: <FaRegClipboard className="w-5 h-5" />, // request form
  },
  {
    key: "billing",
    label: "Billing & Invoices",
    icon: <FaFileInvoiceDollar className="w-5 h-5" />, // billing
  },
  {
    key: "documents",
    label: "Documents & Certificates",
    icon: <FaFileContract className="w-5 h-5" />, // documents/certs
  },

  {
    key: "profile",
    label: "Profile",
    icon: <FaCog className="w-5 h-5" />, // settings
  },
];
export const STAFFPORTALMENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <FaRegWindowMaximize className="w-5 h-5" />, // grid/dashboard   
  },
  {
    key: "projects",
    label: "Projects",
    icon: <FaProjectDiagram className="w-5 h-5" />, // project flows
  },
  {
    key: "reports",
    label: "Reports",
    icon: <FaChartLine className="w-5 h-5" />, // analytics
  },
  // {
  //   key: "loan",
  //   label: "Loan Requests",
  //   icon: <FaRegClipboard className="w-5 h-5" />, // request form
  // },
  {
    key: "profile",
    label: "Profile",
    icon: <FaCog className="w-5 h-5" />, // settings    
  },
];
export const ADMINPORTALMENU = [{
    key: "dashboard",
    label: "Dashboard",
    icon: <FaRegWindowMaximize className="w-5 h-5" />, // grid/dashboard
  },
  {
    key: "projects",
    label: "Projects",
    icon: <FaProjectDiagram className="w-5 h-5" />, // project flows
  },
  {
    key: "requests",
    label: "Service Requests",
    icon: <FaRegClipboard className="w-5 h-5" />, // request form
  },
  {
    key: "billing",
    label: "Billing & Invoices",
    icon: <FaFileInvoiceDollar className="w-5 h-5" />, // billing
  },
  {
    key: "documents",
    label: "Documents & Certificates",
    icon: <FaFileContract className="w-5 h-5" />, // documents/certs
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    icon: <FaChartLine className="w-5 h-5" />, // analytics
  },
  {
    key: "profile",
    label: "Profile",
    icon: <FaCog className="w-5 h-5" />, // settings
},]

export const dashboardStats: Stat[] = [
  {
    label: "Active Projects",
    value: "24",
    icon: <FaBriefcase />,
    color: "primary",
  },
  { label: "Open Requests", value: "8", icon: <FaFile />, color: "warning" },
  {
    label: "Overdue Invoices",
    value: "3",
    icon: <FaCreditCard />,
    color: "error",
  },
  {
    label: "Next Inspection",
    value: "5 days",
    icon: <FaClipboardCheck />,
    color: "info",
  },
];

export const PROJECT_REQUESTS:Project[] = [
  {
    id: 1,
    name: "Pressure Test",
    status: "in progress",
    location: "Lagos, Nigeria",
    nextAction: "Safety Inspection",
    dueDate: "2025-09-15",
  },
  {
    id: 2,
    name: "Tank calibration",
    status: "Completed",
    location: "Port Harcourt",
    nextAction: "Environmental Assessment",
    dueDate: "2025-09-22",
  },
  {
    id: 3,
    name: "Pressure test",
    status: "planning",
    location: "Warri",
    nextAction: "Final Report",
    dueDate: "2025-08-30",
  },
  {
    id: 4,
    name: "Pressure Test",
    status: "in progress",
    location: "Lagos, Nigeria",
    nextAction: "Safety Inspection",
    dueDate: "2025-09-15",
  },
  {
    id: 5,
    name: "Tank calibration",
    status: "Completed",
    location: "Port Harcourt",
    nextAction: "Environmental Assessment",
    dueDate: "2025-09-22",
  },
  {
    id: 6,
    name: "Pressure test",
    status: "planning",
    location: "Warri",
    nextAction: "Final Report",
    dueDate: "2025-08-30",
  },
];

export const SERVICE_REQUESTS:Service[] = [
  {
    id: 1,
    type: "MITSDO",
    client: "MRS Nigeria",
    priority: "High",
    status: "Pending",
    created: "2025-08-28",
    description: "Quarterly safety audit for offshore platform",
    nextAction: "Next action to be carried out",
  },
  {
    id: 2,
    type: "Environmental Assessment",
    client: "NNPC Limited",
    priority: "Medium",
    status: "In progress",
    created: "2025-08-26",
    description: "Environmental impact assessment for new drilling site",
    nextAction: "Next action to be carried out",
  },
  {
    id: 3,
    type: "Fire certificate",
    client: "NNPC Limited",
    priority: "Medium",
    status: "In progress",
    created: "2025-08-26",
    description: "Environmental impact assessment for new drilling site",
    nextAction: "Next action to be carried out",
  },
];

export const getProgressPercentage = (status:string) => {
  switch (status.toLowerCase()) {
    case "planning":
      return "25";
    case "pending":
      return "50";
    case "in progress":
      return "75";
    case "completed":
      return "100";
    default:
      return "0";
  }
};

export const getStatusColor = (status:string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-primary/20 text-primary";
    case "in progress":
      return "bg-secondary-light/40 text-primary";
    case "pending":
      return "bg-secondary/20 text-secondary";
    default:
      return "bg-info/40 text-info";
  }
};

export const getPriorityColor = (priority:string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-error/40 text-error";
    case "medium":
      return "bg-info/40 text-info";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
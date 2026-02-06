import { ReactNode } from "react";

type stat ={
    label: string;
  value: string;
  icon: ReactNode;
  color: "primary" | "error" | "warning" | "info";
}
export default function DashboardStatsCard({stat}:{stat:stat}) {
    return (<div className="bg-primary-light/20 rounded-xl shadow-sm  p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-primary-dark mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-primary">{stat.value}</p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            stat.color === "primary"
              ? "bg-primary/30"
              : stat.color === "warning"
              ? "bg-warning/20"
              : stat.color === "error"
              ? "bg-error/30"
              : "bg-info/30"
          }`}
        >
          <div className={`text-lg md:text-2                                                                                                                                                                                                              xl  flex items-center justify-center ${
              stat.color === "primary"
                ? "text-success"
                : stat.color === "warning"
                ? "text-warning"
                : stat.color === "error"
                ? "text-error"
                : "text-info"
            }`}>{stat.icon}</div>
        </div>
      </div>
    </div>);   
}
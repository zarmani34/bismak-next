"use client"

import { useServiceStats } from "@/hooks/useServices";
import { ReactNode } from "react";
import { FaProjectDiagram } from "react-icons/fa";
import StatsCardsSkeleton from "./skeletons/StatsCardsSkeleton";
import DashboardStatsCard from "./DashBoardStatsCard";
import ErrorState from "./states/ErrorState";


type Stat = {
  label: string;
  value: string;
  icon: ReactNode;
  color: "primary" | "error" | "warning" | "info";
};

export default function ServiceStats() {

    const {
        data: statsData,
        isLoading: statsLoading,
        isError,
        refetch,
    } = useServiceStats();

    const serviceStats: Stat[] = [
        {
            label: "Total Services",
            icon: <FaProjectDiagram />,
            color: "primary",
            value: statsData?.total.toString() ?? "0",
        },
        {
            label: "Pending Services",
            icon: <FaProjectDiagram />,
            color: "warning",
            value: statsData?.pending.toString() ?? "0",
        },
        {
            label: "In Progress Services",
            icon: <FaProjectDiagram />,
            color: "info",
            value: statsData?.inProgress.toString() ?? "0",
        },
        {
            label: "Completed Services",
            icon: <FaProjectDiagram />,
            color: "primary",
            value: statsData?.completed.toString() ?? "0",
        },
    ]

    if (statsLoading) {
        return <StatsCardsSkeleton />;
    }

    if (isError) {
        return (
            <ErrorState message="Unable to load service stats." onRetry={() => refetch()} />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
              {serviceStats.map((stat) => (
                <DashboardStatsCard key={stat.label} stat={stat} />
              ))}
            </div>
    )
}
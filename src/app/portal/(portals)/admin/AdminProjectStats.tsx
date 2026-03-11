"use client";

import { FaCheck, FaProjectDiagram } from "react-icons/fa";
import DashboardStatsCard from "../../components/DashBoardStatsCard";
import { ReactNode } from "react";
import { useProjectStats } from "@/hooks/useProjects";
import StatsCardsSkeleton from "../../components/skeletons/StatsCardsSkeleton";
import ErrorState from "../../components/states/ErrorState";

type Stat = {
  label: string;
  value: string;
  icon: ReactNode;
  color: "primary" | "error" | "warning" | "info";
};

export default function AdminProjectStats() {
  const {
    data: statsData,
    isLoading: statsLoading,
    isError,
    refetch,
  } = useProjectStats();
  const totalProjects = statsData?.total ?? 0;
  const completedProjects = statsData?.completed ?? 0;
  const outstandingProjects = Math.max(
    totalProjects - completedProjects,
    0
  );

  const adminProjectStats: Stat[] = [
    {
      label: "Total Projects",
      icon: <FaProjectDiagram />,
      color: "primary",
      value: totalProjects.toString(),
    },
    {
      label: "Completed Projects",
      icon: <FaCheck />,
      color: "warning",
      value: completedProjects.toString(),
    },
    {
      label: "Outstanding Projects",
      icon: <FaProjectDiagram />,
      color: "info",
      value: outstandingProjects.toString(),
    },
  ];

  if (statsLoading) {
    return <StatsCardsSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState message="Unable to load project stats." onRetry={() => refetch()} />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
      {adminProjectStats.map((stat) => (
        <DashboardStatsCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

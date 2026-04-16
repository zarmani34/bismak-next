"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProject, useUpdateProjectStatus } from "@/hooks/useProjects";
import ProjectDetailSkeleton from "../../../../components/ProjectDetailSkeleton";
import ErrorState from "../../../../components/states/ErrorState";
import ProjectDetailHeader from "../../../../components/project-details/ProjectDetailHeader";
import ProjectUpdateStatus from "../../../../components/project-details/ProjectUpdateStatus";
import ProjectBasicInfoCard from "../../../../components/project-details/ProjectBasicInfoCard";
import ProjectDescriptionCard from "../../../../components/project-details/ProjectDescriptionCard";
import ProjectAssignmentsCard from "../../../../components/project-details/ProjectAssignmentsCard";
import ProjectTimelineCard from "../../../../components/project-details/ProjectTimelineCard";
import ProjectTestRecordsCard from "../../../../components/project-details/ProjectTestRecordsCard";
import { FaArrowLeft } from "react-icons/fa6";

const getProgressValue = (status: string) => {
  switch (status) {
    case "planning":
      return 25;
    case "in_progress":
      return 75;
    case "completed":
      return 100;
    case "on_hold":
      return 50;
    case "cancelled":
      return 0;
    default:
      return 0;
  }
};

const getStatusUpdateErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") return undefined;

  const responseData = (
    error as {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
  ).response?.data;

  if (responseData?.error) return responseData.error;

  const message = (error as { message?: string }).message;
  return typeof message === "string" ? message : undefined;
};

export default function AdminProjectDetailsPage() {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const { data: project, isLoading, isError, refetch } = useProject(code);
  const updateStatus = useUpdateProjectStatus(code);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (isError || !project) {
    return (
      <ErrorState
        message="Unable to load project details."
        onRetry={() => refetch()}
      />
    );
  }

  const progress = getProgressValue(project.status);
  const ownerName =
    typeof project.owner === "string" ? project.owner : project.owner.full_name;
  const statusError = getStatusUpdateErrorMessage(updateStatus.error);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/portal/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProjectDetailHeader
          name={project.name}
          code={project.code}
          statusDisplay={project.status_display}
          typeLabel={project.type || project.name}
        />
        <ProjectUpdateStatus
          currentStatus={project.status}
          onUpdate={(status) => updateStatus.mutateAsync(status)}
          isPending={updateStatus.isPending}
          errorMessage={statusError}
        />
      </div>

      <ProjectBasicInfoCard
        company={project.company}
        location={project.location}
        ownerName={ownerName}
        dueDate={project.due_date}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-primary-light/20 p-6">
          <h2 className="text-lg font-semibold text-primary-dark mb-3">Progress</h2>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-secondary-light/40 rounded-full h-2">
              <div
                className="bg-primary/90 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-body-text">{progress}%</span>
          </div>
        </div>

        <ProjectDescriptionCard description={project.description} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProjectAssignmentsCard
          assignments={project.assignments}
          company={project.company}
          projectCode={project.code}
        />
        <ProjectTimelineCard events={project.events} projectCode={project.code} />
      </div>

      <ProjectTestRecordsCard
        leakTest={project.leak_test}
        pressureTest={project.pressure_test}
        projectCode={project.code}
        projectType={project.type}
        projectStatus={project.status}
      />
    </div>
  );
}

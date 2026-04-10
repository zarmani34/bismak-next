"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LeakTest } from "@/schemas/leak_test";
import { PressureTest } from "@/schemas/pressure_test";
import LeakTestRecordSummary from "./LeakTestRecordSummary";
import PressureTestRecordSummary from "./PressureTestRecordSummary";

type ProjectTestRecordsCardProps = {
  leakTest?: (LeakTest & { remark_display?: string }) | null;
  pressureTest?: PressureTest | null;
  projectCode?: string;
  projectType?: string | null;
  projectStatus?: string | null;
};

export default function ProjectTestRecordsCard({
  leakTest,
  pressureTest,
  projectCode,
  projectType,
  projectStatus,
}: ProjectTestRecordsCardProps) {
  const { data: currentUser } = useCurrentUser();
  const canExecute =
    currentUser?.role === "staff" || currentUser?.role === "admin";
  const isExecutionLocked =
    projectStatus === "completed" || projectStatus === "cancelled";
  const testTypeMap: Record<string, { slug: string; label: string }> = {
    Pressure_test: { slug: "pressure-test", label: "Pressure Test" },
    Leak_test: { slug: "leak-test", label: "Leak Test" },
  };
  const testMeta = projectType ? testTypeMap[projectType] : undefined;
  const testSlug = testMeta?.slug;
  const hasRecord =
    testSlug === "pressure-test"
      ? !!pressureTest
      : testSlug === "leak-test"
      ? !!leakTest
      : false;
  const portalBase =
    currentUser?.role === "admin"
      ? "/portal/admin/projects"
      : currentUser?.role === "staff"
      ? "/portal/staff/projects"
      : "";
  const showAction = canExecute && !!projectCode && !!testSlug && !!portalBase;
  const testHref =
    hasRecord && testSlug
      ? `${portalBase}/${projectCode}/${testSlug}/record`
      : `${portalBase}/${projectCode}/${testSlug}`;
  const canEditRecord = hasRecord && currentUser?.role === "admin";
  const canOpenRecord = showAction && hasRecord;
  const canExecuteTest = showAction && !hasRecord && !isExecutionLocked;
  return (
    <div className="rounded-xl border border-border bg-primary-light/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary-dark">Test Records</h2>
        {canOpenRecord ? (
          <div className="flex items-center gap-2">
            <Link
              href={testHref}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
            >
              {`Open ${testMeta?.label ?? "Test"} Record`}
            </Link>
            {canEditRecord ? (
              <Link
                href={`${portalBase}/${projectCode}/${testSlug}/record/edit`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                Edit Record
              </Link>
            ) : null}
          </div>
        ) : canExecuteTest ? (
          <Link
            href={testHref}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
          >
            {`Execute ${testMeta?.label ?? "Test"}`}
          </Link>
        ) : showAction && isExecutionLocked ? (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/30 text-primary/70 bg-primary/10">
            Execution Disabled
          </span>
        ) : null}
      </div>
      {!pressureTest && !leakTest ? (
        <p className="text-sm text-secondary-text">
          No test records yet. This project was created but has not been executed.
          {canExecute && projectType && !testSlug
            ? " Execution page for this project type is not available yet."
            : null}
        </p>
      ) : (
        <div className="space-y-6">
          {leakTest ? <LeakTestRecordSummary leakTest={leakTest} /> : null}

          {pressureTest ? (
            <PressureTestRecordSummary pressureTest={pressureTest} />
          ) : null}
        </div>
      )}
    </div>
  );
}

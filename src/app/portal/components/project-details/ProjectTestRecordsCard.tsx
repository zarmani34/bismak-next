"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LeakTest, LeakTestTank } from "@/schemas/leak_test";
import { PressureTest } from "@/schemas/pressure_test";

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

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
  const canEditLeakRecord = hasRecord && testSlug === "leak-test";
  return (
    <div className="rounded-xl border border-border bg-primary-light/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary-dark">Test Records</h2>
        {showAction && !isExecutionLocked ? (
          <div className="flex items-center gap-2">
            <Link
              href={testHref}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
            >
              {hasRecord
                ? `Open ${testMeta?.label ?? "Test"} Record`
                : `Execute ${testMeta?.label ?? "Test"}`}
            </Link>
            {canEditLeakRecord ? (
              <Link
                href={`${portalBase}/${projectCode}/leak-test/record/edit`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                Edit Record
              </Link>
            ) : null}
          </div>
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
          {leakTest && (
            <div className="rounded-xl border border-border bg-tetiary/80 p-4">
              <h3 className="text-sm font-semibold text-primary-dark">Leak Test</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-secondary-text">
                <div>Station: {leakTest.station_name}</div>
                <div>Location: {leakTest.location}</div>
                <div>Date of Test: {formatDate(leakTest.date_of_test)}</div>
                <div>Expiring: {formatDate(leakTest.expiring_date)}</div>
              </div>
              {leakTest.tanks?.length ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs text-secondary-text">
                      <tr>
                        <th className="py-2">Tank No</th>
                        <th className="py-2">Product</th>
                        <th className="py-2">Capacity</th>
                        <th className="py-2">Age</th>
                        <th className="py-2">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leakTest.tanks.map((tank: LeakTestTank) => (
                        <tr key={tank.id} className="border-t">
                          <td className="py-2">{tank.tank_no}</td>
                          <td className="py-2">{tank.product_stored.toUpperCase()}</td>
                          <td className="py-2">{tank.capacity}</td>
                          <td className="py-2">{leakTest.age_of_tank}</td>
                          <td className="py-2">
                            {leakTest.remark_display ?? leakTest.remark}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          )}

          {pressureTest && (
            <div className="rounded-xl border border-border bg-tetiary/80 p-4">
              <h3 className="text-sm font-semibold text-primary-dark">Pressure Test</h3>
              <p className="text-sm text-secondary-text mt-2">
                Pressure test data is available for this project.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

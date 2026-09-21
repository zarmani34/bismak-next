"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CreatePressureTestData } from "@/schemas/pressure_test";
import { resolveCertificateTitle } from "@/lib/certificateTitles";


function DocPreview({ label, title }: { label: string; title: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[10px] uppercase tracking-wide text-secondary-text">{label}</p>
      <p className="text-sm font-medium text-primary-dark mt-1">{title}</p>
    </div>
  );
}

export default function StepReview() {
  const { control } = useFormContext<CreatePressureTestData>();
  const data = useWatch({ control });
  const title = resolveCertificateTitle((data.storage_type as "mobile" | "normal") ?? "mobile");

  return (
    <div className="rounded-xl border border-border bg-tetiary/80 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-primary-dark">Review</h2>
      <p className="text-xs text-secondary-text">This submission generates three documents:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <DocPreview label="Certificate" title={title} />
        <DocPreview label="Report" title="Hydrostatic Pressure Test Report" />
        <DocPreview label="PSV Certificate" title="Pressure Safety Valve (PSV) Certificate" />
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm text-primary-dark">
        <dt className="text-secondary-text">Client</dt><dd>{data.client || "—"}</dd>
        <dt className="text-secondary-text">Location</dt><dd>{data.location_address || "—"}</dd>
        <dt className="text-secondary-text">Serial no</dt><dd>{data.serial_no || "—"}</dd>
        {data.storage_type === "mobile" && (<><dt className="text-secondary-text">Truck no</dt><dd>{data.truck_no || "—"}</dd></>)}
        <dt className="text-secondary-text">Test / working pressure</dt><dd>{data.test_pressure ?? "—"} / {data.working_pressure ?? "—"} BAR</dd>
        <dt className="text-secondary-text">Date of test</dt><dd>{data.date_of_test || "—"}</dd>
        <dt className="text-secondary-text">Result</dt><dd>{data.result || "—"}</dd>
      </dl>
    </div>
  );
}
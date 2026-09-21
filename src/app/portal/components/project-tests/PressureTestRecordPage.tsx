"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { usePressureTest, PressureTestResponse } from "@/hooks/usePressureTest";
import { PressureTest } from "@/schemas/pressure_test";
import { useProject } from "@/hooks/useProjects";
import ErrorState from "../states/ErrorState";
import {
  formatCertificateDateHeading,
  formatDateSlash,
} from "@/src/utils/date";
import {
  resolveCertificateTitle,
  resolveStorageNoun,
} from "@/lib/certificateTitles";
import {
  defaultConversionFactor,
  generateCalibrationRows,
  groupCalibrationRows,
} from "@/lib/calibrationMath";

type Props = { role: "admin" | "staff" };
type DocumentView = "certificate" | "report" | "psv" | "calibration";

const formatResult = (resultDisplay?: string, result?: string) =>
  (resultDisplay || result || "").toUpperCase();

const getTankAgeLabel = (manufacturingDate?: string | null) => {
  if (!manufacturingDate) return "--";
  const builtDate = new Date(manufacturingDate);
  if (Number.isNaN(builtDate.getTime())) return "--";
  const today = new Date();
  let years = today.getFullYear() - builtDate.getFullYear();
  const monthDelta = today.getMonth() - builtDate.getMonth();
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && today.getDate() < builtDate.getDate())
  )
    years -= 1;
  return years > 0 ? `${years}YRS` : "0YRS";
};

const resolvePressureTestRecord = (
  data: PressureTestResponse,
): PressureTest | null => {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] ?? null;
  if (typeof data === "object" && "results" in data)
    return Array.isArray(data.results) ? (data.results[0] ?? null) : null;
  if (typeof data === "object" && "id" in data) return data as PressureTest;
  return null;
};

export default function PressureTestRecordPage({ role }: Props) {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const [documentView, setDocumentView] = useState<DocumentView>("certificate");
  const [conversionFactor, setConversionFactor] = useState<number | null>(null);
  const [safeLoadingPct, setSafeLoadingPct] = useState(85);
  const {
    data: pressureTestResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = usePressureTest(code);
  const { data: project } = useProject(code);
  const pressureTest = resolvePressureTestRecord(pressureTestResponse ?? null);

  const isNotFound =
    !!error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404;

  if (isLoading)
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading pressure test record...
      </div>
    );
  if (isError && !isNotFound)
    return (
      <ErrorState
        message="Unable to load pressure test record."
        onRetry={() => refetch()}
      />
    );
  if (!pressureTest) {
    return (
      <div className="space-y-4">
        <ErrorState
          message="No pressure test record found for this project yet."
          onRetry={() => refetch()}
        />
        <Link
          href={`/portal/${role}/projects/${code}/pressure-test`}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium hover:bg-secondary-dark transition-colors"
        >
          Execute Pressure Test
        </Link>
      </div>
    );
  }

  const isMobile = pressureTest.storage_type !== "normal";
  const certificateTitle = resolveCertificateTitle(pressureTest.storage_type);
  const storageNoun = resolveStorageNoun(pressureTest.storage_type);
  const psv = pressureTest.safety_valve_certificate;
  const factor =
    conversionFactor ?? defaultConversionFactor(pressureTest.product_stored);
  const calibrationRows = generateCalibrationRows(
    pressureTest.tank_capacity,
    factor,
  );
  const calibrationGroups = groupCalibrationRows(calibrationRows);
  const permissibleLitres =
    Math.round(pressureTest.tank_capacity * safeLoadingPct) / 100;

  const viewLabels: DocumentView[] = [
    "certificate",
    "report",
    "psv",
    "calibration",
  ];
  const viewLabel = (v: DocumentView) =>
    v === "certificate"
      ? "Certificate"
      : v === "report"
        ? "Report"
        : v === "psv"
          ? "PSV Certificate"
          : "Calibration Chart";

  return (
    <div className="space-y-6 print-page">
      <div className="flex items-center justify-between gap-3 no-print">
        <Link
          href={`/portal/${role}/projects/${code}`}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" /> Back to Project
        </Link>
        <div className="flex items-center gap-2">
          {role === "admin" ? (
            <Link
              href={`/portal/${role}/projects/${code}/pressure-test/record/edit`}
              className="inline-flex items-center px-4 py-2 rounded-xl border border-secondary/40 text-secondary text-sm font-semibold hover:bg-secondary/10 transition-colors"
            >
              Edit Record
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-semibold hover:bg-secondary-dark transition-colors"
          >
            Print {viewLabel(documentView)}
          </button>
        </div>
      </div>

      <div className="no-print flex items-center gap-2 overflow-x-auto pb-2">
        {viewLabels.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setDocumentView(v)}
            className={`p-3 min-w-20 rounded-full text-xs font-semibold border transition-colors shrink-0 ${
              documentView === v
                ? "border-secondary text-secondary bg-secondary/10"
                : "border-primary/30 text-primary hover:bg-primary/10"
            }`}
          >
            {viewLabel(v)}
          </button>
        ))}
      </div>

      {documentView === "certificate" && (
        <div className="no-print-scroll overflow-x-auto">
        <section className="certificate-sheet mx-auto w-[900px] bg-white border border-[#d8d8d8] shadow-sm py-9 px-16 text-[#1f1f1f] print-container">
          <div className="certificate-inner px-10">
            <div className="h-21.5 md:h-25.5" />
            <div className="pt-2 text-center">
              <h1 className="text-[30px] md:text-[38px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
                {certificateTitle}
              </h1>
            </div>
            <div className="mt-8 space-y-1 text-[13px] leading-[1.2] uppercase">
              <p>
                CLIENT <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.client}
              </p>
              <p>
                CLIENT REPRESENTATIVE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.client_representative ||
                  project?.owner?.full_name ||
                  "--"}
              </p>
              <p>
                LOCATION ADDRESS{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.location_address}
              </p>
              <p>
                MANUFACTURER{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.manufacturer}
              </p>
              <p>
                MANUFACTURING DATE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {formatDateSlash(pressureTest.manufacturing_date)}
              </p>
              <p>
                SERIAL NO{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.serial_no}
              </p>
              {isMobile && (
                <p>
                  TRUCK NO{" "}
                  <span className="inline-block w-3 text-center">-</span>{" "}
                  {pressureTest.truck_no}
                </p>
              )}
              <p>
                TANK CAPACITY{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.tank_capacity} LTRS
              </p>
              <p>
                PRODUCT STORED{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.product_stored}
              </p>
              <p>
                TANK TYPE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.tank_type}
              </p>
              <p>
                TEST PRESSURE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.test_pressure} BAR
              </p>
              <p>
                WORKING PRESSURE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.working_pressure} BAR
              </p>
              <p>
                TEMPERATURE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.temperature}
                {"\u00B0"}C
              </p>
              <p>
                TEST DURATION{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.test_duration} HOURS
              </p>
              <p>
                TEST MEDIUM{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.test_medium}
              </p>
              <p>
                AVRG UTM GAUGE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.avrg_utm_gauge} MM
              </p>
              <p>
                SAFETY RELIEF VALVE{" "}
                <span className="inline-block w-3 text-center">-</span> SIZE:{" "}
                {pressureTest.safety_relief_valve_size} NO:{" "}
                {pressureTest.safety_relief_valve_no}
              </p>
              <p>
                DATE OF TEST{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {formatCertificateDateHeading(pressureTest.date_of_test)}
              </p>
              <p>
                NEXT TEST DATE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {formatCertificateDateHeading(pressureTest.next_test_date)}
              </p>
            </div>
            <div className="mt-5 text-[14px] font-bold uppercase">
              HYDRO TEST RESULT:{" "}
              <span className="underline">
                {formatResult(pressureTest.result_display, pressureTest.result)}
              </span>
            </div>
            <div className="mt-4 text-[13px] leading-[1.35]">
              <p className="font-bold uppercase underline mb-2">
                Certification
              </p>
              <p>
                The above {pressureTest.product_stored} {storageNoun} was
                subjected to hydrostatic test pressure up to{" "}
                {pressureTest.test_pressure} BAR and allowed to hold for{" "}
                {pressureTest.test_duration} hours. No significant drop in
                pressure was observed through the observation period.
              </p>
              <p className="mt-1">
                No leakage was observed on any part of the tank and associated
                pipelines. The facility is hereby safe for operation until next
                test period.
              </p>
            </div>
            <div className="mt-8 signature-row grid grid-cols-2 gap-8 text-[12px]">
              <div>
                <p className="uppercase font-bold tracking-wide">
                  B.I. AKINJOBI
                </p>
                <p className="signature-line-officer mt-4 inline-block w-[200px] md:w-[250px] border-t border-black pt-1 uppercase">
                  Name &amp; Sign of Bismak&apos;s Approving Officer
                </p>
              </div>
              <div className="text-right">
                <p className="uppercase font-bold tracking-wide">
                  {pressureTest.client_representative ||
                    project?.owner?.full_name ||
                    project?.company ||
                    pressureTest.client}
                </p>
                <p className="signature-line-client mt-4 inline-block w-[180px] md:w-[220px] border-t border-black pt-1 uppercase">
                  Name &amp; Sign of Client Representative
                </p>
              </div>
            </div>
            <div className="witness-line my-12 text-center text-[12px] uppercase">
              <p className="signature-line-witness inline-block min-w-[260px] md:min-w-[370px] border-t border-black pt-1">
                Witnessed by NMDPRA Officer (Name &amp; Signature)
              </p>
            </div>
          </div>
        </section>
        </div>
      )}

      {documentView === "report" && (
        <div className="no-print-scroll overflow-x-auto">
        <section className="certificate-sheet mx-auto w-[900px] bg-white border border-[#d8d8d8] shadow-sm py-9 px-8 text-[#1f1f1f] print-container">
          <div className="certificate-inner px-10">
            <div className="h-21.5" />
            <div className="pt-2 text-center">
              <h1 className="text-[30px] md:text-[38px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
                Hydrostatic Pressure Test Report
              </h1>
            </div>
            <div className="mt-8 space-y-1 text-[13px] leading-[1.2] uppercase">
              <p>
                CLIENT: <span className="underline">{pressureTest.client}</span>
              </p>
              <p>
                CLIENT REPRESENTATIVE:{" "}
                <span className="underline">
                  {pressureTest.client_representative ||
                    project?.owner?.full_name ||
                    "--"}
                </span>
              </p>
              <p>
                TANK TEST LOCATION:{" "}
                <span className="underline">
                  {pressureTest.location_address}
                </span>
              </p>
              <p>
                SERIAL NUMBER:{" "}
                <span className="underline">{pressureTest.serial_no}</span>
              </p>
              {isMobile && (
                <p>
                  TRUCK NUMBER:{" "}
                  <span className="underline">{pressureTest.truck_no}</span>
                </p>
              )}
              <p>
                SAFETY RELIEF VALVE:{" "}
                <span className="underline">
                  SIZE: {pressureTest.safety_relief_valve_size} NO:{" "}
                  {pressureTest.safety_relief_valve_no}
                </span>
              </p>
              <p>
                DATE:{" "}
                <span className="underline">
                  {formatCertificateDateHeading(pressureTest.date_of_test)}
                </span>
              </p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border border-black text-[12px] leading-tight uppercase">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 text-left">
                      Tank No
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Capacity Ltrs
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Product Stored
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Tank Age
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Working Pressure
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Test Pressure
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Holding Test Time
                    </th>
                    <th className="border border-black px-2 py-1 text-left">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1">1</td>
                    <td className="border border-black px-2 py-1">
                      {pressureTest.tank_capacity} LTRS
                    </td>
                    <td className="border border-black px-2 py-1">
                      {pressureTest.product_stored}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {getTankAgeLabel(pressureTest.manufacturing_date)}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {pressureTest.working_pressure} BAR
                    </td>
                    <td className="border border-black px-2 py-1">
                      {pressureTest.test_pressure} BAR
                    </td>
                    <td className="border border-black px-2 py-1">
                      {pressureTest.test_duration} HRS
                    </td>
                    <td className="border border-black px-2 py-1">
                      {formatResult(
                        pressureTest.result_display,
                        pressureTest.result,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-[13px] leading-[1.35]">
              <p className="font-bold uppercase underline mb-2">
                Test Procedure:
              </p>
              <p>
                The entire {pressureTest.product_stored} {storageNoun} was
                decommissioned by disconnecting its pipe networks. All outlets
                were appropriately plugged for airtightening.
              </p>
              <p className="mt-1">
                The entire system of {pressureTest.product_stored} storage tank
                was pressurized up to {pressureTest.test_pressure} BAR and
                allowed to hold for {pressureTest.test_duration} HRS. However,
                it was observed that there was no significant drop in pressure
                throughout period of test.
              </p>
              <p className="mt-1">
                Hence, tank was leak proof. The exercise was conducted by BISMAK
                EXCEL &amp; TECHNICAL SERVICES LIMITED and witnessed by NMDPRA
                officer.
              </p>
            </div>
            <div className="mt-8 signature-row grid grid-cols-2 gap-8 text-[12px]">
              <div>
                <p className="uppercase font-bold tracking-wide">
                  B.I. AKINJOBI
                </p>
                <p className="mt-4 inline-block w-[200px] md:w-[250px] border-t border-black pt-1 uppercase">
                  Name &amp; Sign of Bismak&apos;s Approving Officer
                </p>
              </div>
              <div className="text-right">
                <p className="uppercase font-bold tracking-wide">
                  {pressureTest.client_representative ||
                    project?.owner?.full_name ||
                    project?.company ||
                    pressureTest.client}
                </p>
                <p className="mt-4 inline-block w-[180px] md:w-[220px] border-t border-black pt-1 uppercase">
                  Name of Client Representative
                </p>
              </div>
            </div>
            <div className="witness-line my-12 text-center text-[12px] uppercase">
              <p className="inline-block min-w-65 md:min-w-92.5 border-t border-black pt-1">
                Witnessed by NMDPRA Officer (Name &amp; Signature)
              </p>
            </div>
          </div>
        </section>
        </div>
      )}

      {documentView === "psv" && (
        <div className="no-print-scroll overflow-x-auto">
        <section className="certificate-sheet mx-auto w-[900px] bg-white border border-[#d8d8d8] shadow-sm py-9 px-16 text-[#1f1f1f] print-container">
          <div className="certificate-inner px-10">
            <div className="h-21.5" />
            <div className="pt-2 text-center">
              <h1 className="text-[26px] md:text-[32px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
                Pressure Safety Valve (PSV) Certificate
              </h1>
            </div>

            {!psv ? (
              <p className="mt-8 text-sm text-secondary-text uppercase text-center">
                No PSV certificate recorded for this test.
              </p>
            ) : (
              <>
                <div className="mt-6 flex justify-between text-[12px] uppercase">
                  <p>
                    CERTIFICATE NO:{" "}
                    <span className="underline">{psv.certificate_no}</span>
                  </p>
                  <p>
                    DATE OF ISSUE:{" "}
                    <span className="underline">
                      {formatDateSlash(psv.date_of_issue)}
                    </span>
                  </p>
                </div>
                <div className="mt-6 space-y-1 text-[13px] leading-[1.2] uppercase">
                  <p>
                    CLIENT NAME{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {pressureTest.client}
                  </p>
                  <p>
                    TEST LOCATION{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {pressureTest.location_address}
                  </p>
                  <p>
                    MANUFACTURER{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.valve_manufacturer}
                  </p>
                  <p>
                    MANUFACTURING YEAR{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.manufacturing_year}
                  </p>
                  {isMobile && (
                    <p>
                      TRUCK NUMBER{" "}
                      <span className="inline-block w-3 text-center">-</span>{" "}
                      {pressureTest.truck_no}
                    </p>
                  )}
                  <p>
                    SERIAL NUMBER{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {pressureTest.serial_no}
                  </p>
                  <p>
                    VALVE TYPE{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.valve_type}
                  </p>
                  <p>
                    NUMBER OF VALVE{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.number_of_valve}
                  </p>
                  <p>
                    SIZE <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.valve_size}
                  </p>
                  <p>
                    MANUFACTURER SET PRESSURE{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.manufacturer_set_pressure} BAR
                  </p>
                  <p>
                    TEST PRESSURE{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.valve_test_pressure} BAR
                  </p>
                  <p>
                    DESIGN TEMPERATURE{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.design_temperature}
                  </p>
                  <p>
                    TANK CAPACITY{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {pressureTest.tank_capacity} LTRS
                  </p>
                  <p>
                    TESTING STANDARD{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.testing_standard}
                  </p>
                  <p>
                    TYPE OF TEST{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.type_of_test}
                  </p>
                  <p>
                    TEST MEDIUM{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.test_medium}
                  </p>
                  <p>
                    RESULT{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {formatResult(psv.result_display, psv.result)}
                  </p>
                  <p>
                    PERMIT NO{" "}
                    <span className="inline-block w-3 text-center">-</span>{" "}
                    {psv.permit_no || "--"}
                  </p>
                </div>

                <div className="mt-5 text-[13px] leading-[1.35]">
                  <p className="font-bold uppercase underline mb-2">
                    Certification
                  </p>
                  <p>
                    We certify that the above valve(s) has/have been set,
                    tested, and inspected in this facility and found to be in
                    accordance with the requirements of the applicable code and
                    manufacturer&apos;s specifications at the time of test.
                  </p>
                </div>

                <div className="mt-4 flex justify-between text-[12px] uppercase">
                  <p>
                    CALIBRATION DATE:{" "}
                    <span className="underline">
                      {formatDateSlash(psv.calibration_date)}
                    </span>
                  </p>
                  <p>
                    RECOMMENDED DUE DATE:{" "}
                    <span className="underline">
                      {formatDateSlash(psv.recommended_due_date)}
                    </span>
                  </p>
                </div>

                <div className="mt-8 signature-row grid grid-cols-2 gap-8 text-[12px]">
                  <div>
                    <p className="uppercase font-bold tracking-wide">
                      B.I. AKINJOBI
                    </p>
                    <p className="mt-4 inline-block w-[200px] md:w-[250px] border-t border-black pt-1 uppercase">
                      Name &amp; Sign of Bismak&apos;s Approving Officer
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="uppercase font-bold tracking-wide">
                      {pressureTest.client_representative ||
                        project?.owner?.full_name ||
                        project?.company ||
                        pressureTest.client}
                    </p>
                    <p className="mt-4 inline-block w-[180px] md:w-[220px] border-t border-black pt-1 uppercase">
                      Name of Client Representative
                    </p>
                  </div>
                </div>
                <div className="witness-line my-12 text-center text-[12px] uppercase">
                  <p className="inline-block min-w-65 md:min-w-92.5 border-t border-black pt-1">
                    Witnessed by NMDPRA Officer (Name &amp; Signature)
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
        </div>
      )}

      {documentView === "calibration" && (
        <>
          <div className="no-print rounded-xl border border-border bg-tetiary/80 p-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs text-secondary-text">
                Conversion factor (L per MT)
              </label>
              <input
                type="number"
                defaultValue={factor}
                onChange={(e) =>
                  setConversionFactor(Number(e.target.value) || null)
                }
                className="mt-1 block w-40 rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
              />
            </div>
            <div>
              <label className="text-xs text-secondary-text">
                Safe loading (%)
              </label>
              <input
                type="number"
                defaultValue={safeLoadingPct}
                onChange={(e) =>
                  setSafeLoadingPct(Number(e.target.value) || 85)
                }
                className="mt-1 block w-28 rounded-lg border border-border px-3 py-2 bg-primary-light/20 text-primary-dark"
              />
            </div>
            <p className="text-xs text-secondary-text">
              Tank capacity ({pressureTest.tank_capacity.toLocaleString()}L)
              comes straight from this record — fix it via Edit Record and this
              chart updates automatically.
            </p>
          </div>

          <div className="no-print-scroll overflow-x-auto">
        <section className="certificate-sheet mx-auto w-[900px] bg-white border border-[#d8d8d8] shadow-sm py-9 px-16 text-[#1f1f1f] print-container">
            <div className="certificate-inner px-10">
              <div className="h-21.5" />
              <div className="pt-2 text-center">
                <h1 className="text-[26px] md:text-[32px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
                  Calibration Chart for{" "}
                  {isMobile ? "Mobile Storage Tank" : "Storage Tank"}
                </h1>
              </div>

              <div className="mt-6 space-y-1 text-[13px] leading-[1.2] uppercase">
                <p>CLIENT: {pressureTest.client}</p>
                <p>LOCATION: {pressureTest.location_address}</p>
                <p>
                  TANK CAPACITY: {pressureTest.tank_capacity.toLocaleString()}{" "}
                  LTRS
                </p>
                {isMobile && <p>TRUCK NO: {pressureTest.truck_no}</p>}
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-[12px] leading-tight uppercase">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">
                        <div className=" flex items-center flex-col">
                          <span>Rotor</span> <span>Gauge %</span>
                          <span className="w-1/2 border-b-2 border-black"></span>
                        </div>
                      </th>
                      <th className="px-2 py-1 text-left">
                        <div className=" flex items-center flex-col">
                          <span>Volume</span> <span>Ltrs</span>
                          <span className="w-1/2 border-b-2 border-black"></span>
                        </div>
                      </th>
                      <th className="px-2 py-1 text-left">
                        <div className=" flex items-center flex-col">
                          <span>Volume</span> <span>MT</span>
                          <span className="w-1/2 border-b-2 border-black"></span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calibrationRows.map((row) => (
                      <tr key={row.gauge_percent}>
                        <td className=" px-2 py-1 text-center">{row.gauge_percent}</td>
                        <td className=" px-2 py-1 text-center">
                          {row.volume_litres.toLocaleString()}
                        </td>
                        <td className=" px-2 py-1 text-center">
                          {row.volume_mt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[13px] uppercase">
                PERMISSIBLE SAFE LOADING LEVEL:{" "}
                {permissibleLitres.toLocaleString()} LITRES @ {safeLoadingPct}%
              </p>

              <div className="mt-8 signature-row grid grid-cols-2 gap-8 text-[12px]">
                <div>
                  <p className="uppercase font-bold tracking-wide">
                    B.I. AKINJOBI
                  </p>
                  <p className="mt-4 inline-block w-[200px] md:w-[250px] border-t border-black pt-1 uppercase">
                    Name &amp; Signature of Approving Officer
                  </p>
                </div>
                <div className="text-right">
                  <p className="mt-4 inline-block w-[180px] md:w-[220px] border-t border-black pt-1 uppercase">
                    Client Representative
                  </p>
                </div>
              </div>
              <div className="witness-line my-12 text-center text-[12px] uppercase">
                <p className="inline-block min-w-65 md:min-w-92.5 border-t border-black pt-1">
                  Name &amp; Signature of NMDPRA Officer
                </p>
              </div>
            </div>
          </section>
        </div>
        </>
      )}

      <style jsx global>{`
        .certificate-sheet {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: "Times New Roman", Times, serif;
        }

        @media screen and (max-width: 900px) {
          .certificate-sheet {
            zoom: 0.62;
          }
        }

        @media screen and (max-width: 480px) {
          .certificate-sheet {
            zoom: 0.42;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          .no-print-scroll {
            overflow: visible !important;
          }

          header,
          nav,
          aside,
          .tsqd-parent-container,
          [class*="tsqd-"] {
            display: none !important;
          }

          .print-container {
            padding: 0 !important;
            margin: 0 !important;
          }

          .print-page,
          main,
          main > div {
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          .certificate-sheet {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 10mm !important;
          }

          .certificate-inner {
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .certificate-inner > div:first-child {
            height: calc(86px + 1rem) !important;
          }

          .certificate-inner table {
            table-layout: fixed !important;
            width: 100% !important; /* now resolves against the fixed 190mm ancestor, not the phone viewport */
          }

          .certificate-inner table th,
          .certificate-inner table td {
            font-size: 9px !important;
            padding: 2px 4px !important;
            word-break: break-word !important;
          }

          .certificate-inner .overflow-x-auto {
            overflow: visible !important;
          }

          .signature-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
            align-items: end !important;
          }

          .signature-row > div:last-child {
            text-align: right !important;
          }

          .signature-row > div:first-child p:last-child {
            width: 250px !important;
            min-width: 0 !important;
          }

          .signature-row > div:last-child p:last-child {
            width: 220px !important;
            min-width: 0 !important;
          }

          .witness-line p {
            width: 370px !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
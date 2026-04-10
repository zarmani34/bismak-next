"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { usePressureTest, PressureTestResponse } from "@/hooks/usePressureTest";
import { PressureTest } from "@/schemas/pressure_test";
import { useProject } from "@/hooks/useProjects";
import ErrorState from "../states/ErrorState";

type Props = {
  role: "admin" | "staff";
};

const formatDateSlash = (value?: string | null) => {
  if (!value) return "--/--/----";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatDateHeading = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = date.getDate();
  const lastDigit = day % 10;
  const lastTwoDigits = day % 100;
  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? "TH"
      : lastDigit === 1
      ? "ST"
      : lastDigit === 2
      ? "ND"
      : lastDigit === 3
      ? "RD"
      : "TH";
  const month = new Intl.DateTimeFormat("en-GB", { month: "long" })
    .format(date)
    .toUpperCase();
  const year = date.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
};

const formatResult = (resultDisplay?: string, result?: string) => {
  const text = resultDisplay || result || "";
  return text.toUpperCase();
};

const getTankAgeLabel = (manufacturingDate?: string | null) => {
  if (!manufacturingDate) return "--";
  const builtDate = new Date(manufacturingDate);
  if (Number.isNaN(builtDate.getTime())) return "--";
  const today = new Date();
  let years = today.getFullYear() - builtDate.getFullYear();
  const monthDelta = today.getMonth() - builtDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < builtDate.getDate())) {
    years -= 1;
  }
  return years > 0 ? `${years}YRS` : "0YRS";
};

const resolvePressureTestRecord = (
  data: PressureTestResponse,
): PressureTest | null => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  if (typeof data === "object" && "results" in data) {
    return Array.isArray(data.results) ? (data.results[0] ?? null) : null;
  }

  if (typeof data === "object" && "id" in data) {
    return data as PressureTest;
  }

  return null;
};

export default function PressureTestRecordPage({ role }: Props) {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const [documentView, setDocumentView] = useState<"certificate" | "report">(
    "certificate",
  );
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

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading pressure test record...
      </div>
    );
  }

  if (isError && !isNotFound) {
    return (
      <ErrorState
        message="Unable to load pressure test record."
        onRetry={() => refetch()}
      />
    );
  }

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

  return (
    <div className="space-y-6 print-page">
      <div className="flex items-center justify-between gap-3 no-print">
        <Link
          href={`/portal/${role}/projects/${code}`}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Project
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
            Print {documentView === "certificate" ? "Certificate" : "Report"}
          </button>
        </div>
      </div>

      <div className="no-print flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDocumentView("certificate")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            documentView === "certificate"
              ? "border-secondary text-secondary bg-secondary/10"
              : "border-primary/30 text-primary hover:bg-primary/10"
          }`}
        >
          Certificate
        </button>
        <button
          type="button"
          onClick={() => setDocumentView("report")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            documentView === "report"
              ? "border-secondary text-secondary bg-secondary/10"
              : "border-primary/30 text-primary hover:bg-primary/10"
          }`}
        >
          Report
        </button>
      </div>

      {documentView === "certificate" ? (
        <section className="certificate-sheet mx-auto w-full max-w-[900px] bg-white border border-[#d8d8d8] shadow-sm py-5 px-8 md:py-9 md:px-16 text-[#1f1f1f] print-container">
          <div className="certificate-inner px-10">
            <div className="h-[86px]" />

            <div className="pt-2 text-center">
              <h1 className="text-[30px] md:text-[38px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
                Pressure Test Certificate
              </h1>
            </div>

            <div className="mt-8 space-y-1 text-[13px] leading-[1.2] uppercase">
              <p>
                CLIENT <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.client}
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
                SERIAL NO <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.serial_no}
              </p>
              <p>
                TRUCK NO <span className="inline-block w-3 text-center">-</span>{" "}
                {pressureTest.truck_no}
              </p>
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
                TANK TYPE <span className="inline-block w-3 text-center">-</span>{" "}
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
                {formatDateHeading(pressureTest.date_of_test)}
              </p>
              <p>
                NEXT TEST DATE{" "}
                <span className="inline-block w-3 text-center">-</span>{" "}
                {formatDateHeading(pressureTest.next_test_date)}
              </p>
            </div>

            <div className="mt-5 text-[14px] font-bold uppercase">
              HYDRO TEST RESULT:{" "}
              <span className="underline">
                {formatResult(pressureTest.result_display, pressureTest.result)}
              </span>
            </div>

            <div className="mt-4 text-[13px] leading-[1.35]">
              <p className="font-bold uppercase underline mb-2">Certification</p>
              <p>
                The above LPG mobile storage tank was subjected to hydrostatic
                test pressure up to {pressureTest.test_pressure} BAR and allowed
                to hold for {pressureTest.test_duration} hours. No significant
                drop in pressure was observed through the observation period.
              </p>
              <p className="mt-1">
                No leakage was observed on any part of the tank and associated
                pipelines. The facility is hereby safe for operation until next
                test period.
              </p>
            </div>

            <div className="mt-8 signature-row grid grid-cols-1 md:grid-cols-2 gap-8 text-[12px]">
              <div>
                <p className="uppercase font-bold tracking-wide">B.I. AKINJOBI</p>
                <p className="mt-4 inline-block w-[250px] border-t border-black pt-1 uppercase">
                  Name & Sign of Bismak&apos;s Approving Officer
                </p>
              </div>
              <div className="md:text-right">
                <p className="uppercase font-bold tracking-wide">
                  {project?.company ?? pressureTest.client}
                </p>
                <p className="mt-4 inline-block w-[220px] border-t border-black pt-1 uppercase">
                  Name & Sign of Client Representative
                </p>
              </div>
            </div>

            <div className="my-12 text-center text-[12px] uppercase">
              <p className="inline-block min-w-[370px] border-t border-black pt-1">
                Witnessed by NMDPRA Officer (Name & Signature)
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="certificate-sheet mx-auto w-full max-w-[900px] bg-white border border-[#d8d8d8] shadow-sm py-5 px-8 md:py-9 md:px-16 text-[#1f1f1f] print-container">
          <div className="certificate-inner px-10">
            <div className="h-[86px]" />

            <div className="pt-2 text-center">
              <h1 className="text-[30px] md:text-[38px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
                LPG Tank Pressure Test Report
              </h1>
            </div>

            <div className="mt-8 space-y-1 text-[13px] leading-[1.2] uppercase">
              <p>
                CLIENT: <span className="underline">{pressureTest.client}</span>
              </p>
              <p>
                TANK TEST LOCATION:{" "}
                <span className="underline">{pressureTest.location_address}</span>
              </p>
              <p>
                SERIAL NUMBER:{" "}
                <span className="underline">{pressureTest.serial_no}</span>
              </p>
              <p>
                TRUCK NUMBER: <span className="underline">{pressureTest.truck_no}</span>
              </p>
              <p>
                SAFETY RELIEF VALVE:{" "}
                <span className="underline">
                  SIZE: {pressureTest.safety_relief_valve_size} NO:{" "}
                  {pressureTest.safety_relief_valve_no}
                </span>
              </p>
              <p>
                DATE: <span className="underline">{formatDateHeading(pressureTest.date_of_test)}</span>
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border border-black text-[12px] leading-tight uppercase">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 text-left">Tank No</th>
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
                    <th className="border border-black px-2 py-1 text-left">Remarks</th>
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
                      {formatResult(pressureTest.result_display, pressureTest.result)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-[13px] leading-[1.35]">
              <p className="font-bold uppercase underline mb-2">Test Procedure:</p>
              <p>
                The entire LPG mobile storage tank was decommissioned by
                disconnecting its pipe networks. All outlets were appropriately
                plugged for airtightening.
              </p>
              <p className="mt-1">
                The entire system of LPG storage tank was pressurized up to{" "}
                {pressureTest.test_pressure} BAR and allowed to hold for{" "}
                {pressureTest.test_duration} HRS. However, it was observed that
                there was no significant drop in pressure throughout period of
                test.
              </p>
              <p className="mt-1">
                Hence, tank was leak proof. The exercise was conducted by BISMAK
                EXCEL & TECHNICAL SERVICES LIMITED and witnessed by NMDPRA
                officer.
              </p>
            </div>

            <div className="mt-8 signature-row grid grid-cols-1 md:grid-cols-2 gap-8 text-[12px]">
              <div>
                <p className="uppercase font-bold tracking-wide">B.I. AKINJOBI</p>
                <p className="mt-4 inline-block w-[250px] border-t border-black pt-1 uppercase">
                  Name & Sign of Bismak&apos;s Approving Officer
                </p>
              </div>
              <div className="md:text-right">
                <p className="uppercase font-bold tracking-wide">
                  {project?.company ?? pressureTest.client}
                </p>
                <p className="mt-4 inline-block w-[220px] border-t border-black pt-1 uppercase">
                  Name of Client Representative
                </p>
              </div>
            </div>

            <div className="my-12 text-center text-[12px] uppercase">
              <p className="inline-block min-w-[370px] border-t border-black pt-1">
                Witnessed by NMDPRA Officer (Name & Signature)
              </p>
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        .certificate-sheet {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: "Times New Roman", Times, serif;
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
            margin: 0 auto !important;
            border: none !important;
            box-shadow: none !important;
            padding: 10mm !important;
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
        }
      `}</style>
    </div>
  );
}

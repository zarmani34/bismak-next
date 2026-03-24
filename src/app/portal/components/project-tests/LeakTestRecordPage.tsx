"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useLeakTest, LeakTestResponse } from "@/hooks/useLeakTest";
import { useProject } from "@/hooks/useProjects";
import { LeakTest } from "@/schemas/leak_test";
import ErrorState from "../states/ErrorState";

type Props = {
  role: "admin" | "staff";
};

const resolveLeakTestRecord = (data: LeakTestResponse): LeakTest | null => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  if (typeof data === "object" && "results" in data) {
    return Array.isArray(data.results) ? (data.results[0] ?? null) : null;
  }

  if (typeof data === "object" && "id" in data) {
    return data as LeakTest;
  }

  return null;
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

const formatRemark = (value?: string | null) => {
  if (!value) return "--";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function LeakTestRecordPage({ role }: Props) {
  const params = useParams();
  const code = typeof params?.code === "string" ? params.code : "";
  const {
    data: leakTestResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useLeakTest(code);
  const { data: project } = useProject(code);
  const leakTest = resolveLeakTestRecord(leakTestResponse ?? null);

  const isNotFound =
    !!error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 text-secondary-text">
        Loading leak test record...
      </div>
    );
  }

  if (isError && !isNotFound) {
    return (
      <ErrorState
        message="Unable to load leak test record."
        onRetry={() => refetch()}
      />
    );
  }

  if (!leakTest) {
    return (
      <div className="space-y-4">
        <ErrorState
          message="No leak test record found for this project yet."
          onRetry={() => refetch()}
        />
        <Link
          href={`/portal/${role}/projects/${code}/leak-test`}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-medium hover:bg-secondary-dark transition-colors"
        >
          Execute Leak Test
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between gap-3 no-print">
        <Link
          href={`/portal/${role}/projects/${code}`}
          className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary-light"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/portal/${role}/projects/${code}/leak-test/record/edit`}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-secondary/40 text-secondary text-sm font-semibold hover:bg-secondary/10 transition-colors"
          >
            Edit Record
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-secondary text-tetiary text-sm font-semibold hover:bg-secondary-dark transition-colors"
          >
            Print Certificate
          </button>
        </div>
      </div>

      <section className="certificate-sheet mx-auto w-full max-w-[900px] bg-white border border-[#d8d8d8] shadow-sm p-4 md:p-8 text-[#1f1f1f] print-container print:py-4">
        <div className="certificate-inner">
         

          <div className="pt-5 md:pt-7 text-center">
            <h1 className="text-[31px] md:text-[40px] leading-none font-black tracking-wide uppercase underline decoration-[1.5px] underline-offset-[5px]">
              Leak Test Certificate
            </h1>
          </div>

          <p className="mt-5 text-[13px] leading-[1.5] text-left max-w-[760px]">
            This is to certify that the leakage Detection Tests conducted on
            fuel Storage tanks specified below have been found satisfactory. The
            tanks are hereby safe for storage of Petroleum product until the next
            test period.
          </p>

          <div className="mt-6 text-[13px]">
            <div className="w-full flex justify-end">
              <p className="border-b border-black/60 inline-block min-w-[240px] uppercase tracking-wide">
                <span className="font-bold">Date:</span> {formatDateHeading(leakTest.date_of_test)}
              </p>
            </div>

            <div>
              <p className="mt-4 font-bold uppercase">Name of Station:</p>
              <p className="mt-1 border-b border-black/60 inline-block min-w-[420px] uppercase tracking-wide">
                {leakTest.station_name}
              </p>
            </div>

            <div>
              <p className="mt-4 font-bold uppercase">Location:</p>
              <p className="mt-1 border-b border-black/60 inline-block min-w-[520px] uppercase tracking-wide">
                {leakTest.location}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
            <p>
              <span className="font-bold">Equipment Tested:</span> Underground Fuel
              Storage Tanks
            </p>
            <p>
              <span className="font-bold">Expiring Date:</span>{" "}
              {formatDateSlash(leakTest.expiring_date)}
            </p>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full border border-black text-[12px] leading-tight">
              <thead className="uppercase">
                <tr>
                  <th className="border border-black px-2 py-1 text-left">Tank No</th>
                  <th className="border border-black px-2 py-1 text-left">
                    Product Stored
                  </th>
                  <th className="border border-black px-2 py-1 text-left">
                    Capacity (Litres)
                  </th>
                  <th className="border border-black px-2 py-1 text-left">
                    Age of Tank
                  </th>
                  <th className="border border-black px-2 py-1 text-left">
                    Date of Test
                  </th>
                  <th className="border border-black px-2 py-1 text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {leakTest.tanks.map((tank) => (
                  <tr key={tank.id}>
                    <td className="border border-black px-2 py-1">{tank.tank_no}</td>
                    <td className="border border-black px-2 py-1 uppercase">
                      {tank.product_stored}
                    </td>
                    <td className="border border-black px-2 py-1">{tank.capacity}</td>
                    <td className="border border-black px-2 py-1">
                      {leakTest.age_of_tank} YEARS
                    </td>
                    <td className="border border-black px-2 py-1">
                      {formatDateSlash(leakTest.date_of_test)}
                    </td>
                    <td className="border border-black px-2 py-1 uppercase">
                      {formatRemark(leakTest.remark)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-[12px]">
            <div>
              <p className="uppercase font-bold tracking-wide">
                B.I AKINJOBI
              </p>
              <p className="mt-4 border-t border-black pt-1">
                Name & Sign of Company&apos;s Engineering Officer
              </p>
            </div>
            <div className="md:text-right">
              <p className="uppercase font-bold tracking-wide">
                {project?.company ?? leakTest.station_name}
              </p>
              <p className="mt-4 border-t border-black pt-1">
                Name of Client Representative
              </p>
            </div>
          </div>

          <div className="mt-7 text-center text-[12px]">
            <p className="inline-block min-w-[340px] border-t border-black pt-1">
              Name & Sign of NMDPRA Representative
            </p>
          </div>
        </div>
      </section>

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
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            padding: 0 !important;
            margin: 0 !important;
          }

          .certificate-sheet {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            border: 1px solid #000 !important;
            box-shadow: none !important;
            padding: 10mm !important;
          }
        }
      `}</style>
    </div>
  );
}

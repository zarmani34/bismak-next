"use client";

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

type PressureTestRecordSummaryProps = {
  pressureTest: PressureTest;
};

export default function PressureTestRecordSummary({
  pressureTest,
}: PressureTestRecordSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-tetiary/80 p-4">
      <h3 className="text-sm font-semibold text-primary-dark">Pressure Test</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-secondary-text">
        <div>Client: {pressureTest.client}</div>
        <div>Location: {pressureTest.location_address}</div>
        <div>Date of Test: {formatDate(pressureTest.date_of_test)}</div>
        <div>Next Test Date: {formatDate(pressureTest.next_test_date)}</div>
        <div>Working Pressure: {pressureTest.working_pressure} BAR</div>
        <div>Result: {pressureTest.result_display}</div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-secondary-text">
            <tr>
              <th className="py-2">Tank Capacity</th>
              <th className="py-2">Product</th>
              <th className="py-2">Tank Type</th>
              <th className="py-2">Test Pressure</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2">{pressureTest.tank_capacity}</td>
              <td className="py-2">{pressureTest.product_stored}</td>
              <td className="py-2">{pressureTest.tank_type}</td>
              <td className="py-2">{pressureTest.test_pressure} BAR</td>
              <td className="py-2">{pressureTest.test_duration} HRS</td>
              <td className="py-2">
                {pressureTest.result_display || pressureTest.result}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


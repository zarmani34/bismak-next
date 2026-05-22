"use client";

import { LeakTest, LeakTestTank } from "@/schemas/leak_test";
import { formatDate } from "@/src/utils/date";

type LeakTestRecordSummaryProps = {
  leakTest: LeakTest & { remark_display?: string };
};

export default function LeakTestRecordSummary({
  leakTest,
}: LeakTestRecordSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-tetiary/80 p-4">
      <h3 className="text-sm font-semibold text-primary-dark">Leak Test</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-secondary-text">
        <div>Station: {leakTest.station_name}</div>
        <div>Client Rep: {leakTest.client_representative || "--"}</div>
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
                  <td className="py-2">{leakTest.remark_display ?? leakTest.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export type CalibrationRow = { gauge_percent: number; volume_litres: number; volume_mt: number };

export function generateCalibrationRows(capacity: number, conversionFactor: number): CalibrationRow[] {
  if (!capacity || !conversionFactor) return [];
  const rows: CalibrationRow[] = [];
  for (let pct = 0; pct <= 100; pct += 5) {
    const litres = Math.round(((capacity * pct) / 100) * 100) / 100;
    rows.push({ gauge_percent: pct, volume_litres: litres, volume_mt: Math.round((litres / conversionFactor) * 100) / 100 });
  }
  return rows;
}

const PRODUCT_CONVERSION_FACTORS: Record<string, number> = { lpg: 1750 };
export const defaultConversionFactor = (product?: string | null) =>
  product ? (PRODUCT_CONVERSION_FACTORS[product.toLowerCase().trim()] ?? 1750) : 1750;

export function groupCalibrationRows(rows: CalibrationRow[]): CalibrationRow[][] {
  if (!rows.length) return [];
  const groups: CalibrationRow[][] = [rows.slice(0, 5)]; // 0,5,10,15,20
  let i = 5;
  while (i < rows.length) {
    groups.push(rows.slice(i, i + 4));
    i += 4;
  }
  return groups;
}
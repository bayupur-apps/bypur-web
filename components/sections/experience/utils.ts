export { calculateYearsExp } from "@/lib/helpers";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

interface PeriodPoint {
  year: number;
  /** 0-11, or null when the period only gives a year. */
  month: number | null;
}

function parsePoint(token: string, now: Date): PeriodPoint | null {
  const t = token.trim().toLowerCase();
  if (/^(present|now|current|today)$/.test(t)) {
    return { year: now.getFullYear(), month: now.getMonth() };
  }
  const match = /^(?:([a-z]{3})[a-z]*\.?\s+)?(\d{4})$/.exec(t);
  if (!match) return null;
  const month = match[1] ? MONTHS.indexOf(match[1]) : -1;
  return { year: Number(match[2]), month: month >= 0 ? month : null };
}

/**
 * Human duration for a period like "May 2024 - Present" -> "2 yrs 5 mos"
 * (inclusive of both months, LinkedIn-style). Year-only periods
 * ("2022 - Present") give whole years only, since the start month is
 * unknown. Returns "" when the period can't be parsed.
 */
export function formatDuration(period: string, now: Date = new Date()): string {
  const [startRaw, endRaw] = period.split(/\s+[-–—]\s+|\s*[–—]\s*/);
  if (!startRaw || !endRaw) return "";
  const start = parsePoint(startRaw, now);
  const end = parsePoint(endRaw, now);
  if (!start || !end) return "";

  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

  if (start.month === null) {
    const years = end.year - start.year;
    return years < 1 ? "< 1 yr" : plural(years, "yr");
  }

  const months = (end.year - start.year) * 12 + ((end.month ?? 11) - start.month) + 1;
  if (months < 1) return "";
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && plural(y, "yr"), m && plural(m, "mo")].filter(Boolean).join(" ");
}

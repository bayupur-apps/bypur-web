import type { Experience } from "@/lib/types";

/** Years since the earliest experience's start year, parsed from its formatted period string. */
export const calculateYearsExp = (experiences: Experience[]): number => {
  if (!experiences.length) return 0;
  const years = experiences.map((e) => {
    const match = e.period.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : new Date().getFullYear();
  });
  return new Date().getFullYear() - Math.min(...years);
};

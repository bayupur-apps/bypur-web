import type { Project } from "@/lib/types";

/** Tag list ordered by how often each technology appears (most-used first). */
export const generateTags = (projects: Project[]): string[] => {
  const counts = new Map<string, number>();
  projects.forEach((p) => p.techStack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 6);

  return ["All", ...sorted];
};

/** Featured projects first (stable within each group), for grid display priority. */
export const sortByFeatured = (projects: Project[]): Project[] =>
  [...projects].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));

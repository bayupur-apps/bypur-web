import { FilterPills } from "@/components/ui/filter-pills";

interface ProjectsFilterProps {
  tags: string[];
  counts: Record<string, number>;
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}

export function ProjectsFilter({ tags, counts, activeFilter, onFilterChange }: ProjectsFilterProps) {
  return (
    <FilterPills
      options={tags.map((tag) => ({ key: tag, label: tag, count: counts[tag] }))}
      value={activeFilter}
      onChange={onFilterChange}
      ariaLabel="Filter projects by technology"
      className="mt-8"
    />
  );
}

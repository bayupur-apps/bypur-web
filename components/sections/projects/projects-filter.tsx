interface ProjectsFilterProps {
  tags: string[];
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}

export function ProjectsFilter({ tags, activeFilter, onFilterChange }: ProjectsFilterProps) {
  return (
    <div className="mt-6 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          aria-pressed={activeFilter === tag}
          className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-150 ${
            activeFilter === tag
              ? "border-accent bg-accent text-accent-fg"
              : "border-border text-text-3 hover:border-text-3 hover:text-text-2"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

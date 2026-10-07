import { cn } from "@/lib/helpers";

export interface FilterOption<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function FilterPills<T extends string>({ options, value, onChange, ariaLabel, className }: FilterPillsProps<T>) {
  return (
    <div
      className={cn(
        "-mx-4 flex justify-start overflow-x-auto px-4 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="inline-flex shrink-0 gap-1 rounded-full neumorphic-pressed p-1" role="group" aria-label={ariaLabel}>
        {options.map((option) => {
          const active = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-all duration-200",
                active
                  ? "bg-accent text-accent-fg shadow-sm"
                  : "text-text-3 hover:text-text-1 hover:bg-bg-subtle/60"
              )}
            >
              {option.label}
              {typeof option.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 font-mono text-[9px] leading-4",
                    active ? "bg-accent-fg/20 text-accent-fg" : "bg-bg-card text-text-3"
                  )}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

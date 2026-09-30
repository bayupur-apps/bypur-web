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

/** Glass segmented filter; scrolls sideways on narrow screens. */
export function FilterPills<T extends string>({ options, value, onChange, ariaLabel, className }: FilterPillsProps<T>) {
  return (
    <div
      className={cn(
        "-mx-4 flex justify-start overflow-x-auto px-4 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="inline-flex shrink-0 gap-1 rounded-full border border-border glass p-1" role="group" aria-label={ariaLabel}>
        {options.map((option) => {
          const active = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm",
                active
                  ? "bg-accent text-accent-fg shadow-sm shadow-accent/25"
                  : "text-text-2 hover:bg-bg-subtle hover:text-text-1"
              )}
            >
              {option.label}
              {typeof option.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 font-mono text-[10px] leading-4",
                    active ? "bg-accent-fg/20" : "bg-bg-subtle text-text-3"
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

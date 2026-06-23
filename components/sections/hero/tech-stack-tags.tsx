import { cn } from "@/lib/helpers";

interface TechStackTagsProps {
  tags: string[];
}

export function TechStackTags({ tags }: TechStackTagsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((skill, idx) => (
        <span
          key={skill}
          className={cn(
            "font-mono text-[11px] rounded-[6px] border px-2 py-1",
            idx < 2
              ? "border-accent/30 bg-accent/5 text-accent"
              : "border-border bg-bg-card text-text-2",
          )}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

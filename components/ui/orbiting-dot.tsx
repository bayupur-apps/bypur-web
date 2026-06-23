import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";

interface OrbitingDotProps {
  icon: LucideIcon;
  className?: string;
}

export function OrbitingDot({ icon: Icon, className }: OrbitingDotProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/30 bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent/10",
        className
      )}
    >
      <Icon size={16} className="text-accent" />
    </div>
  );
}

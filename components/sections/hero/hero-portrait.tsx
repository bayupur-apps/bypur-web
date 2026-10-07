import Image from "next/image";
import { cn } from "@/lib/helpers";

type PortraitSize = "sm" | "lg";

interface HeroPortraitProps {
  src: string;
  alt: string;
  size?: PortraitSize;
  priority?: boolean;
  className?: string;
}

const sizeMap: Record<PortraitSize, { width: string; sizes: string }> = {
  sm: { width: "w-48 sm:w-52", sizes: "208px" },
  lg: { width: "w-72 sm:w-80 xl:w-[21.5rem]", sizes: "(max-width: 1280px) 320px, 344px" },
};

export function HeroPortrait({ src, alt, size = "lg", priority = false, className }: HeroPortraitProps) {
  const { width, sizes } = sizeMap[size];

  return (
    <div className={cn("relative mx-auto flex items-center justify-center select-none", width, className)}>
      {/* Outer Technical Compass Ring with degree markers */}
      {size === "lg" && (
        <>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-wider text-text-3/70">
            000°
          </span>
          <span className="absolute top-1/2 -right-5 -translate-y-1/2 font-mono text-[8px] tracking-wider text-text-3/70">
            090°
          </span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-wider text-text-3/70">
            180°
          </span>
          <span className="absolute top-1/2 -left-5 -translate-y-1/2 font-mono text-[8px] tracking-wider text-text-3/70">
            270°
          </span>
        </>
      )}

      {/* Main Neumorphic Bezel */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full p-2.5 neumorphic transition-all duration-300 hover:shadow-xl">
        {/* Subtle Rotating Dashed Technical Orbit */}
        <div className="absolute inset-2.5 rounded-full border border-dashed border-accent/30 pointer-events-none animate-[spin_60s_linear_infinite]" />

        {/* Cardinal Node Anchor Dots */}
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent ring-2 ring-bg shadow-sm" />
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent ring-2 ring-bg shadow-sm" />
        <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-bg shadow-sm" />
        <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-bg shadow-sm" />

        {/* Diagonal Crosshair Ticks */}
        <span className="absolute top-2.5 left-2.5 font-mono text-[9px] text-accent/50 font-bold select-none">+</span>
        <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-accent/50 font-bold select-none">+</span>
        <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-accent/50 font-bold select-none">+</span>
        <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] text-accent/50 font-bold select-none">+</span>

        {/* Inner Photo Container with Inset Shadow Bezel */}
        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border/70 dark:border-white/10 bg-bg-subtle shadow-inner">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="origin-top scale-120 object-cover object-top transition-transform duration-500 hover:scale-125"
          />
        </div>
      </div>
    </div>
  );
}

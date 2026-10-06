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
  sm: { width: "w-44 sm:w-48", sizes: "192px" },
  lg: { width: "w-80 xl:w-[22rem]", sizes: "(max-width: 1280px) 320px, 352px" },
};

export function HeroPortrait({ src, alt, size = "lg", priority = false, className }: HeroPortraitProps) {
  const { width, sizes } = sizeMap[size];

  return (
    <div
      className={cn(
        "relative mx-auto flex items-center justify-center rounded-full p-2.5 neumorphic transition-all duration-300 hover:shadow-md",
        width,
        className
      )}
    >
      {/* Outer Schematic Ring with subtle dash border */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full border border-dashed border-accent/30 p-1.5">
        {/* Cardinal Blueprint Node Dots */}
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent/80 shadow-sm" />
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent/80 shadow-sm" />
        <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent/80 shadow-sm" />
        <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent/80 shadow-sm" />

        {/* Inner Photo Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border/60 bg-bg-subtle shadow-inner">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="origin-top scale-125 object-cover object-top transition-transform duration-500 hover:scale-130"
          />
        </div>
      </div>
    </div>
  );
}

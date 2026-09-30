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

const sizeMap: Record<PortraitSize, { width: string; sizes: string; radius: string; inner: string }> = {
  sm: { width: "w-40 sm:w-44", sizes: "176px", radius: "rounded-[1.75rem] p-1.5", inner: "rounded-[1.375rem]" },
  lg: { width: "w-80 xl:w-[22rem]", sizes: "(max-width: 1280px) 320px, 352px", radius: "rounded-[2rem] p-2.5", inner: "rounded-3xl" },
};

/** Soft, slowly drifting light blobs behind the portrait - no hard edges. */
function AuroraGlow({ size }: { size: PortraitSize }) {
  const large = size === "lg";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute -z-10", large ? "-inset-20" : "-inset-10")}>
      <div
        className={cn(
          "absolute left-0 top-[10%] animate-aurora rounded-full bg-secondary/35 blur-3xl dark:bg-secondary/25",
          large ? "h-60 w-60" : "h-32 w-32"
        )}
      />
      <div
        className={cn(
          "absolute bottom-[8%] right-0 animate-aurora-slow rounded-full bg-tertiary/25 blur-3xl dark:bg-tertiary/20",
          large ? "h-64 w-64" : "h-36 w-36"
        )}
      />
      {large && (
        <div className="absolute left-1/3 top-1/3 h-44 w-44 animate-aurora rounded-full bg-secondary/20 blur-3xl [animation-delay:-8s] dark:bg-secondary/15" />
      )}
    </div>
  );
}

/** Portrait photo in a frosted glass card with an aurora glow behind it. */
export function HeroPortrait({ src, alt, size = "lg", priority = false, className }: HeroPortraitProps) {
  const { width, sizes, radius, inner } = sizeMap[size];

  return (
    <div className={cn("relative isolate mx-auto", width, className)}>
      <AuroraGlow size={size} />

      {/* Glass frame - the light top/left border reads as the glass edge */}
      <div
        className={cn(
          "group border border-white/60 glass shadow-2xl shadow-accent/15 dark:border-white/10 dark:shadow-black/40",
          radius
        )}
      >
        <div className={cn("relative aspect-4/5 overflow-hidden bg-bg-subtle", inner)}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* Gentle bottom shade so the photo sits into the card */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-accent/25 to-transparent dark:from-black/40" />
          {/* Inner hairline keeps the photo edge crisp against the glass */}
          <div className={cn("pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20", inner)} />
        </div>
      </div>
    </div>
  );
}

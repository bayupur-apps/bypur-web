import Image from "next/image";
import { cn } from "@/lib/helpers";

type DecorationStyle = "corners" | "grid" | "mono" | "minimal" | "rings";
type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarShape = "square" | "rounded" | "sharp" | "circle";

interface DecorativeAvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  priority?: boolean;
  className?: string;
  decoration?: DecorationStyle;
  shape?: AvatarShape;
  tag?: string;
  showGlow?: boolean;
  children?: React.ReactNode;
}

const sizeMap: Record<AvatarSize, { container: string; sizes: string }> = {
  sm: { container: "h-40 w-40 sm:h-48 sm:w-48", sizes: "(max-width: 640px) 160px, 192px" },
  md: { container: "h-52 w-52 sm:h-60 sm:w-60", sizes: "(max-width: 640px) 208px, 240px" },
  lg: { container: "h-60 w-60 sm:h-68 sm:w-68 lg:h-72 lg:w-72", sizes: "(max-width: 640px) 240px, (max-width: 1024px) 272px, 288px" },
  xl: { container: "h-68 w-68 sm:h-72 sm:w-72 lg:h-80 lg:w-80", sizes: "(max-width: 640px) 272px, (max-width: 1024px) 288px, 320px" },
};

const shapeMap: Record<AvatarShape, string> = {
  sharp: "rounded-none",
  square: "rounded-sm",
  rounded: "rounded-md",
  circle: "rounded-full",
};

// ─── Dekorasi: empat sudut biru tipis + kotak offset ───
function CornersDecoration({ shape }: { shape: string }) {
  return (
    <>
      {/* Offset background box */}
      <div className={cn("absolute inset-0 translate-x-2 translate-y-2 border border-accent/25", shape)} />

      {/* Corner brackets */}
      <span className="absolute -top-px -left-px h-3 w-3 border-t-[1.5px] border-l-[1.5px] border-accent" />
      <span className="absolute -top-px -right-px h-3 w-3 border-t-[1.5px] border-r-[1.5px] border-accent" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b-[1.5px] border-l-[1.5px] border-accent" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b-[1.5px] border-r-[1.5px] border-accent" />

      {/* Accent dot bottom-right */}
      <span className="absolute -bottom-2.5 -right-2.5 h-1.5 w-1.5 bg-accent rounded-[1px]" />
    </>
  );
}

// ─── Dekorasi: dot grid atas-kiri + offset dashed ───
function GridDecoration({ shape }: { shape: string }) {
  return (
    <>
      {/* 5×5 dot grid di kiri atas */}
      <div className="absolute -top-2 -left-2 grid grid-cols-5 gap-1.25 opacity-50">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="h-0.5 w-0.5 rounded-full bg-accent block" />
        ))}
      </div>

      {/* Offset dashed box */}
      <div className={cn("absolute inset-0 translate-x-2 translate-y-2 border border-dashed border-accent/25", shape)} />
    </>
  );
}

// ─── Dekorasi: scanline + tag mono di bawah ───
function MonoDecoration({ tag }: { tag?: string }) {
  return (
    <>
      {/* Horizontal scanlines */}
      <span className="absolute top-1.5 left-0 right-0 h-px bg-accent/30 pointer-events-none z-10" />
      <span className="absolute bottom-1.5 left-0 right-0 h-px bg-accent/30 pointer-events-none z-10" />

      {/* Mono tag label */}
      {tag && (
        <p className="absolute -bottom-6 left-0 text-[10px] font-mono text-accent/70 tracking-widest select-none">
          {tag}
        </p>
      )}
    </>
  );
}

// ─── Dekorasi: concentric rings + accent glow (Vue style) ───
function RingsDecoration({ showGlow = true }: { showGlow?: boolean }) {
  return (
    <>
      {/* Central body (avatar border) */}
      <div className="absolute inset-0 rounded-full border border-border shadow-lg" />
      <div className="absolute inset-6 rounded-full border border-border/60" />

      {/* Simple concentric rings */}
      <div className="absolute inset-0 rounded-full border border-border" />
      <div className="absolute inset-6 rounded-full border border-border/60" />

      {/* Orbit guide rings (dashed) */}
      <div className="pointer-events-none absolute -inset-8 rounded-full border border-dashed border-accent/20" />
      <div className="pointer-events-none absolute -inset-16 rounded-full border border-dashed border-accent/15" />

      {/* Subtle accent glow */}
      {showGlow && (
        <>
          <div className="pointer-events-none absolute inset-8 -z-10 rounded-full bg-accent/20 blur-2xl dark:inset-12 dark:bg-accent/15 dark:blur-xl" />
        </>
      )}
    </>
  );
}

export function DecorativeAvatar({
  src,
  alt,
  size = "lg",
  priority = false,
  className,
  decoration = "corners",
  shape = "square",
  tag,
  showGlow = true,
  children,
}: DecorativeAvatarProps) {
  const { container, sizes } = sizeMap[size];
  const shapeClass = shapeMap[shape];

  // For rings decoration, force circle shape
  const finalShape = decoration === "rings" ? "rounded-full" : shapeClass;

  return (
    <div className={cn("relative mx-auto w-fit overflow-visible", className)}>

      {/* Dekorasi di belakang/sekitar frame */}
      {decoration === "corners" && <CornersDecoration shape={shapeClass} />}
      {decoration === "grid" && <GridDecoration shape={shapeClass} />}
      {decoration === "rings" && <RingsDecoration showGlow={showGlow} />}

      {/* Frame utama */}
      <div
        className={cn(
          "group relative overflow-hidden",
          decoration === "rings" ? "ring-1 ring-border" : "border border-border",
          "bg-bg-subtle",
          decoration === "rings" ? "" : "shadow-sm transition-all duration-500",
          decoration !== "rings" && "hover:-translate-y-1 hover:shadow-md hover:border-accent/40",
          container,
          finalShape
        )}
      >
        {/* Scanline decoration (dalam frame) */}
        {decoration === "mono" && <MonoDecoration tag={tag} />}

        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03] z-10 relative"
          priority={priority}
          sizes={sizes}
        />

        {/* Subtle accent overlay on hover */}
        <div className="absolute inset-0 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/5 z-20" />
      </div>

      {/* Children (floating badges, orbiting dots, etc) */}
      {children}
    </div>
  );
}
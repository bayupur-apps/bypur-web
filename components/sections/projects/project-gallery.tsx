"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Layers } from "lucide-react";
import { ProjectCover } from "./project-cover";
import { hasRealImage } from "./utils";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";

interface ProjectGalleryProps {
  project: Project;
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onOpenLightbox?: (index: number) => void;
}

export function ProjectGallery({
  project,
  activeIndex,
  onChangeIndex,
  onOpenLightbox,
}: Readonly<ProjectGalleryProps>) {
  // Extract all valid images from project images, gallery, or imageUrl
  const rawList = project.images ?? project.gallery;
  const list = Array.isArray(rawList)
    ? rawList.filter((img) => hasRealImage(img))
    : project.imageUrl && hasRealImage(project.imageUrl)
    ? [project.imageUrl]
    : [];

  const total = list.length;
  const safeIndex = Math.min(Math.max(0, activeIndex), Math.max(0, total - 1));
  const activeImage = list[safeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (total <= 1) return;
    onChangeIndex((safeIndex - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (total <= 1) return;
    onChangeIndex((safeIndex + 1) % total);
  };

  // If no real images exist, display the generated engineering schematic cover
  if (total === 0) {
    return (
      <div className="relative aspect-[16/7] sm:aspect-[16/6] w-full rounded-xl overflow-hidden border border-border/70 shadow-inner">
        <ProjectCover project={project} />
        <div className="absolute bottom-2.5 left-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-bg/90 px-2 py-0.5 font-mono text-[9px] text-text-3 backdrop-blur-xs">
          <Layers size={10} className="text-accent" />
          <span>Schematic Runtime Blueprint</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* Main Hero Viewport */}
      <div className="group relative aspect-[16/8.5] sm:aspect-[16/7.5] w-full rounded-xl overflow-hidden border border-border/70 bg-bg-card shadow-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenLightbox?.(safeIndex)}
            className="relative h-full w-full cursor-zoom-in"
          >
            <Image
              src={activeImage}
              alt={`${project.title} preview ${safeIndex + 1}`}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Top Floating Controls */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Counter Badge */}
          <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-bg/90 px-2.5 py-1 font-mono text-[9.5px] font-semibold text-text-2 backdrop-blur-xs shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              {String(safeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="text-text-3/50 hidden sm:inline">·</span>
            <span className="text-text-3 hidden sm:inline uppercase">Gallery</span>
          </span>

          {/* Fullscreen Zoom Button */}
          {onOpenLightbox && (
            <button
              type="button"
              onClick={() => onOpenLightbox(safeIndex)}
              aria-label="Expand image in lightbox"
              className="pointer-events-auto flex min-h-11 min-w-11 sm:min-h-7.5 sm:min-w-7.5 items-center justify-center rounded-lg border border-border/70 bg-bg/90 text-text-2 backdrop-blur-xs transition-all hover:bg-bg hover:border-accent hover:text-accent shadow-xs active:scale-95"
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>

        {/* Prev / Next Slide Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous gallery image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 items-center justify-center rounded-full border border-border/70 bg-bg/90 text-text-2 backdrop-blur-xs transition-all hover:bg-bg hover:border-accent hover:text-accent shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next gallery image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 items-center justify-center rounded-full border border-border/70 bg-bg/90 text-text-2 backdrop-blur-xs transition-all hover:bg-bg hover:border-accent hover:text-accent shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnail Carousel Strip */}
      {total > 1 && (
        <div
          role="tablist"
          aria-label="Project photo gallery thumbnails"
          className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 custom-workspace-scroll"
        >
          {list.map((img, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`View photo ${idx + 1}`}
                onClick={() => onChangeIndex(idx)}
                className={cn(
                  "relative h-12 w-18 sm:h-13 sm:w-20 shrink-0 rounded-lg overflow-hidden border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "border-accent ring-2 ring-accent/40 shadow-xs scale-[1.02]"
                    : "border-border/60 opacity-60 hover:opacity-90 hover:border-border"
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <span
                  className={cn(
                    "absolute bottom-1 right-1 rounded px-1 font-mono text-[8px] font-bold",
                    isActive
                      ? "bg-accent text-accent-fg"
                      : "bg-bg/80 text-text-3 backdrop-blur-xs"
                  )}
                >
                  #{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

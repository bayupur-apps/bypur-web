"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/helpers";

interface ProjectLightboxProps {
  images: string[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  title: string;
}

export function ProjectLightbox({
  images,
  activeIndex,
  isOpen,
  onClose,
  onSelectIndex,
  title,
}: Readonly<ProjectLightboxProps>) {
  const total = images.length;
  const currentImg = images[activeIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((activeIndex - 1 + total) % total);
  }, [activeIndex, total, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((activeIndex + 1) % total);
  }, [activeIndex, total, onSelectIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || typeof document === "undefined" || !currentImg) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded preview for ${title}`}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md overflow-hidden"
        >
          {/* Top Bar Navigation */}
          <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-xs font-semibold text-accent">
                {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <h3 className="text-xs sm:text-sm font-semibold text-white/90 truncate">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close enlarged preview"
                className="flex min-h-11 min-w-11 sm:min-h-9 sm:min-w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Center Stage: Full Image Display */}
          <div className="relative flex-1 flex items-center justify-center p-3 sm:p-8 overflow-hidden select-none">
            {/* Prev Button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-6 z-10 flex min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/90 backdrop-blur-sm transition-all hover:bg-black/90 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <motion.div
              key={currentImg}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center"
            >
              <Image
                src={currentImg}
                alt={`${title} screenshot ${activeIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </motion.div>

            {/* Next Button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 sm:right-6 z-10 flex min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/90 backdrop-blur-sm transition-all hover:bg-black/90 hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Bottom Bar: Thumbnail Strip */}
          {total > 1 && (
            <div className="shrink-0 flex items-center justify-center gap-2 px-4 py-3 border-t border-white/10 bg-black/40 overflow-x-auto">
              {images.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => onSelectIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={cn(
                      "relative h-12 w-20 shrink-0 rounded-md overflow-hidden border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isActive
                        ? "border-accent ring-2 ring-accent/60 scale-105 opacity-100"
                        : "border-white/20 opacity-50 hover:opacity-85 hover:border-white/40"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

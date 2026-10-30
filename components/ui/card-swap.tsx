"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/helpers";

export interface CardSwapItem {
  id: string;
  content: ReactNode;
}

export interface CardSwapProps {
  items: CardSwapItem[];
  delay?: number; // ms, 0 to disable
  pauseOnHover?: boolean;
  onIndexChange?: (index: number) => void;
  className?: string;
  showControls?: boolean;
  renderNavScrubber?: (activeIndex: number, total: number, onSelect: (index: number) => void) => ReactNode;
}

export function CardSwap({
  items,
  delay = 4000,
  pauseOnHover = true,
  onIndexChange,
  className,
  showControls = true,
  renderNavScrubber,
}: Readonly<CardSwapProps>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = items.length;

  const resetTimer = useCallback(() => {
    setTimerKey((k) => k + 1);
  }, []);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
    resetTimer();
  }, [total, resetTimer]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    resetTimer();
  }, [total, resetTimer]);

  const handleSelect = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) {
        setCurrentIndex(index);
        resetTimer();
      }
    },
    [total, resetTimer]
  );

  // Notify parent component of index changes in useEffect, preventing setState during render
  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  // Autoplay countdown timer
  useEffect(() => {
    if (delay <= 0 || isPaused || (pauseOnHover && isCardHovered) || total <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isPaused, isCardHovered, pauseOnHover, total, currentIndex, timerKey]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  if (total === 0) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Interactive Credential Panoramic Stage"
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex flex-col items-center justify-between w-full h-full select-none focus:outline-none overflow-hidden",
        className
      )}
    >
      {/* 3D Panoramic Coverflow Viewport */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center pt-2 pb-2">
        <div className="relative w-[270px] min-[390px]:w-[320px] sm:w-[420px] md:w-[460px] lg:w-[490px] h-[225px] sm:h-[240px] [perspective:1200px]">
          {items.map((item, index) => {
            const rawDiff = (index - currentIndex + total) % total;
            const signedDiff = rawDiff > total / 2 ? rawDiff - total : rawDiff;
            const absDiff = Math.abs(signedDiff);
            const isCenter = signedDiff === 0;

              // Hide cards beyond 2 steps in circular loop
              if (absDiff > 2) return null;

              let xOffset = "0%";
              let rotateY = 0;
              let rotateZ = 0;
              let scale = 1;
              let zIndex = 30;
              let opacity = 1;
              let brightness = 1;

              if (signedDiff === 0) {
                xOffset = "0%";
                rotateY = 0;
                scale = 1;
                zIndex = 30;
                opacity = 1;
                brightness = 1;
              } else if (signedDiff === -1) {
                // Immediate Left card
                xOffset = "-56%";
                rotateY = 26;
                rotateZ = -1.5;
                scale = 0.88;
                zIndex = 20;
                opacity = 0.82;
                brightness = 0.92;
              } else if (signedDiff === 1) {
                // Immediate Right card
                xOffset = "56%";
                rotateY = -26;
                rotateZ = 1.5;
                scale = 0.88;
                zIndex = 20;
                opacity = 0.82;
                brightness = 0.92;
              } else if (signedDiff === -2) {
                // Far Left card
                xOffset = "-92%";
                rotateY = 36;
                rotateZ = -3;
                scale = 0.74;
                zIndex = 10;
                opacity = 0.35;
                brightness = 0.8;
              } else if (signedDiff === 2) {
                // Far Right card
                xOffset = "92%";
                rotateY = -36;
                rotateZ = 3;
                scale = 0.74;
                zIndex = 10;
                opacity = 0.35;
                brightness = 0.8;
              }

              return (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={false}
                  animate={{
                    x: xOffset,
                    y: 0,
                    scale,
                    rotateY,
                    rotateZ,
                    opacity,
                    zIndex,
                    filter: `brightness(${brightness})`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 26,
                    mass: 0.9,
                  }}
                  onClick={() => {
                    if (isCenter) {
                      handleNext();
                    } else {
                      handleSelect(index);
                    }
                  }}
                  onMouseEnter={() => {
                    if (isCenter && pauseOnHover) setIsCardHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (isCenter && pauseOnHover) setIsCardHovered(false);
                  }}
                  className={cn(
                    "absolute inset-0 cursor-pointer rounded-2xl will-change-transform shadow-lg",
                    isCenter
                      ? "cursor-grab active:cursor-grabbing shadow-xl"
                      : "cursor-pointer hover:brightness-105"
                  )}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {item.content}
                </motion.div>
              );
            })}
          </div>
        </div>

      {/* Deck Controls & Scrubber Footer */}
      {showControls && (
        <div className="w-full flex items-center justify-between gap-3 pt-2 shrink-0 z-30">
          {/* Left: Previous Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous credential card"
              className="flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-border/70 bg-bg-card text-text-2 hover:border-accent/40 hover:text-accent active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPaused((prev) => !prev);
                resetTimer();
              }}
              aria-label={isPaused ? "Start autoplay" : "Pause autoplay"}
              className={cn(
                "hidden sm:flex h-8 px-2.5 items-center gap-1.5 rounded-lg border text-[9.5px] font-mono transition-all shadow-xs relative overflow-hidden",
                !isPaused
                  ? "border-accent/40 bg-accent/10 text-accent font-bold"
                  : "border-border/70 bg-bg-card text-text-3 hover:text-text-1 hover:border-accent/40"
              )}
            >
              {isPaused ? (
                <>
                  <Play size={10} className="text-text-2" />
                  <span>PLAY</span>
                </>
              ) : (
                <>
                  <Pause size={10} className="text-accent" />
                  <span>PAUSE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                </>
              )}

              {/* Countdown Progress Bar */}
              {!isPaused && !isCardHovered && total > 1 && (
                <motion.span
                  key={`${currentIndex}-${timerKey}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: delay / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-[2px] bg-accent pointer-events-none"
                />
              )}
            </button>
          </div>

          {/* Center: Custom Nav Scrubber or Dots */}
          {renderNavScrubber ? (
            renderNavScrubber(currentIndex, total, handleSelect)
          ) : (
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={items[i].id}
                  type="button"
                  onClick={() => handleSelect(i)}
                  aria-label={`Jump to credential ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === currentIndex ? "w-6 bg-accent shadow-xs" : "w-1.5 bg-border/80 hover:bg-text-3"
                  )}
                />
              ))}
            </div>
          )}

          {/* Right: Next Button & Monospace Counter */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-text-3 tracking-wider">
              <span className="font-bold text-text-1">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-border mx-1">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next credential card"
              className="flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-border/70 bg-bg-card text-text-2 hover:border-accent/40 hover:text-accent active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default CardSwap;

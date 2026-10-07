"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/helpers";
import type { ProfileStat } from "@/lib/types";
import { parseStatValue } from "./utils";

const COUNT_DURATION_MS = 1400;

/**
 * Counts a numeric stat up from 0 the first time it scrolls into view.
 * Server HTML and no-JS / reduced-motion visitors get the final value.
 */
function CountUp({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const parsed = parseStatValue(value);
    const el = ref.current;
    if (!parsed || reduceMotion || !el || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / COUNT_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(`${parsed.prefix}${Math.round(parsed.number * eased)}${parsed.suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

interface HeroStatsProps {
  stats?: ProfileStat[];
  className?: string;
}

/** Understated stats row under the hero actions (desktop - mobile has its own grid). */
export function HeroStats({ stats, className }: HeroStatsProps) {
  if (!stats?.length) return null;

  return (
    <dl className={cn("grid grid-flow-col auto-cols-fr divide-x divide-border border-t border-border pt-6", className)}>
      {stats.slice(0, 3).map((stat) => (
        // dt/dd order kept for semantics; column-reverse + justify-end puts
        // the number on top and aligns all numbers regardless of label length.
        <div key={stat.label} className="flex flex-col-reverse justify-end px-2.5 sm:px-6 first:pl-0 last:pr-0">
          <dt className="mt-1 max-w-36 text-[10px] sm:text-xs leading-snug text-text-3">{stat.label}</dt>
          <dd className="text-2xl sm:text-3xl font-semibold leading-none tracking-tight text-text-1">
            {/* Remount on value change so live CMS numbers re-run the count. */}
            <CountUp key={stat.value} value={stat.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

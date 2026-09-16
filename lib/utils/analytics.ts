"use client";

type GtagFn = (...args: unknown[]) => void;

interface CustomWindow {
  gtag?: GtagFn;
}

/**
 * Utility for tracking custom events to Google Analytics 4 (GA4).
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined") {
    const win = window as unknown as CustomWindow;
    if (typeof win.gtag === "function") {
      win.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }
}

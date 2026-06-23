/**
 * Styling utilities for Tailwind CSS
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes intelligently
 * Combines clsx for conditional classes with twMerge to handle conflicts
 *
 * @example
 * cn("px-2 py-1", "px-4") // → "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names; later/consumer classes win on conflict. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Visible keyboard focus ring for interactive controls. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Minimum 44px tap target with optional visual inset. */
export const hitTarget = "relative min-h-11 min-w-11 inline-flex items-center justify-center";

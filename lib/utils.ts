import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian currency (Cr / Lakhs).
 * Input is expected in raw units (e.g. rupees).
 */
export function formatCurrency(value: number): string {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  }
  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

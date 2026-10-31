import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "Ongoing / Flexible";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
}

export function formatTimeRemaining(dateStr: string | Date | null | undefined): { label: string; isUrgent: boolean } {
  if (!dateStr) return { label: "Flexible", isUrgent: false };
  try {
    const deadline = new Date(dateStr).getTime();
    if (isNaN(deadline)) return { label: "TBD", isUrgent: false };
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) return { label: "Expired", isUrgent: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days === 0) {
      return { label: `${hours}h left`, isUrgent: true };
    }
    if (days <= 3) {
      return { label: `${days}d ${hours}h left`, isUrgent: true };
    }
    return { label: `${days} days left`, isUrgent: false };
  } catch {
    return { label: "Upcoming", isUrgent: false };
  }
}

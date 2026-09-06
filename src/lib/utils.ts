import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProgramStatus, ProgramStage } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_LABELS: Record<ProgramStatus, string> = {
  idea: "Gagasan",
  planned: "Direncanakan",
  preparation: "Dalam Persiapan",
  upcoming: "Segera Dilaksanakan",
  completed: "Selesai",
  postponed: "Ditunda",
};

export const STATUS_STYLES_ON_LIGHT: Record<ProgramStatus, string> = {
  idea: "bg-gray/15 text-gray-dark border-gray/30",
  planned: "bg-gray/15 text-gray-dark border-gray/30",
  preparation: "bg-gold/15 text-gold-dark border-gold/40",
  upcoming: "bg-gold text-navy border-gold",
  completed: "bg-navy text-cream border-navy",
  postponed: "bg-[#5c5852]/10 text-[#5c5852] border-[#5c5852]/25",
};

export const STATUS_STYLES_ON_DARK: Record<ProgramStatus, string> = {
  idea: "bg-cream/10 text-cream/70 border-cream/20",
  planned: "bg-cream/10 text-cream/70 border-cream/20",
  preparation: "bg-gold/20 text-gold-soft border-gold/40",
  upcoming: "bg-gold text-navy border-gold",
  completed: "bg-cream text-navy border-cream",
  postponed: "bg-cream/10 text-cream/50 border-cream/20",
};

export function statusLabel(status: ProgramStatus) {
  return STATUS_LABELS[status];
}

export const STAGE_LABELS: Record<ProgramStage, string> = {
  "coming-soon": "Coming Soon",
  "on-going": "On Going",
  done: "Done",
};

export const STAGE_STYLES: Record<ProgramStage, string> = {
  "coming-soon": "bg-gray/15 text-gray-dark border-gray/30",
  "on-going": "bg-gold/15 text-gold-dark border-gold/40",
  done: "bg-navy text-cream border-navy",
};

export function formatYear(year: number) {
  return year.toString();
}

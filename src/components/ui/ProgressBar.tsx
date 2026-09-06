"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProgressBar({
  value,
  className,
  trackClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-navy/10",
        trackClassName
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full bg-gold", className)}
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

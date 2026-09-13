import { cn } from "@/lib/utils";
import {
  STATUS_LABELS,
  STATUS_STYLES_ON_LIGHT,
  STATUS_STYLES_ON_DARK,
} from "@/lib/utils";
import type { ProgramStatus } from "@/types";

export default function StatusBadge({
  status,
  tone = "onLight",
  className,
}: {
  status: ProgramStatus;
  tone?: "onLight" | "onDark";
  className?: string;
}) {
  const styles =
    tone === "onDark" ? STATUS_STYLES_ON_DARK : STATUS_STYLES_ON_LIGHT;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        styles[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

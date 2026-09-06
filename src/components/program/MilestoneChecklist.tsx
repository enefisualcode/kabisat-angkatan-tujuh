import { CheckCircle2, CircleDot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types";

export default function MilestoneChecklist({
  milestones,
}: {
  milestones: Milestone[];
}) {
  return (
    <ul className="space-y-1">
      {milestones.map((milestone, index) => (
        <li
          key={index}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5"
        >
          {milestone.completed ? (
            <CheckCircle2 size={19} className="shrink-0 text-gold-dark" />
          ) : milestone.current ? (
            <CircleDot size={19} className="shrink-0 text-gold-dark" />
          ) : (
            <Circle size={19} className="shrink-0 text-navy/25" />
          )}
          <span
            className={cn(
              "text-sm sm:text-base",
              milestone.completed
                ? "text-navy/50 line-through decoration-navy/25"
                : milestone.current
                  ? "font-semibold text-navy"
                  : "text-navy/60"
            )}
          >
            {milestone.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

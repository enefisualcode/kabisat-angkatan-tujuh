import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AvatarPlaceholder({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center bg-navy/[0.06]",
        className
      )}
      aria-hidden
    >
      <span className="font-heading text-3xl font-bold text-navy/25">
        {initials(name)}
      </span>
    </div>
  );
}

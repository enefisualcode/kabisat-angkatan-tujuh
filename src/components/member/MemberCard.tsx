import Image from "next/image";
import AvatarPlaceholder from "@/components/ui/AvatarPlaceholder";
import { cn } from "@/lib/utils";
import type { Member } from "@/types";

export default function MemberCard({
  member,
  className,
}: {
  member: Member;
  className?: string;
}) {
  return (
    <div className={cn("group text-center", className)}>
      <div className="relative overflow-hidden rounded-card-lg">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            width={400}
            height={400}
            className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AvatarPlaceholder name={member.name} />
        )}
      </div>
      <p className="font-heading mt-4 text-base font-bold text-navy">
        {member.name}
      </p>
      <p className="mt-0.5 text-sm text-navy/60">{member.role}</p>
      {member.description ? (
        <p className="mt-2 text-xs leading-relaxed text-navy/50">
          {member.description}
        </p>
      ) : null}
    </div>
  );
}

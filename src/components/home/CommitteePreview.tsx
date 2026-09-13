import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import MemberCard from "@/components/member/MemberCard";
import { getCoreMembers } from "@/data/members";

export default function CommitteePreview() {
  const core = getCoreMembers();

  return (
    <section className="bg-white/60 py-24 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Pengurus"
            title="Kepengurusan"
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {core.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.08}>
              <MemberCard member={member} />
            </FadeIn>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/kepengurusan"
            className="flex items-center gap-1.5 rounded-full border border-navy/15 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-navy/5"
          >
            Lihat seluruh kepengurusan
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

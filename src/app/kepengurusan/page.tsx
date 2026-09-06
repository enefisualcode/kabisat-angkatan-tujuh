import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import MemberCard from "@/components/member/MemberCard";
import { members, DIVISION_ORDER, getMembersByDivision } from "@/data/members";

export const metadata: Metadata = {
  title: "Kepengurusan",
  description:
    "Struktur kepengurusan KABISAT Angkatan Tujuh — pengurus inti dan seluruh divisi yang menjalankan program alumni.",
};

export default function KepengurusanPage() {
  const ketua = members.filter((m) => m.role === "Ketua");
  const wakilKetua = members.filter((m) => m.role === "Wakil Ketua");
  const sekretaris = members.filter((m) => m.role === "Sekretaris");
  const bendahara = members.filter((m) => m.role === "Bendahara");

  return (
    <>
      <PageHero
        eyebrow="Struktur Organisasi"
        title="Kepengurusan KABISAT Angkatan Tujuh"
        description="Orang-orang yang menjaga KABISAT tetap bergerak, terbagi dalam pengurus inti dan divisi-divisi kerja."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-center gap-12">
            {ketua.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-8">
                {ketua.map((member, index) => (
                  <FadeIn key={member.id} delay={index * 0.06}>
                    <MemberCard
                      member={member}
                      className="mx-auto w-44 sm:w-56"
                    />
                  </FadeIn>
                ))}
              </div>
            ) : null}

            {wakilKetua.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-8">
                {wakilKetua.map((member, index) => (
                  <FadeIn key={member.id} delay={0.08 + index * 0.06}>
                    <MemberCard
                      member={member}
                      className="mx-auto w-40 sm:w-48"
                    />
                  </FadeIn>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
              {sekretaris.map((member, index) => (
                <FadeIn key={member.id} delay={0.14 + index * 0.06}>
                  <MemberCard
                    member={member}
                    className="mx-auto w-36 sm:w-44"
                  />
                </FadeIn>
              ))}
              {bendahara.map((member, index) => (
                <FadeIn key={member.id} delay={0.2 + index * 0.06}>
                  <MemberCard
                    member={member}
                    className="mx-auto w-36 sm:w-44"
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-navy/10 bg-white/60 py-20 sm:py-24">
        <Container>
          <div className="space-y-16">
            {DIVISION_ORDER.map((division) => {
              const divisionMembers = getMembersByDivision(division);
              if (divisionMembers.length === 0) return null;

              return (
                <div key={division}>
                  <FadeIn>
                    <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
                      {division}
                    </h2>
                  </FadeIn>
                  <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
                    {divisionMembers.map((member, index) => (
                      <FadeIn key={member.id} delay={index * 0.08}>
                        <MemberCard member={member} />
                      </FadeIn>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

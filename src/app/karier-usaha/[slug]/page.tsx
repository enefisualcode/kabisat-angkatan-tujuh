import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, MessageCircle } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import Container from "@/components/ui/Container";
import PageHero from "@/components/layout/PageHero";
import { getOpportunityBySlug, opportunities } from "@/data/opportunities";
import { createPageMetadata } from "@/lib/metadata";
import type { BusinessOpportunity, JobOpportunity } from "@/types/opportunity";

export function generateStaticParams() {
  return opportunities.filter((item) => item.status === "published").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);
  if (!opportunity) return createPageMetadata({ title: "Peluang Tidak Ditemukan", description: "Peluang yang dicari tidak tersedia.", path: "/karier-usaha/" + slug });
  return createPageMetadata({ title: opportunity.type === "job" ? opportunity.title : opportunity.businessName, description: opportunity.description, path: "/karier-usaha/" + opportunity.slug });
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);
  if (!opportunity) notFound();
  const whatsappUrl = "https://wa.me/" + opportunity.whatsapp.replaceAll(" ", "");
  const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" });
  return <><PageHero eyebrow={opportunity.type === "job" ? "Lowongan Kerja" : "Usaha Alumni"} title={opportunity.type === "job" ? opportunity.title : opportunity.businessName} description={opportunity.type === "job" ? opportunity.company : opportunity.category} /><section className="py-16 sm:py-20"><Container className="max-w-4xl"><Link href="/karier-usaha" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/65 hover:text-navy focus-visible:outline-2 focus-visible:outline-gold"><ArrowLeft size={16} />Kembali ke Karier & Usaha</Link><article className="mt-8 overflow-hidden rounded-card border border-navy/10 bg-white shadow-sm"><div className="relative h-56 bg-navy/5 sm:h-72"><Image src={opportunity.image} alt={opportunity.type === "job" ? "Poster " + opportunity.title : "Foto " + opportunity.businessName} fill className="object-cover" /></div><div className="p-6 sm:p-10">{opportunity.type === "job" ? <JobDetails opportunity={opportunity} dateFormatter={dateFormatter} whatsappUrl={whatsappUrl} /> : <BusinessDetails opportunity={opportunity} whatsappUrl={whatsappUrl} />}</div></article></Container></section></>;
}

function JobDetails({ opportunity, dateFormatter, whatsappUrl }: { opportunity: JobOpportunity; dateFormatter: Intl.DateTimeFormat; whatsappUrl: string }) {
  return <><span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">{opportunity.employmentType}</span><h2 className="mt-5 font-heading text-3xl font-bold text-navy">{opportunity.title}</h2><p className="mt-2 text-lg font-semibold text-navy/75">{opportunity.company}</p><div className="mt-5 grid gap-3 text-sm text-navy/65 sm:grid-cols-2"><p className="flex items-center gap-2"><MapPin size={16} />{opportunity.location}</p><p>Diposting {dateFormatter.format(new Date(opportunity.publishedAt))}</p>{opportunity.deadline ? <p>Deadline {dateFormatter.format(new Date(opportunity.deadline))}</p> : null}</div><div className="mt-8 space-y-7 border-t border-navy/10 pt-7"><DetailText title="Deskripsi" text={opportunity.description} /><div><h3 className="font-heading text-lg font-bold text-navy">Persyaratan</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-navy/70">{opportunity.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div></div><div className="mt-8 flex flex-col gap-3 border-t border-navy/10 pt-7 sm:flex-row"><a href={opportunity.applicationUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream">Lihat Link Lamaran <ExternalLink size={16} /></a><a href={whatsappUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy"><MessageCircle size={16} />Hubungi Kontak</a></div><p className="mt-5 text-xs text-navy/55">Dibagikan oleh {opportunity.submittedBy}</p></>;
}

function BusinessDetails({ opportunity, whatsappUrl }: { opportunity: BusinessOpportunity; whatsappUrl: string }) {
  return <><span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">{opportunity.category}</span><h2 className="mt-5 font-heading text-3xl font-bold text-navy">{opportunity.businessName}</h2><p className="mt-2 text-lg font-semibold text-navy/75">Dikelola oleh {opportunity.ownerName}</p><p className="mt-5 flex items-center gap-2 text-sm text-navy/65"><MapPin size={16} />{opportunity.location}</p><div className="mt-8 border-t border-navy/10 pt-7"><DetailText title="Tentang usaha" text={opportunity.description} /></div><div className="mt-8 flex flex-col gap-3 border-t border-navy/10 pt-7 sm:flex-row"><a href={whatsappUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy"><MessageCircle size={16} />WhatsApp</a><a href={opportunity.instagram} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-navy/15 px-5 py-3 text-sm font-semibold text-navy"><InstagramIcon size={16} />Instagram</a>{opportunity.website ? <a href={opportunity.website} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-navy/15 px-5 py-3 text-sm font-semibold text-navy"><ExternalLink size={16} />Website</a> : null}</div></>;
}

function DetailText({ title, text }: { title: string; text: string }) {
  return <div><h3 className="font-heading text-lg font-bold text-navy">{title}</h3><p className="mt-3 text-sm leading-relaxed text-navy/70">{text}</p></div>;
}

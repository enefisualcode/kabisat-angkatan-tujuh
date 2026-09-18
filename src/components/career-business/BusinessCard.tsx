import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import type { BusinessOpportunity } from "@/types/opportunity";

export default function BusinessCard({ business }: { business: BusinessOpportunity }) {
  const whatsappUrl = "https://wa.me/" + business.whatsapp.replaceAll(" ", "");
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-40 bg-navy/5">
        <Image unoptimized src={business.image} alt={"Logo atau foto " + business.businessName} fill className="object-cover" />
        <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">Usaha Alumni</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl font-bold text-navy">{business.businessName}</h3>
        <p className="mt-1 text-sm font-semibold text-gold-dark">{business.category}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-navy/65"><MapPin size={15} />{business.location}</p>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-navy/65">{business.description}</p>
        <p className="mt-4 text-xs text-navy/55">Dikelola oleh {business.ownerName}</p>
        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"><MessageCircle size={16} />WhatsApp</a>
          <Link href={"/karier-usaha/" + business.slug} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-navy/15 px-4 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Detail <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}

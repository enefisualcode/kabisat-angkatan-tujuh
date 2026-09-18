"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import type { EmploymentType, Opportunity } from "@/types/opportunity";
import BusinessCard from "./BusinessCard";
import CategoryTabs, { type ExplorerTab } from "./CategoryTabs";
import JobCard from "./JobCard";
import SearchFilters from "./SearchFilters";
import SubmissionModal from "./SubmissionModal";
import { filterJobs, filterBusinesses } from "@/lib/opportunity-filters";

export default function CareerBusinessExplorer({ opportunities }: { opportunities: Opportunity[] }) {
  const jobs = opportunities.filter(item => item.type === "job");
  const businesses = opportunities.filter(item => item.type === "business");
  const [activeTab, setActiveTab] = useState<ExplorerTab>("job");
  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState<"Semua" | EmploymentType>("Semua");
  const [category, setCategory] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const categories = useMemo(() => [...new Set(opportunities.filter(item => item.type === "business").map(business => business.category))], [opportunities]);
  const filteredJobs = filterJobs(jobs, search, employmentType);
  const filteredBusinesses = filterBusinesses(businesses, search, category);

  return <>
    <section className="py-16 sm:py-20"><Container>
      <div className="flex flex-col gap-6 border-b border-navy/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><p className="text-sm font-semibold tracking-[0.16em] text-gold-dark uppercase">Direktori komunitas</p><h2 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">Peluang dari Alumni, untuk Alumni</h2><p className="mt-4 text-base leading-relaxed text-navy/65">Ruang berbagi peluang kerja dan usaha untuk memperkuat jejaring serta saling mendukung sesama alumni KABISAT Angkatan Tujuh.</p></div><button type="button" onClick={() => setModalOpen(true)} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-navy transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"><Plus size={18} />Bagikan Informasi</button></div>
      <div className="mt-8 flex justify-center"><CategoryTabs activeTab={activeTab} onChange={(tab) => { setActiveTab(tab); setSearch(""); }} /></div>
      <div className="mt-8"><SearchFilters search={search} onSearchChange={setSearch} activeTab={activeTab} employmentType={employmentType} onEmploymentTypeChange={setEmploymentType} category={category} categories={categories} onCategoryChange={setCategory} /></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{activeTab === "job" ? filteredJobs.map((job) => <JobCard key={job.id} job={job} />) : filteredBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)}</div>
      {((activeTab === "job" && filteredJobs.length === 0) || (activeTab === "business" && filteredBusinesses.length === 0)) ? <div className="mt-10 rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-center text-sm text-navy/65">{opportunities.length === 0 ? "Belum ada peluang yang dipublikasikan. Jadilah yang pertama berbagi lowongan atau usaha alumni melalui tombol Bagikan Informasi." : "Belum ada hasil yang sesuai dengan pencarian atau filter ini."}</div> : null}
    </Container></section>
    <SubmissionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
  </>;
}

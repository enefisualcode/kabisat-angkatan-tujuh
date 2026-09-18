"use client";

import type { EmploymentType } from "@/types/opportunity";

const employmentTypes: ("Semua" | EmploymentType)[] = ["Semua", "Full Time", "Part Time", "Internship", "Freelance"];

export default function SearchFilters({ search, onSearchChange, activeTab, employmentType, onEmploymentTypeChange, category, categories, onCategoryChange }: {
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: "job" | "business";
  employmentType: "Semua" | EmploymentType;
  onEmploymentTypeChange: (value: "Semua" | EmploymentType) => void;
  category: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="block"><span className="sr-only">Cari lowongan atau usaha</span>
        <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Cari lowongan atau usaha..."
          className="min-h-12 w-full rounded-full border border-navy/15 bg-white px-5 text-sm text-navy outline-none placeholder:text-navy/45 focus:border-gold focus:ring-2 focus:ring-gold/25" />
      </label>
      {activeTab === "job" ? (
        <div className="flex flex-wrap gap-2" aria-label="Filter jenis pekerjaan">
          {employmentTypes.map((type) => <button key={type} type="button" onClick={() => onEmploymentTypeChange(type)}
            className={employmentType === type ? "min-h-10 rounded-full border border-navy bg-navy px-4 py-2 text-sm font-medium text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" : "min-h-10 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy/70 hover:border-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"}>{type}</button>)}
        </div>
      ) : (
        <label className="block max-w-xs"><span className="sr-only">Filter kategori usaha</span>
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="min-h-11 w-full rounded-full border border-navy/15 bg-white px-4 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/25">
            <option value="Semua">Semua Kategori</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}

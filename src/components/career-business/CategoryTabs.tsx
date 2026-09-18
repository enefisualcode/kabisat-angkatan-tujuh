"use client";

export type ExplorerTab = "job" | "business";

export default function CategoryTabs({ activeTab, onChange }: { activeTab: ExplorerTab; onChange: (tab: ExplorerTab) => void }) {
  const tabs: { id: ExplorerTab; label: string }[] = [
    { id: "job", label: "Lowongan Kerja" },
    { id: "business", label: "Usaha Alumni" },
  ];
  return (
    <div className="flex w-full max-w-xl rounded-full bg-navy/5 p-1" role="tablist" aria-label="Jenis peluang">
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              onChange(tab.id === "job" ? "business" : "job");
            }
          }}
          className={activeTab === tab.id ? "min-h-11 flex-1 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-6" : "min-h-11 flex-1 rounded-full px-4 py-2 text-sm font-semibold text-navy/65 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-6"}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { safeUrl } from "@/lib/opportunity-validation";
import type { OpportunityRow } from "@/types/database";
import type { Opportunity } from "@/types/opportunity";

export function mapOpportunity(row: OpportunityRow): Opportunity {
  const base = { id: row.id, slug: row.slug || row.id, status: row.status, description: row.description,
    location: row.location || "", whatsapp: (row.whatsapp || "").replace(/\D/g, ""),
    image: row.image_url ? `/api/opportunities/${row.id}/image` : "/og-image.png", publishedAt: row.published_at || row.created_at };
  return row.type === "job" ? { ...base, type: "job", title: row.title, company: row.company || "",
    employmentType: row.employment_type || "Full Time", requirements: (row.requirements || "").split("\n").filter(Boolean),
    deadline: row.deadline || undefined, applicationUrl: safeUrl(row.application_url), submittedBy: row.submitted_by || "Alumni" }
    : { ...base, type: "business", businessName: row.title, ownerName: row.owner_name || "", category: row.category || "Lainnya", instagram: safeUrl(row.instagram), website: safeUrl(row.website) };
}

export async function getPublishedOpportunities() {
  const client = await createClient();
  const rows: OpportunityRow[] = [];
  // Fetch all pages so client filters do not silently omit rows at the API's row limit.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from("opportunities").select("*").eq("status", "published").order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
    if (error) throw new Error("Data peluang belum dapat dimuat. Silakan coba lagi.");
    rows.push(...data);
    if (data.length < 500) break;
  }
  return rows.map(mapOpportunity);
}

export const getOpportunityBySlug = cache(async (slug: string) => {
  const client = await createClient();
  const { data, error } = await client.from("opportunities").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw new Error("Data peluang belum dapat dimuat.");
  return data ? mapOpportunity(data) : null;
});

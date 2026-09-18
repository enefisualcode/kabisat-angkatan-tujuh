import type { OpportunityImageRow, OpportunityRow } from "../types/database";
import type { OpportunityImage } from "../types/opportunity";

export function orderedImages(images: OpportunityImageRow[]) {
  return [...images].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
}
export function opportunityImages(row: Pick<OpportunityRow, "id" | "image_url"> & { opportunity_images?: OpportunityImageRow[] }, admin = false): OpportunityImage[] {
  const base = admin ? `/admin/karier-usaha/image/${row.id}` : `/api/opportunities/${row.id}/image`;
  const images = orderedImages(row.opportunity_images || []).map(image => ({ id: image.id, sortOrder: image.sort_order, url: `${base}?image=${image.id}` }));
  if (images.length) return images;
  if (!row.image_url) return [];
  if (/^https?:\/\//i.test(row.image_url)) {
    try { const url = new URL(row.image_url); if (!url.username && !url.password) return [{ id: "legacy", sortOrder: 0, url: url.href }]; } catch { /* Invalid legacy URLs use the fallback. */ }
    return [];
  }
  return [{ id: "legacy", sortOrder: 0, url: base }];
}
export function opportunityStoragePaths(row: Pick<OpportunityRow, "image_url"> & { opportunity_images?: OpportunityImageRow[] }) {
  return [...new Set([...(row.opportunity_images || []).map(image => image.storage_path), ...(row.image_url && !/^https?:\/\//i.test(row.image_url) ? [row.image_url] : [])])];
}

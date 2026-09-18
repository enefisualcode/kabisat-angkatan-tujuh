import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { orderedImages } from "./opportunity-images";

export async function serveOpportunityImage(client: SupabaseClient<Database>, id: string, imageId: string | null, admin = false) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response(null, { status: 404 });
  const query = client.from("opportunities").select("image_url, opportunity_images(*)").eq("id", id);
  const { data, error } = await (admin ? query : query.eq("status", "published")).maybeSingle();
  if (error) return new Response(null, { status: 503 });
  if (!data) return new Response(null, { status: 404 });
  const images = orderedImages(data.opportunity_images);
  const path = imageId ? images.find(image => image.id === imageId)?.storage_path : images[0]?.storage_path || data.image_url;
  if (!path || /^https?:\/\//i.test(path)) return new Response(null, { status: 404 });
  const result = await client.storage.from("opportunity-images").download(path);
  if (result.error) return new Response(null, { status: 404 });
  return new Response(result.data, { headers: { "Content-Type": result.data.type, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

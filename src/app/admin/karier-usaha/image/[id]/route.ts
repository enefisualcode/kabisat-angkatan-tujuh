import { isAdmin } from "@/lib/opportunity-security";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response(null, { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response(null, { status: 404 });
  const client = createAdminClient();
  const { data, error } = await client.from("opportunities").select("image_url").eq("id", id).maybeSingle();
  if (error || !data?.image_url) return new Response(null, { status: 404 });
  const result = await client.storage.from("opportunity-images").download(data.image_url);
  if (result.error) return new Response(null, { status: 404 });
  return new Response(result.data, { headers: { "Content-Type": result.data.type, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

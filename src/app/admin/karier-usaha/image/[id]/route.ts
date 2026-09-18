import { isAdmin } from "@/lib/opportunity-security";
import { createAdminClient } from "@/lib/supabase/admin";
import { serveOpportunityImage } from "@/lib/serve-opportunity-image";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response(null, { status: 401 });
  return serveOpportunityImage(createAdminClient(), (await params).id, new URL(request.url).searchParams.get("image"), true);
}

import { createClient } from "@/lib/supabase/server";
import { serveOpportunityImage } from "@/lib/serve-opportunity-image";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return serveOpportunityImage(await createClient(), (await params).id, new URL(request.url).searchParams.get("image"));
}

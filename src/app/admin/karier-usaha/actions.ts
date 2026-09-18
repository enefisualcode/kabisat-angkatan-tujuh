"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminConfigured, adminSession, consumeLimit, equalSecret, isAdmin, requireAdmin } from "@/lib/opportunity-security";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteOpportunityRecord } from "@/lib/opportunity-deletion";
import { opportunityStoragePaths } from "@/lib/opportunity-images";

export async function login(form: FormData) {
  if (!adminConfigured()) redirect("/admin/karier-usaha?error=config");
  let allowed = false;
  try { allowed = await consumeLimit(await headers(), "login"); }
  catch { redirect("/admin/karier-usaha?error=service"); }
  if (!allowed) redirect("/admin/karier-usaha?error=limit");
  const password = form.get("password");
  if (typeof password !== "string" || !equalSecret(password, process.env.OPPORTUNITY_ADMIN_PASSWORD!)) redirect("/admin/karier-usaha?error=login");
  (await cookies()).set(ADMIN_COOKIE, adminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600 });
  redirect("/admin/karier-usaha");
}
export async function logout() { (await cookies()).delete(ADMIN_COOKIE); redirect("/admin/karier-usaha"); }
export async function moderate(form: FormData) {
  await requireAdmin();
  const id = form.get("id"), status = form.get("status");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) || (status !== "published" && status !== "rejected")) throw new Error("Permintaan tidak valid.");
  const { data, error } = await createAdminClient().from("opportunities").update({ status, published_at: status === "published" ? new Date().toISOString() : null }).eq("id", id).eq("status", "pending").select("slug").maybeSingle();
  if (error || !data) redirect("/admin/karier-usaha?error=moderate");
  revalidatePath("/karier-usaha");
  if (data.slug) revalidatePath(`/karier-usaha/${data.slug}`);
  revalidatePath("/admin/karier-usaha");
  redirect("/admin/karier-usaha?done=1");
}

export async function deleteOpportunity(form: FormData) {
  if (!(await isAdmin())) {
    // Authentication is checked again on the server, independently of the UI.
    redirect("/admin/karier-usaha?error=session");
  }
  const id = form.get("id");
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) redirect("/admin/karier-usaha?error=delete-invalid");
  const client = createAdminClient();
  const lookup = await client.from("opportunities").select("slug,image_url,status,opportunity_images(*)").eq("id", id).maybeSingle();
  if (lookup.error) redirect("/admin/karier-usaha?error=delete-read");
  if (!lookup.data) redirect("/admin/karier-usaha?error=delete-missing");
  const { slug, status } = lookup.data;
  const imagePaths = opportunityStoragePaths(lookup.data);
  const result = await deleteOpportunityRecord(imagePaths, {
    async removeImage(path) {
      const { error } = await client.storage.from("opportunity-images").remove([path]);
      if (error) throw error;
    },
    async deleteRow() {
      const { error } = await client.rpc("delete_opportunity_record", { p_id: id, p_paths: imagePaths });
      if (error) throw error;
    },
    async clearImageReference(paths) {
      const { error } = await client.rpc("detach_opportunity_images", { p_id: id, p_paths: paths });
      if (error) throw error;
    },
  });
  if (result === "image-reference-error") console.error("Opportunity delete needs retry: image removed, database outcome unresolved", { id });
  revalidatePath("/karier-usaha");
  if (slug) revalidatePath(`/karier-usaha/${slug}`);
  revalidatePath("/admin/karier-usaha");
  if (result !== "deleted") redirect(`/admin/karier-usaha?status=${status}&error=delete-${result}`);
  redirect(`/admin/karier-usaha?status=${status}&done=deleted`);
}

"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminConfigured, adminSession, consumeLimit, equalSecret, requireAdmin } from "@/lib/opportunity-security";
import { createAdminClient } from "@/lib/supabase/admin";

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

import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createAdminClient } from "./supabase/admin";

export const ADMIN_COOKIE = "kabisat-opportunity-admin";
export function adminConfigured() { return !!process.env.SUPABASE_SECRET_KEY && (process.env.OPPORTUNITY_ADMIN_PASSWORD?.length ?? 0) >= 32; }
export function equalSecret(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
function sign(value: string) { return createHmac("sha256", process.env.OPPORTUNITY_ADMIN_PASSWORD!).update(`opportunity-admin:${value}`).digest("hex"); }
export function adminSession() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value || "";
  const [expires, signature, extra] = token.split(".");
  return !extra && /^\d+$/.test(expires || "") && Number(expires) > Date.now() && equalSecret(signature || "", sign(expires));
}
export async function requireAdmin() { if (!(await isAdmin())) throw new Error("Akses admin diperlukan."); }
export async function consumeLimit(headers: Headers, scope: "submit" | "login") {
  // Vercel overwrites this header. Elsewhere, configure a trusted proxy; use a shared limit by default.
  const ip = process.env.VERCEL ? headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "shared";
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  const { data, error } = await createAdminClient().rpc("consume_opportunity_limit", { p_key: key, p_limit: scope === "login" ? 10 : 5, p_seconds: 900 });
  if (error) throw new Error("Pembatasan permintaan belum tersedia. Coba lagi nanti.");
  return data;
}

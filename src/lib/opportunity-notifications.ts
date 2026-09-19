import "server-only";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OpportunityRow } from "@/types/database";

const RECIPIENTS = ["kabisatangkatan7@gmail.com", "nandanabil021@gmail.com"];
const ADMIN_URL = "https://www.kabisat.site/admin/karier-usaha";

function escapeHtml(value: string | null | undefined) {
  return (value || "-").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]!);
}

function emailContent(opportunity: OpportunityRow) {
  const isJob = opportunity.type === "job";
  const heading = isJob ? "Lowongan Kerja Baru Menunggu Review" : "Usaha Alumni Baru Menunggu Review";
  const fields = [
    ["Jenis submission", isJob ? "Lowongan Kerja" : "Usaha Alumni"],
    [isJob ? "Judul posisi" : "Nama usaha", opportunity.title],
    [isJob ? "Perusahaan" : "Nama pemilik", isJob ? opportunity.company : opportunity.owner_name],
    ["Lokasi", opportunity.location],
    ["Nama pengirim", opportunity.submitted_by],
    ["Waktu submission", new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(opportunity.created_at))],
    ["Status", "Pending"],
  ];
  return {
    subject: `[KABISAT] ${heading}`,
    html: `<h2>${heading}</h2><table>${fields.map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`).join("")}</table><p><a href="${ADMIN_URL}">Buka moderasi Karier &amp; Usaha</a></p>`,
  };
}

export async function notifyOpportunitySubmission(id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Opportunity notification skipped: Resend environment is not configured", { id });
    return;
  }
  const client = createAdminClient();
  const { data: claimed, error: claimError } = await client.rpc("claim_opportunity_notification", { p_id: id });
  if (claimError) {
    console.error("Opportunity notification claim failed", { id, message: claimError.message });
    return;
  }
  if (!claimed) return;
  const { data: opportunity, error: opportunityError } = await client.from("opportunities").select("*").eq("id", id).eq("status", "pending").maybeSingle();
  if (opportunityError || !opportunity) {
    console.error("Opportunity notification record unavailable", { id, message: opportunityError?.message });
    await client.from("opportunity_notifications").update({ status: "failed" }).eq("opportunity_id", id);
    return;
  }
  try {
    const { subject, html } = emailContent(opportunity);
    const response = await new Resend(apiKey).emails.send({ from, to: RECIPIENTS, subject, html });
    if (response.error) throw new Error(response.error.message);
    const { error: updateError } = await client.from("opportunity_notifications").update({ status: "sent", sent_at: new Date().toISOString(), provider_id: response.data?.id || null }).eq("opportunity_id", id);
    if (updateError) console.error("Opportunity notification sent but marker update failed", { id, message: updateError.message });
  } catch (error) {
    console.error("Opportunity notification delivery failed", { id, message: error instanceof Error ? error.message : "unknown provider error" });
    await client.from("opportunity_notifications").update({ status: "failed" }).eq("opportunity_id", id);
  }
}

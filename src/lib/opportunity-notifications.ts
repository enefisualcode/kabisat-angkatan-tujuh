import "server-only";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OpportunityRow } from "@/types/database";

const RECIPIENTS = ["kabisatangkatan7@gmail.com", "nandanabil021@gmail.com"];
const ADMIN_URL = "https://www.kabisat.site/admin/karier-usaha";
const LOGO_URL = "https://www.kabisat.site/logos/kabisat-full.png";

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
  const detailRows = fields.map(([label, value]) => `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid #e6ebf0;color:#526276;font-size:14px;line-height:20px;vertical-align:top;width:38%;">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e6ebf0;color:#122c46;font-size:14px;line-height:20px;vertical-align:top;font-weight:600;">${escapeHtml(value)}</td></tr>`).join("");
  return {
    subject: `[KABISAT] ${heading}`,
    html: `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f6f8;color:#122c46;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(heading)} — buka moderasi Karier &amp; Usaha KABISAT.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background-color:#f3f6f8;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background-color:#ffffff;border:1px solid #e6ebf0;border-radius:16px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:28px 24px;background-color:#112c48;">
                <img src="${LOGO_URL}" width="240" alt="KABISAT" style="display:block;width:240px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px 12px;">
                <p style="margin:0 0 8px;color:#8a6427;font-size:12px;line-height:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Karier &amp; Usaha KABISAT</p>
                <h1 style="margin:0;color:#122c46;font-size:26px;line-height:34px;font-weight:700;">${escapeHtml(heading)}</h1>
                <p style="margin:12px 0 0;color:#526276;font-size:15px;line-height:24px;">Satu submission baru menunggu pemeriksaan pengurus.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">${detailRows}</table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:4px 28px 12px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                  <tr>
                    <td align="center" bgcolor="#112c48" style="background-color:#112c48;border-radius:999px;">
                      <a href="${ADMIN_URL}" target="_blank" style="display:block;padding:15px 20px;color:#ffffff;font-size:15px;line-height:20px;font-weight:700;text-align:center;text-decoration:none;border:1px solid #112c48;border-radius:999px;">Buka Moderasi Karier &amp; Usaha &rarr;</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 30px;text-align:center;">
                <p style="margin:12px 0 4px;color:#526276;font-size:13px;line-height:20px;">Jika tombol tidak dapat dibuka, kunjungi:</p>
                <a href="${ADMIN_URL}" target="_blank" style="color:#1b5f93;font-size:13px;line-height:20px;word-break:break-all;">${ADMIN_URL}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background-color:#f7f9fa;color:#718096;font-size:12px;line-height:18px;text-align:center;">Notifikasi otomatis dari website KABISAT Angkatan Tujuh.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export async function notifyOpportunitySubmission(id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Opportunity notification skipped: Resend environment is not configured", {
      id,
      apiKeyConfigured: Boolean(apiKey),
      fromConfigured: Boolean(from),
    });
    return;
  }
  console.info("Opportunity notification started", { id, recipientCount: RECIPIENTS.length });
  const client = createAdminClient();
  const { data: claimed, error: claimError } = await client.rpc("claim_opportunity_notification", { p_id: id });
  if (claimError) {
    console.error("Opportunity notification claim failed", { id, message: claimError.message });
    return;
  }
  if (!claimed) {
    console.info("Opportunity notification skipped: already claimed or sent", { id });
    return;
  }
  console.info("Opportunity notification claimed", { id });
  const { data: opportunity, error: opportunityError } = await client.from("opportunities").select("*").eq("id", id).eq("status", "pending").maybeSingle();
  if (opportunityError || !opportunity) {
    console.error("Opportunity notification record unavailable", { id, message: opportunityError?.message });
    const { error: markerError } = await client.from("opportunity_notifications").update({ status: "failed" }).eq("opportunity_id", id);
    if (markerError) console.error("Opportunity notification failure marker update failed", { id, message: markerError.message });
    return;
  }
  try {
    const { subject, html } = emailContent(opportunity);
    const response = await new Resend(apiKey).emails.send({ from, to: RECIPIENTS, subject, html });
    if (response.error) throw new Error(response.error.message);
    const { error: updateError } = await client.from("opportunity_notifications").update({ status: "sent", sent_at: new Date().toISOString(), provider_id: response.data?.id || null }).eq("opportunity_id", id);
    if (updateError) console.error("Opportunity notification sent but marker update failed", { id, message: updateError.message });
    else console.info("Opportunity notification sent", { id, providerIdPresent: Boolean(response.data?.id) });
  } catch (error) {
    console.error("Opportunity notification delivery failed", { id, message: error instanceof Error ? error.message : "unknown provider error" });
    const { error: markerError } = await client.from("opportunity_notifications").update({ status: "failed" }).eq("opportunity_id", id);
    if (markerError) console.error("Opportunity notification failure marker update failed", { id, message: markerError.message });
  }
}

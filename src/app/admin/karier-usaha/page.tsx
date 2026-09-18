import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/opportunity-security";
import { createAdminClient } from "@/lib/supabase/admin";
import { login, logout, moderate } from "./actions";
import type { OpportunityRow } from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moderasi Karier & Usaha", robots: { index: false, follow: false } };
const messages: Record<string, string> = { config: "Konfigurasi admin belum lengkap.", service: "Layanan belum tersedia.", limit: "Terlalu banyak percobaan. Tunggu 15 menit.", login: "Password tidak cocok.", moderate: "Posting telah ditinjau atau perubahan gagal. Muat ulang daftar." };
const previewLabels: Partial<Record<keyof OpportunityRow, string>> = {
  description: "Deskripsi", company: "Perusahaan", employment_type: "Jenis pekerjaan",
  requirements: "Persyaratan", deadline: "Batas pendaftaran", application_url: "Link lamaran",
  owner_name: "Pemilik usaha", category: "Kategori", whatsapp: "WhatsApp",
  instagram: "Instagram", website: "Website", created_at: "Dikirim pada",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; done?: string; page?: string }> }) {
  const query = await searchParams;
  const authenticated = await isAdmin();
  if (!authenticated) return <section className="mx-auto max-w-lg px-6 py-24"><h1 className="text-2xl font-bold">Admin Karier & Usaha</h1>{!adminConfigured() ? <p className="mt-4">Admin belum dikonfigurasi. Ikuti panduan environment di docs/karier-usaha.md.</p> : <form action={login} className="mt-6 space-y-4"><label className="block">Password admin<input name="password" type="password" required autoComplete="current-password" maxLength={512} className="mt-2 w-full rounded-xl border p-3" /></label><button className="rounded-full bg-navy px-6 py-3 text-cream">Masuk</button></form>}{query.error && <p role="alert" className="mt-4 text-red-700">{messages[query.error] || "Permintaan gagal."}</p>}</section>;
  const page = Math.max(0, Math.min(100000, Number.parseInt(query.page || "0", 10) || 0));
  const { data, error, count } = await createAdminClient().from("opportunities").select("*", { count: "exact" }).eq("status", "pending").order("created_at").order("id").range(page * 25, page * 25 + 24);
  return <section className="mx-auto max-w-4xl space-y-6 px-6 py-24"><div className="flex justify-between gap-4"><h1 className="text-2xl font-bold">Moderasi Karier & Usaha</h1><form action={logout}><button className="underline">Keluar</button></form></div>
    {query.done && <p role="status">Status posting berhasil diperbarui.</p>}{query.error && <p role="alert">{messages[query.error] || "Permintaan gagal."}</p>}
    {error ? <p role="alert">Daftar belum dapat dimuat. Coba muat ulang.</p> : !data?.length ? <p>Tidak ada posting pending pada halaman ini.</p> : data.map(row => <article key={row.id} className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-xl font-bold">{row.title}</h2><p>{row.type === "job" ? "Lowongan" : "Usaha"} · {row.location} · Pengirim: {row.submitted_by}</p>
      <details><summary className="cursor-pointer font-semibold">Pratinjau lengkap</summary><dl className="mt-4 space-y-2">{(Object.keys(previewLabels) as (keyof OpportunityRow)[]).filter(key => row[key]).map(key => <div key={key}><dt className="text-xs font-bold uppercase">{previewLabels[key]}</dt><dd className="whitespace-pre-wrap break-words text-sm">{row[key]}</dd></div>)}</dl>{row.image_url && <Link href={`/admin/karier-usaha/image/${row.id}`} target="_blank" className="mt-4 inline-block underline">Lihat gambar lampiran</Link>}</details>
      <form action={moderate} className="flex gap-3"><input type="hidden" name="id" value={row.id} /><button name="status" value="published" className="rounded-full bg-navy px-5 py-3 text-cream">Publish</button><button name="status" value="rejected" className="rounded-full border px-5 py-3">Reject</button></form>
    </article>)}<nav className="flex gap-6">{page > 0 && <Link href={`?page=${page - 1}`}>Sebelumnya</Link>}{(count || 0) > (page + 1) * 25 && <Link href={`?page=${page + 1}`}>Berikutnya</Link>}</nav></section>;
}

import type { OpportunityInsert } from "../types/database";
import type { EmploymentType } from "../types/opportunity";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_IMAGES = 5;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const EMPLOYMENT_TYPES: EmploymentType[] = ["Full Time", "Part Time", "Internship", "Freelance"];

export function validateImageTypes(types: unknown): asserts types is string[] {
  if (!Array.isArray(types) || types.length > MAX_IMAGES) throw new Error("Maksimal 5 foto per posting.");
  if (types.some(type => typeof type !== "string" || !IMAGE_TYPES.includes(type))) throw new Error("Gambar harus JPEG, PNG, atau WebP.");
}
export async function validateImages(files: File[]) {
  validateImageTypes(files.map(file => file.type));
  for (const file of files) await validateImageContent(file);
}

export function validateImage(file: File) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error("Gambar harus JPEG, PNG, atau WebP.");
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) throw new Error("Ukuran gambar harus antara 1 byte dan 3 MB.");
}
export async function validateImageContent(file: File) {
  validateImage(file);
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const match = file.type === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : file.type === "image/png" ? [137,80,78,71,13,10,26,10].every((value, index) => bytes[index] === value)
    : new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  if (!match) throw new Error("Isi file tidak sesuai dengan format gambar.");
}

export function safeUrl(value: string | null | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}

const INSTAGRAM_USERNAME = /^[A-Za-z0-9._]{1,30}$/;

export function normalizeInstagramUrl(value: string | null | undefined) {
  const raw = (value || "").trim();
  if (!raw) return "";
  const withoutAt = raw.startsWith("@") ? raw.slice(1) : raw;
  if (INSTAGRAM_USERNAME.test(withoutAt)) return `https://instagram.com/${withoutAt}`;

  const candidate = /^(?:www\.)?instagram\.com\//i.test(withoutAt) ? `https://${withoutAt}` : withoutAt;
  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(host) || url.username || url.password || url.port) return "";
    const [username, ...rest] = url.pathname.split("/").filter(Boolean);
    const normalizedUsername = username?.startsWith("@") ? username.slice(1) : username;
    if (rest.length > 0 || !normalizedUsername || !INSTAGRAM_USERNAME.test(normalizedUsername)) return "";
    return `https://instagram.com/${normalizedUsername}`;
  } catch { return ""; }
}

export function normalizeWebsiteUrl(value: string | null | undefined) {
  const raw = (value || "").trim();
  if (!raw) return "";
  if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) return "";
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".") || url.hostname.startsWith(".") || url.hostname.endsWith(".") || url.username || url.password) return "";
    const normalized = url.href;
    return url.pathname === "/" && !url.search && !url.hash ? normalized.slice(0, -1) : normalized;
  } catch { return ""; }
}

export function validateSubmission(form: FormData): OpportunityInsert {
  const labels: Record<string, string> = { title: "Judul / nama usaha", description: "Deskripsi", location: "Lokasi", whatsapp: "WhatsApp", submittedBy: "Nama pengirim", company: "Perusahaan", requirements: "Persyaratan", ownerName: "Nama pemilik", category: "Kategori", applicationUrl: "Link lamaran", instagram: "Instagram", website: "Website", deadline: "Deadline", employmentType: "Jenis pekerjaan", type: "Jenis informasi" };
  function text(name: string, required = false, max = 200) {
    const raw = form.get(name);
    if (raw !== null && typeof raw !== "string") throw new Error(`${labels[name] || name}: format tidak valid.`);
    const value = (raw ?? "").trim();
    if (required && !value) throw new Error(`${labels[name] || name}: wajib diisi.`);
    if (value.length > max) throw new Error(`${labels[name] || name}: maksimal ${max} karakter.`);
    return value;
  }
  function url(name: string, normalize = safeUrl) {
    const value = text(name, false, 2048);
    const normalized = normalize(value);
    if (value && !normalized) throw new Error(`${labels[name] || name}: gunakan URL http:// atau https:// yang valid.`);
    return normalized || null;
  }
  const type = text("type");
  if (type !== "job" && type !== "business") throw new Error("Jenis informasi tidak valid.");
  let whatsapp = text("whatsapp", true, 30).replace(/[\s()+-]/g, "");
  if (whatsapp.startsWith("0")) whatsapp = "62" + whatsapp.slice(1);
  if (!/^[1-9]\d{7,14}$/.test(whatsapp)) throw new Error("WhatsApp: gunakan 8–15 digit dengan kode negara (contoh 62812...).");
  const common = { type, title: text("title", true), description: text("description", true, 10000), location: text("location", true), whatsapp, submitted_by: text("submittedBy", true), status: "pending" as const, published_at: null };
  if (type === "business") return { ...common, type, owner_name: text("ownerName", true), category: text("category", true, 80), instagram: url("instagram", normalizeInstagramUrl), website: url("website", normalizeWebsiteUrl) };
  const employment = text("employmentType") as EmploymentType;
  if (!EMPLOYMENT_TYPES.includes(employment)) throw new Error("Jenis pekerjaan tidak valid.");
  const deadline = text("deadline");
  if (deadline && (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || !Number.isFinite(Date.parse(deadline)) || new Date(deadline).toISOString().slice(0, 10) !== deadline)) throw new Error("Tanggal deadline tidak valid.");
  return { ...common, type, company: text("company", true), employment_type: employment, requirements: text("requirements", true, 10000), deadline: deadline || null, application_url: url("applicationUrl") };
}

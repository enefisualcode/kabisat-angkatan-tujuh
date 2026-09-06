import type { Member } from "@/types";

// NOTE: nama, jabatan, dan foto masih placeholder — ganti dengan data pengurus resmi.
export const members: Member[] = [
  {
    id: "m-1",
    name: "Budi Santoso",
    role: "Ketua",
    division: "Inti",
    order: 1,
  },
  {
    id: "m-2",
    name: "Siti Rahmawati",
    role: "Wakil Ketua",
    division: "Inti",
    order: 2,
  },
  {
    id: "m-3",
    name: "Andi Pratama",
    role: "Sekretaris",
    division: "Inti",
    order: 3,
  },
  {
    id: "m-4",
    name: "Dewi Lestari",
    role: "Bendahara",
    division: "Inti",
    order: 4,
  },
  {
    id: "m-5",
    name: "Rizky Ramadhan",
    role: "Koordinator Divisi Program",
    division: "Divisi Program",
    description: "Menyusun dan mengawal jalannya program dan kegiatan KABISAT.",
    order: 5,
  },
  {
    id: "m-6",
    name: "Putri Wulandari",
    role: "Anggota Divisi Program",
    division: "Divisi Program",
    order: 6,
  },
  {
    id: "m-7",
    name: "Fajar Nugroho",
    role: "Koordinator Divisi Humas",
    division: "Divisi Humas",
    description: "Menjaga komunikasi dan informasi antar alumni.",
    order: 7,
  },
  {
    id: "m-8",
    name: "Anisa Kusuma",
    role: "Anggota Divisi Humas",
    division: "Divisi Humas",
    order: 8,
  },
  {
    id: "m-9",
    name: "Taufik Hidayat",
    role: "Koordinator Divisi Sosial",
    division: "Divisi Sosial",
    description: "Menggerakkan program kontribusi sosial KABISAT.",
    order: 9,
  },
  {
    id: "m-10",
    name: "Maya Anggraini",
    role: "Anggota Divisi Sosial",
    division: "Divisi Sosial",
    order: 10,
  },
  {
    id: "m-11",
    name: "Dimas Adi Saputra",
    role: "Koordinator Divisi Dokumentasi",
    division: "Divisi Dokumentasi",
    description: "Mengabadikan dan mengarsipkan setiap momen KABISAT.",
    order: 11,
  },
  {
    id: "m-12",
    name: "Intan Permata",
    role: "Anggota Divisi Dokumentasi",
    division: "Divisi Dokumentasi",
    order: 12,
  },
];

export const CORE_ROLES = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara"];

export const DIVISION_ORDER = [
  "Divisi Program",
  "Divisi Humas",
  "Divisi Sosial",
  "Divisi Dokumentasi",
];

export function getCoreMembers() {
  return members
    .filter((m) => CORE_ROLES.includes(m.role))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getMembersByDivision(division: string) {
  return members
    .filter((m) => m.division === division)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

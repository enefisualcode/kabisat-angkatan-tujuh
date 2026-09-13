import type { Member } from "@/types";

// NOTE: baru 4 pengurus dengan data & foto asli. Tambahkan sisanya saat sudah tersedia.
export const members: Member[] = [
  {
    id: "m-1",
    name: "Rafly Ramadhan",
    role: "Ketua",
    division: "Inti",
    image: "/members/rafly-ramadhan.webp",
    order: 1,
  },
  {
    id: "m-2",
    name: "Agus Zehid",
    role: "Wakil Ketua",
    division: "Inti",
    image: "/members/agus-zehid.webp",
    order: 2,
  },
  {
    id: "m-3",
    name: "Firol Mustaqimah",
    role: "Ketua",
    division: "Inti",
    image: "/members/firol-mustaqimah.webp",
    order: 3,
  },
  {
    id: "m-4",
    name: "Zalfa Khalilah Muztaba",
    role: "Wakil Ketua",
    division: "Inti",
    image: "/members/zalfa-khalilah-muztaba.webp",
    order: 4,
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

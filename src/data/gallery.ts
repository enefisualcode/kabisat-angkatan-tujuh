import type { GalleryItem } from "@/types";

// NOTE: foto masih placeholder — ganti dengan dokumentasi asli setiap kegiatan.
export const gallery: GalleryItem[] = [
  {
    id: "g-1",
    title: "Reuni Akbar Angkatan Tujuh",
    event: "Reuni Akbar",
    year: 2023,
    location: "Jakarta",
    image: "/gallery/reuni-akbar-1.png",
    featured: true,
  },
  {
    id: "g-2",
    title: "Sesi Foto Bersama",
    event: "Reuni Akbar",
    year: 2023,
    location: "Jakarta",
    image: "/gallery/reuni-akbar-2.png",
    featured: true,
  },
  {
    id: "g-3",
    title: "Sambutan Ketua Angkatan",
    event: "Reuni Akbar",
    year: 2023,
    location: "Jakarta",
    image: "/gallery/reuni-akbar-3.png",
  },
  {
    id: "g-4",
    title: "Obrolan Santai Alumni",
    event: "Gathering KABISAT",
    year: 2024,
    location: "Bandung",
    image: "/gallery/gathering-1.png",
    featured: true,
  },
  {
    id: "g-5",
    title: "Games Kebersamaan",
    event: "Gathering KABISAT",
    year: 2024,
    location: "Bandung",
    image: "/gallery/gathering-2.png",
    featured: true,
  },
  {
    id: "g-6",
    title: "Makan Bersama",
    event: "Gathering KABISAT",
    year: 2024,
    location: "Bandung",
    image: "/gallery/gathering-3.png",
  },
  {
    id: "g-7",
    title: "Buka Puasa Bersama",
    event: "Buka Bersama",
    year: 2025,
    location: "Jakarta",
    image: "/gallery/buka-bersama-1.png",
    featured: true,
  },
  {
    id: "g-8",
    title: "Tali Asih untuk Anak Yatim",
    event: "Buka Bersama",
    year: 2025,
    location: "Jakarta",
    image: "/gallery/buka-bersama-2.png",
    featured: true,
  },
  {
    id: "g-9",
    title: "Kebersamaan di Penghujung Hari",
    event: "Buka Bersama",
    year: 2025,
    location: "Jakarta",
    image: "/gallery/buka-bersama-3.png",
  },
];

export function getFeaturedGallery() {
  return gallery.filter((g) => g.featured);
}

export function getGalleryForEvent(eventTitle: string) {
  return gallery.filter(
    (g) => g.event.toLowerCase() === eventTitle.toLowerCase()
  );
}

export function getGalleryByEvent() {
  const map = new Map<string, GalleryItem[]>();
  for (const item of gallery) {
    const key = `${item.event}__${item.year}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries())
    .map(([key, items]) => {
      const [event, year] = key.split("__");
      return { event, year: Number(year), items };
    })
    .sort((a, b) => b.year - a.year);
}

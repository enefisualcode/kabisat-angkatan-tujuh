import type { GalleryItem } from "@/types";

export const gallery: GalleryItem[] = [
  {
    id: "g-1",
    title: "Santunan Anak Yatim",
    event: "Santunan Anak Yatim",
    year: 2023,
    image: "/gallery/santunan-anak-yatim.jpg",
    featured: true,
  },
  {
    id: "g-2",
    title: "Ziarah Kubro — Sunan Gunung Jati",
    event: "Ziarah Kubro",
    year: 2024,
    location: "Cirebon",
    image: "/gallery/ziarah-kubro-cirebon.jpg",
    featured: true,
  },
  {
    id: "g-3",
    title: "Ziarah Kubro — Habib Kuncung",
    event: "Ziarah Kubro",
    year: 2024,
    location: "Kalibata",
    image: "/gallery/ziarah-kubro-kalibata.jpg",
  },
  {
    id: "g-4",
    title: "Maulid Akbar bersama Gus Faiz",
    event: "Maulid Akbar",
    year: 2025,
    image: "/gallery/maulid-akbar.jpg",
    featured: true,
  },
  {
    id: "g-5",
    title: "Gathering KABISAT Cinere",
    event: "Gathering KABISAT",
    year: 2026,
    location: "Cinere",
    image: "/gallery/gathering-cinere-1.jpg",
    featured: true,
  },
  {
    id: "g-6",
    title: "Gathering KABISAT Cinere",
    event: "Gathering KABISAT",
    year: 2026,
    location: "Cinere",
    image: "/gallery/gathering-cinere-2.jpg",
    featured: true,
  },
  {
    id: "g-7",
    title: "Halal Bihalal",
    event: "Halal Bihalal",
    year: 2026,
    image: "/gallery/halal-bihalal-1.jpg",
    featured: true,
  },
  {
    id: "g-8",
    title: "Halal Bihalal bersama Ust. Ade",
    event: "Halal Bihalal",
    year: 2026,
    image: "/gallery/halal-bihalal-2.jpg",
  },
  {
    id: "g-9",
    title: "Halal Bihalal bersama Ust. Alwan",
    event: "Halal Bihalal",
    year: 2026,
    image: "/gallery/halal-bihalal-3.jpg",
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

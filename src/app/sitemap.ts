import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { programs } from "@/data/programs";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/program", priority: 0.8 },
  { path: "/kepengurusan", priority: 0.8 },
  { path: "/lowongan-kerja", priority: 0.8 },
  { path: "/kitab-irsyadud", priority: 0.8 },
  { path: "/dokumentasi", priority: 0.8 },
  { path: "/tentang", priority: 0.8 },
] as const;

const absoluteUrl = (path: string) => new URL(path, site.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = publicRoutes.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const programRoutes = programs.map((program) => ({
    url: absoluteUrl(`/program/${program.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes];
}

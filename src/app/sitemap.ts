import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { programs } from "@/data/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/kepengurusan",
    "/lowongan-kerja",
    "/program",
    "/dokumentasi",
    "/tentang",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const programRoutes = programs.map((program) => ({
    url: `${site.url}/program/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes];
}

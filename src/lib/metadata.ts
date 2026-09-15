import type { Metadata } from "next";
import { site } from "@/data/site";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path || "/";
  const socialTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      type: "website",
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [site.ogImage],
    },
  };
}

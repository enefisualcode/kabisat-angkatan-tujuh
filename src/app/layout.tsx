import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/providers/MotionProvider";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "KABISAT Angkatan Tujuh — Alumni Daarul Rahman 3",
    template: `%s | ${site.name}`,
  },
  description:
    "Website resmi KABISAT Angkatan Tujuh, alumni Pondok Pesantren Daarul Rahman 3 tahun 2018. Temukan informasi kepengurusan, program, kegiatan, dan dokumentasi alumni.",
  keywords: [
    "KABISAT Angkatan Tujuh",
    "alumni Daarul Rahman 3",
    "alumni pesantren",
    "keluarga alumni",
    "kegiatan alumni",
    "reuni alumni Daarul Rahman",
  ],
  openGraph: {
    title: "KABISAT Angkatan Tujuh — Alumni Daarul Rahman 3",
    description:
      "Website resmi KABISAT Angkatan Tujuh, alumni Pondok Pesantren Daarul Rahman 3 tahun 2018.",
    url: site.url,
    siteName: site.name,
    locale: "id_ID",
    type: "website",
    images: [{ url: site.ogImage, width: 1425, height: 305, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [site.ogImage],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.fullName,
  url: site.url,
  logo: `${site.url}${site.logos.symbol}`,
  email: site.email,
  sameAs: [site.instagram, site.youtube],
  description: site.description,
  memberOf: {
    "@type": "EducationalOrganization",
    name: "Pondok Pesantren Daarul Rahman 3",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "id-ID",
  publisher: { "@type": "Organization", name: site.name, url: site.url },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${inter.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-cream text-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
        <MotionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import InstagramIcon from "@/components/ui/InstagramIcon";
import YoutubeIcon from "@/components/ui/YoutubeIcon";
import { navLinks, site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-cream">
      <Container className="flex flex-col gap-10 py-14 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-sm">
            <Image
              src={site.logos.full}
              alt={site.name}
              width={220}
              height={54}
              className="h-11 w-auto object-contain object-left"
            />
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              {site.name}
              <br />
              {site.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-cream/75 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 sm:flex-row sm:items-center">
          <p>
            &copy; {year} {site.name}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-gold"
              aria-label="Email KABISAT"
            >
              <Mail size={15} />
              <span className="hidden sm:inline">{site.email}</span>
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 transition-colors hover:text-gold"
              aria-label="Instagram KABISAT"
            >
              <InstagramIcon size={15} />
            </a>
            <a
              href={site.youtube}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 transition-colors hover:text-gold"
              aria-label="YouTube KABISAT"
            >
              <YoutubeIcon size={15} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

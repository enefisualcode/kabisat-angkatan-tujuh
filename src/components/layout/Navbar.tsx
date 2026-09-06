"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-navy/10 bg-cream/95 backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={site.name}
        >
          <Image
            src={site.logos.symbol}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span
            className={cn(
              "font-heading text-lg font-bold tracking-tight transition-colors duration-300",
              solid ? "text-navy" : "text-cream"
            )}
          >
            KABISAT
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  solid
                    ? active
                      ? "text-navy"
                      : "text-navy/65 hover:text-navy"
                    : active
                      ? "text-cream"
                      : "text-cream/75 hover:text-cream",
                  "link-underline",
                  active && "[background-size:100%_2px]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#program"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy transition-transform duration-200 hover:scale-[1.03] sm:inline-block"
          >
            Lihat Agenda
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className={cn(
              "-mr-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden",
              solid ? "text-navy" : "text-cream"
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-navy/10 bg-cream md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-3 text-base font-medium text-navy/80 hover:bg-navy/5 hover:text-navy"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#program"
                className="mt-2 rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-navy"
              >
                Lihat Agenda
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/8 bg-cream/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          onClick={closeMenu}
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
          <span className="flex flex-col">
            <span className="font-heading text-base leading-none font-extrabold tracking-[-0.04em] text-navy sm:text-lg">
              KABISAT
            </span>
            <span className="mt-1 text-[9px] leading-none font-semibold tracking-[0.16em] text-navy/50 uppercase">
              Angkatan Tujuh
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
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
                  "relative py-2 text-[13px] font-semibold transition-colors",
                  active ? "text-navy" : "text-navy/55 hover:text-navy",
                  "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:origin-left after:rounded-full after:bg-gold after:transition-transform",
                  active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/karier-usaha"
            className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:bg-gold-soft lg:inline-flex"
          >
            Ruang Alumni <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy/5 xl:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-navy/8 bg-cream xl:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-navy text-cream"
                        : "text-navy/75 hover:bg-navy/5 hover:text-navy"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/karier-usaha"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-bold text-navy"
              >
                Ruang Alumni <ArrowUpRight size={15} />
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

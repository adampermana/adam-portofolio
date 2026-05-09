"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Work", href: "/#work" },
  { name: "Stack", href: "/#stack" },
  { name: "GitHub", href: "/#github" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 md:px-5 ${scrolled
          ? "border-white/[0.12] bg-space-black/[0.72] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-white/[0.08] bg-white/[0.025] backdrop-blur-md"
          }`}
      >
        <a href="/#home" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-adam.png"
            alt="Adam Permana"
            className="h-8 w-auto object-contain md:h-9 [filter:drop-shadow(0_0_10px_rgba(59,167,255,0.75))_drop-shadow(0_2px_6px_rgba(0,0,0,0.9))]"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-gray-400 transition duration-300 hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href="/#work"
          className="hidden rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:border-atm-blue/[0.45] hover:bg-atm-blue/10 md:inline-flex"
        >
          View Work
        </a>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-space-black/[0.92] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

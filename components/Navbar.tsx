"use client";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";

const links = [
  { label: "HOME", href: "#home" },
  { label: "OUR STORY", href: "#story" },
  { label: "ITINERARY", href: "#itinerary" },
  { label: "FAQ", href: "#faq" },
  { label: "RSVP", href: "#rsvp" },
  { label: "VENUE MAP", href: "#venue-map" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream/90 backdrop-blur-sm shadow-sm shadow-peach/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1185px] mx-auto flex items-center justify-between px-6 py-4">
          {/* Left links — hidden on mobile */}
          <div className="hidden md:flex gap-8">
            {links.slice(0, 3).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-jakarta text-xs tracking-widest text-dark hover:text-peach transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Center monogram */}
          <a
            href="#home"
            className="flex items-center justify-center border border-peach/30 bg-cream/20 px-5 py-3"
          >
            <span className="font-dynalight text-2xl text-peach leading-none">
              {config.couple.groom[0]}{" "}
              <span className="text-sm font-jakarta text-dark/60">&amp;</span>{" "}
              {config.couple.bride[0]}
            </span>
          </a>

          {/* Right links — hidden on mobile */}
          <div className="hidden md:flex gap-8">
            {links.slice(3).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-jakarta text-xs tracking-widest text-dark hover:text-peach transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-6 h-px bg-dark block" />
            <span className="w-6 h-px bg-dark block" />
            <span className="w-6 h-px bg-dark block" />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-6 font-jakarta text-2xl text-dark"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-jakarta text-sm tracking-widest text-dark hover:text-peach transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-[rgba(8,9,11,.88)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex-shrink-0">
            <Link href="/" className="font-display font-bold text-2xl md:text-3xl tracking-widest text-warm-white">
              {siteConfig.name}
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-10">
            <Link href="#about" className="text-xs font-bold hover:text-warm-white transition-colors uppercase tracking-[0.2em] text-warm-white/70">О клубе</Link>
            <Link href="#why" className="text-xs font-bold hover:text-warm-white transition-colors uppercase tracking-[0.2em] text-warm-white/70">Почему мы</Link>
            <Link href="#formats" className="text-xs font-bold hover:text-warm-white transition-colors uppercase tracking-[0.2em] text-warm-white/70">Форматы</Link>
            <Link href="#gallery" className="text-xs font-bold hover:text-warm-white transition-colors uppercase tracking-[0.2em] text-warm-white/70">Галерея</Link>
            <Link href="#contacts" className="text-xs font-bold hover:text-warm-white transition-colors uppercase tracking-[0.2em] text-warm-white/70">Контакты</Link>
          </nav>
          <div>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center px-4 sm:px-8 py-3 border-b-2 border-[rgba(241,239,233,0.3)] hover:border-warm-white text-xs sm:text-sm font-bold text-warm-white transition-colors duration-300 tracking-widest uppercase"
            >
              Забронировать ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

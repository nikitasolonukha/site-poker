"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

interface MagnumCTAProps {
  chip?: string;
  title: string;
  label: string;
  href: string;
}

export default function MagnumCTA({
  chip = "/chips/magnum-chip-cta.webp",
  title,
  label,
  href,
}: MagnumCTAProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const chipElement = chipRef.current;
    if (!container || !chipElement) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverTimeline = gsap.timeline({ paused: true }).to(chipElement, {
      x: 3,
      rotation: 3,
      duration: 0.6,
      ease: "power2.out",
    });

    const handleEnter = () => {
      if (!prefersReducedMotion) hoverTimeline.play();
    };
    const handleLeave = () => {
      if (!prefersReducedMotion) hoverTimeline.reverse();
    };

    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
      hoverTimeline.kill();
    };
  }, []);

  return (
    <div className="w-full bg-[#21060C] py-8 md:py-14 flex justify-center border-t border-white/[0.04]">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full max-w-6xl px-6 outline-none"
        ref={containerRef}
      >
        <div className="relative flex items-center overflow-hidden border-y border-white/[0.08] py-8 md:py-10">
          <div className="relative z-10 flex w-full flex-col items-center gap-6 md:flex-row md:gap-12">
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase font-bold text-[#F1EFE9] text-balance md:whitespace-nowrap">
              {title}
            </h3>

            <div className="relative mx-0 flex h-px w-32 flex-none items-center bg-white/10 md:mx-4 md:w-auto md:flex-1">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-[15%] md:translate-x-0"
                aria-hidden="true"
              >
                <div
                  ref={chipRef}
                  className="h-8 w-8 will-change-transform md:h-[42px] md:w-[42px]"
                >
                  <Image
                    src={chip}
                    alt=""
                    width={42}
                    height={42}
                    sizes="(min-width: 768px) 42px, 32px"
                    quality={100}
                    unoptimized
                    className="block h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex min-h-11 items-center whitespace-nowrap font-sans text-sm md:text-base text-[#F1EFE9] tracking-[0.06em] uppercase font-semibold transition-transform duration-200 group-hover:translate-x-1.5">
              {label}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
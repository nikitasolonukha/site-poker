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
  chip = "/magnum-chip.svg",
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

    const hoverTimeline = gsap.timeline({ paused: true }).to(chipElement, {
      x: 32,
      rotation: 95,
      duration: 0.45,
      ease: "power2.out",
    });

    const handleEnter = () => hoverTimeline.play();
    const handleLeave = () => hoverTimeline.reverse();

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

            <div className="relative mx-4 hidden h-px flex-1 items-center bg-white/10 md:flex">
              <div
                ref={chipRef}
                className="absolute left-[15%] top-1/2 w-[46px] h-[46px] -translate-y-1/2 drop-shadow-lg"
              >
                <Image
                  src={chip}
                  alt=""
                  fill
                  sizes="46px"
                  className="object-contain"
                />
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


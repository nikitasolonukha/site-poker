/* eslint-disable @next/next/no-img-element -- direct SVG is the WebGL fallback. */
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/config/site";

gsap.registerPlugin(ScrollTrigger);

const MagnumChip3D = dynamic(
  () => import("@/components/hero/MagnumChip3D"),
  { ssr: false, loading: () => <span aria-hidden className="absolute inset-0" /> },
);

type ChipSvgFallbackProps = {
  className?: string;
};

function ChipSvgFallback({ className = "" }: ChipSvgFallbackProps) {
  return (
    <img
      src="/magnum-chip.svg"
      alt="Фирменная фишка MAGNUM"
      className={`h-full w-full object-contain ${className}`}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const chipPositionRef = useRef<HTMLDivElement>(null);
  const bgSpadeRef = useRef<HTMLDivElement>(null);
  const [chip3DReady, setChip3DReady] = useState(false);
  const [chip3DError, setChip3DError] = useState(false);
  const [isChipDebug, setIsChipDebug] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsChipDebug(
        new URLSearchParams(window.location.search).has("chipDebug"),
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

      gsap.to(chipPositionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.68,
        },
        rotationZ: -5,
        x: 20,
        y: -6,
        scale: 0.985,
        force3D: "auto",
      });

      gsap.to(bgSpadeRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 40,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChipReady = () => {
    setChip3DError(false);
    setChip3DReady(true);
  };

  const handleChipError = () => {
    setChip3DReady(false);
    setChip3DError(true);
  };

  const shouldShow3D = chip3DReady && !chip3DError;

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden magnum-wine">
      <div ref={bgSpadeRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.14 }}>
        <Image src="/magnum-bg.svg" alt="Magnum Background" fill className="object-cover object-right" sizes="100vw" />
      </div>

      <div className="w-full relative z-10 flex flex-col md:flex-row items-center pt-[100px] pb-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full md:w-[760px] flex flex-col items-start justify-center relative z-20 md:ml-[clamp(172px,12vw,212px)]">
          <div className="text-muted tracking-widest uppercase text-xs sm:text-sm font-medium mb-8">МОСКВА / СПОРТИВНЫЙ ПОКЕР</div>
          <h1 className="font-display font-bold text-white mb-10 uppercase" style={{ fontSize: "clamp(64px, 6.5vw, 118px)", lineHeight: 0.88, letterSpacing: "-0.055em" }}>
            КЛУБ<br />
            СПОРТИВНОГО<br />
            ПОКЕРА
          </h1>
          <div className="flex items-center gap-4 mb-6 w-full">
            <span className="text-warm-white font-medium uppercase whitespace-nowrap" style={{ fontSize: "clamp(18px, 1.8vw, 28px)" }}>Не на деньги</span>
            <div className="h-[2px] flex-grow max-w-[80px] bg-[#7D0B29]" />
          </div>
          <div className="text-muted tracking-widest uppercase text-sm sm:text-base font-medium mb-12">{siteConfig.city}</div>
          <div className="mt-4">
            <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center py-3 border-b border-[rgba(241,239,233,0.55)] text-warm-white hover:border-warm-white text-base sm:text-lg font-bold tracking-widest uppercase transition-colors duration-300">Записаться ↗</a>
          </div>
        </div>

        <div ref={chipPositionRef} className="chip-scene relative md:absolute z-10 mt-16 md:mt-0 w-[min(82vw,340px)] md:w-[clamp(420px,31vw,560px)] md:right-[5vw] md:top-[51%] md:-translate-y-1/2 right-auto" style={{ aspectRatio: "1 / 1", perspective: "900px" }}>
          {isChipDebug ? (
            <div data-chip-debug className="grid h-full w-full grid-cols-2 gap-3">
              <div className="min-w-0"><ChipSvgFallback /></div>
              <div className="relative min-w-0">
                <MagnumChip3D onReady={handleChipReady} onError={handleChipError} />
              </div>
            </div>
          ) : (
            <>
              <ChipSvgFallback className={`absolute inset-0 transition-opacity duration-[360ms] ${shouldShow3D ? "opacity-0" : "opacity-100"}`} />
              <div className={`absolute inset-0 transition-opacity duration-[360ms] ${shouldShow3D ? "opacity-100" : "opacity-0"}`}>
                <MagnumChip3D onReady={handleChipReady} onError={handleChipError} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/config/site";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const chipScrollRef = useRef<HTMLDivElement>(null);
  const chipInteractiveRef = useRef<HTMLButtonElement>(null);
  const bgSpadeRef = useRef<HTMLDivElement>(null);
  const chipAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const chipIsAnimatingRef = useRef(false);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (
      chipIsAnimatingRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(chipInteractiveRef.current, {
      rotateY: x * 8,
      rotateX: -y * 6,
      x: x * 6,
      y: y * 6,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handlePointerLeave = () => {
    if (chipIsAnimatingRef.current) return;
    gsap.to(chipInteractiveRef.current, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleChipClick = () => {
    if (!chipInteractiveRef.current || chipIsAnimatingRef.current) return;
    chipIsAnimatingRef.current = true;

    const finish = () => {
      chipIsAnimatingRef.current = false;
      chipAnimationRef.current = null;
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    chipAnimationRef.current = gsap.timeline({ onComplete: finish });
    if (reducedMotion) {
      chipAnimationRef.current
        .to(chipInteractiveRef.current, { scale: 1.04, duration: 0.18, ease: "power2.out" })
        .to(chipInteractiveRef.current, { scale: 1, duration: 0.22, ease: "power2.inOut" });
      return;
    }

    chipAnimationRef.current
      .to(chipInteractiveRef.current, {
        y: -65,
        scale: 1.05,
        rotateZ: 16,
        rotateY: 180,
        duration: 0.22,
        ease: "power2.out",
      })
      .to(chipInteractiveRef.current, {
        y: -78,
        rotateY: 360,
        rotateZ: -8,
        duration: 0.2,
        ease: "none",
      })
      .to(chipInteractiveRef.current, {
        y: 0,
        rotateY: 720,
        rotateZ: 0,
        scale: 1,
        duration: 0.48,
        ease: "bounce.out",
      });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(chipScrollRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
          rotateZ: 8,
          x: "3vw",
          y: -10,
          scale: 0.97,
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
      }
    }, sectionRef);

    return () => {
      chipAnimationRef.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden magnum-wine">
      {/* Background Spade */}
      <div 
        ref={bgSpadeRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.14 }}
      >
        <Image
          src="/magnum-bg.svg"
          alt="Magnum Background"
          fill
          className="object-cover object-right"
          sizes="100vw"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full relative z-10 flex flex-col md:flex-row items-center pt-[100px] pb-12">
        
        {/* Left text */}
        <div className="w-full md:w-[64%] flex flex-col items-start justify-center relative z-20">
          <div className="text-muted tracking-widest uppercase text-xs sm:text-sm font-medium mb-8">
            МОСКВА / СПОРТИВНЫЙ ПОКЕР
          </div>
          
          <h1 
            className="font-display font-bold text-white mb-10 uppercase"
            style={{ 
              fontSize: "clamp(64px, 6.5vw, 118px)",
              lineHeight: 0.88,
              letterSpacing: "-0.055em"
            }}
          >
            КЛУБ<br />
            СПОРТИВНОГО<br />
            ПОКЕРА
          </h1>

          <div className="flex items-center gap-4 mb-6 w-full">
            <span className="text-warm-white font-medium uppercase whitespace-nowrap" style={{ fontSize: "clamp(18px, 1.8vw, 28px)" }}>
              Не на деньги
            </span>
            <div className="h-[2px] flex-grow max-w-[80px] bg-[#7D0B29]"></div>
          </div>
          
          <div className="text-muted tracking-widest uppercase text-sm sm:text-base font-medium mb-12">
            {siteConfig.city}
          </div>
          
          <div className="mt-4">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 border-b border-[rgba(241,239,233,0.55)] text-warm-white hover:border-warm-white text-base sm:text-lg font-bold tracking-widest uppercase transition-all duration-300"
            >
              Записаться ↗
            </a>
          </div>
        </div>

        {/* Outer scroll wrapper; inner wrapper owns pointer and click transforms. */}
        <div
          ref={chipScrollRef}
          className="relative md:absolute z-10 mt-16 md:mt-0 right-auto md:right-[-2vw] min-[1200px]:right-[2vw] top-auto md:top-[52%] md:-translate-y-1/2 w-[min(82vw,340px)] md:w-[clamp(340px,36vw,480px)] min-[1200px]:w-[clamp(380px,29vw,520px)]"
          style={{ aspectRatio: "1 / 1", perspective: "900px" }}
        >
          <button
            ref={chipInteractiveRef}
            type="button"
            aria-label="Подбросить фишку MAGNUM"
            className="hero-chip-interactive relative block w-full h-full cursor-pointer"
            onClick={handleChipClick}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <span className="chip-face chip-face--front">
              <Image
                src="/magnum-chip.svg"
                alt="Magnum Chip"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 82vw, 520px"
                priority
              />
            </span>
            <span className="chip-face chip-face--back" aria-hidden="true">
              <Image
                src="/magnum-chip.svg"
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 82vw, 520px"
                priority
              />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

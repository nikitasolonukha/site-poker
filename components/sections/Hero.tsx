"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/config/site";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const bgSpadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Mouse move tilt effect for desktop
      const handleMouseMove = (e: MouseEvent) => {
        if (!chipRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;
        
        gsap.to(chipRef.current, {
          rotateY: xPos * 5,
          rotateX: -yPos * 3,
          x: xPos * 8,
          y: yPos * 8,
          duration: 0.7,
          ease: "power3.out",
        });
      };
      
      window.addEventListener("mousemove", handleMouseMove);

      // Scroll animations
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(chipRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
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

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, sectionRef);

    return () => ctx.revert();
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

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full relative z-10 flex flex-col md:flex-row items-center justify-between pt-[100px] pb-12">
        
        {/* Left text */}
        <div className="w-full md:max-w-[45%] lg:max-w-[40%] flex flex-col items-start justify-center relative z-20">
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

        {/* Right Chip */}
        <div 
          ref={chipRef} 
          className="relative md:absolute flex items-center justify-center transform-style-3d z-10 mt-16 md:mt-0 right-auto md:right-[-4vw] lg:right-[-6vw] top-auto md:top-[50%] md:-translate-y-1/2"
          style={{
            width: "clamp(280px, 42vw, 680px)",
            aspectRatio: "1/1",
            filter: "drop-shadow(0 35px 60px rgba(0,0,0,0.45))",
          }}
        >
          <Image
            src="/magnum-chip.svg"
            alt="Magnum Chip"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}

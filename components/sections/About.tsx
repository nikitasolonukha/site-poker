"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        if (!videoContainerRef.current || !textRef.current || !labelRef.current) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            videoContainerRef.current,
            {
              width: "43vw",
              height: "56vh",
              x: "22vw",
              borderRadius: "2px",
            },
            {
              width: () => Math.min(window.innerWidth * 0.92, 1500),
              height: "82vh",
              x: 0,
              borderRadius: "4px",
              ease: "power2.inOut",
            },
            0,
          )
          .to(
            textRef.current,
            {
              opacity: 0,
              y: -30,
              ease: "power2.inOut",
            },
            0,
          )
          .fromTo(
            labelRef.current,
            { opacity: 0 },
            { opacity: 1, ease: "power2.inOut" },
            0.45,
          );
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#08090B] overflow-hidden md:h-[180svh]"
    >
      <div className="sticky-about relative min-h-[100svh] md:sticky md:top-0 md:h-[100svh] md:min-h-0 overflow-hidden">
        <div
          ref={labelRef}
          className="hidden md:flex absolute top-[10vh] left-6 lg:left-12 z-30 flex-col text-white mix-blend-difference"
          style={{ opacity: 0 }}
        >
          <div className="text-xs tracking-widest font-bold uppercase mb-1">
            MAGNUM / LIVE
          </div>
          <div className="text-[10px] tracking-widest uppercase opacity-70">
            СПОРТИВНЫЙ ПОКЕР<br />МОСКВА
          </div>
        </div>

        <div
          ref={textRef}
          className="relative z-20 w-full px-4 sm:px-6 pt-24 pb-10 md:absolute md:left-[max(24px,calc((100vw-1440px)/2+48px))] md:top-1/2 md:-translate-y-1/2 md:w-[43vw] md:p-0"
        >
          <div className="text-muted tracking-widest uppercase text-sm font-bold mb-8">
            О клубе
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-warm-white leading-[1.1] tracking-tight text-balance">
            Не казино.<br />
            Не про деньги.<br />
            <span className="text-[#7D0B29]">Про игру.</span>
          </h2>
          <p className="mt-8 text-muted text-base leading-relaxed text-pretty md:hidden">
            MAGNUM — клуб спортивного покера в Москве для тех, кто ценит
            интеллектуальное противостояние, сервис и атмосферу настоящей игры.
          </p>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 pb-16 md:absolute md:inset-0 md:p-0 md:pointer-events-none">
          <div
            ref={videoContainerRef}
            className="relative mx-auto aspect-video w-full overflow-hidden rounded-[2px] bg-[#14070A] md:absolute md:left-1/2 md:top-1/2 md:mx-0 md:aspect-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-[43vw] md:h-[56vh] md:pointer-events-auto"
          >
            <video
              src="/magnum-live.mp4"
              poster="/gallery/image-3.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 border border-white/10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}


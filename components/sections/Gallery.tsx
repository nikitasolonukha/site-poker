"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gallery } from "@/data/gallery";

gsap.registerPlugin(ScrollTrigger);

const deckX = [-20, 14, -8, 24, -14, 6, 2, -10];
const deckY = [18, -10, 26, 8, -14, 20, 12, -6];
const deckRotation = [-6, 4, -2, 7, -5, 3, -1, 5];
const deckScale = [0.86, 0.9, 0.87, 0.92, 0.88, 0.94, 0.9, 0.89];
const scatterX = [-46, 30, -18, 44, -24, 16, 34, 18];
const scatterY = [30, -6, 38, 16, -22, 8, 24, -14];
const scatterRotation = [-4, 3, -5, 9, -3, 4, 6, -2];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const loadedImagesRef = useRef(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = imagesRef.current.filter(Boolean) as HTMLDivElement[];
        if (!sectionRef.current || items.length === 0) return;

        items.forEach((item, index) => {
          const i = Math.min(index, deckX.length - 1);
          gsap.set(item, {
            x: deckX[i],
            y: deckY[i],
            rotation: deckRotation[i],
            scale: deckScale[i],
            opacity: 0.16,
            clipPath: "inset(20% 16% 20% 16%)",
            transformOrigin: "center",
            zIndex: gallery.length - index,
          });
        });

        const revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 38%",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        revealTimeline.to(items, {
          opacity: 0.92,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.58,
          stagger: 0.08,
          ease: "power2.out",
        });

        const scrub = 0.72;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((item, index) => {
          const i = Math.min(index, deckX.length - 1);
          timeline
            .to(
              item,
              {
                x: scatterX[i],
                y: scatterY[i],
                rotation: scatterRotation[i],
                scale: 0.92,
                opacity: 0.96,
                zIndex: 10,
                ease: "power2.out",
                duration: 0.45,
              },
              0,
            )
            .to(
              item,
              {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
                zIndex: 1,
                ease: "power2.inOut",
                duration: 0.55,
              },
              0.45,
            );
        });

        return () => {
          revealTimeline.kill();
          timeline.kill();
        };
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const handleImageLoad = () => {
    loadedImagesRef.current += 1;
    if (loadedImagesRef.current >= gallery.length) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-[#08090B] text-warm-white md:h-[220svh]"
    >
      <div className="gallery-sticky relative min-h-[100svh] overflow-hidden md:sticky md:top-0 md:h-[100svh]">
        <div className="relative z-20 mx-auto flex w-full max-w-[1440px] items-end justify-between px-4 pt-24 sm:px-6 lg:px-12 md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2">
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight">
            Галерея
          </h2>
          <span className="text-muted text-sm md:text-base tracking-widest uppercase font-bold tabular-nums">
            08 ФОТО
          </span>
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[140px] sm:px-6 lg:px-12 md:absolute md:inset-x-0 md:top-[180px] md:h-[calc(100svh-280px)] md:p-0 md:px-12">
          <div className="grid grid-cols-1 gap-4 md:h-full md:grid-cols-4 md:grid-rows-2 md:gap-5">
            {gallery.map((item, index) => (
              <div
                key={item.id}
                ref={(element) => {
                  imagesRef.current[index] = element;
                }}
                className="group relative min-h-[280px] overflow-hidden rounded-[2px] bg-[#14070A] transform-gpu md:min-h-0"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={index < 4}
                  onLoad={handleImageLoad}
                  className="object-cover outline outline-1 -outline-offset-1 outline-white/10 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  sizes="(max-width: 767px) 100vw, 25vw"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 to-transparent p-5 opacity-75 transition-opacity duration-200 md:opacity-60 md:group-hover:opacity-100">
                  <p className="text-warm-white font-sans text-[12px] tracking-widest whitespace-pre-line leading-[1.4] uppercase font-bold">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

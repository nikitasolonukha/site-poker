"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gallery } from "@/data/gallery";

gsap.registerPlugin(ScrollTrigger);

const deckX = [0, -10, 14, -18, 20, -5, 11, -14];
const deckY = [0, 7, -5, 10, -8, 3, -11, 6];
const deckRotation = [-5, 3, -2, 6, -4, 2, -3, 4];
const deckScale = [0.88, 0.84, 0.86, 0.82, 0.87, 0.85, 0.83, 0.88];
const scatterX = [-180, -90, 40, 150, -140, 95, -35, 175];
const scatterY = [-90, 70, -120, 25, 115, -55, 90, -105];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const loadedImagesRef = useRef(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const items = imagesRef.current.filter(Boolean) as HTMLDivElement[];
          if (!gridRef.current || items.length === 0) return;

          const deckPosition = (item: HTMLDivElement, index: number) => {
            const rect = item.getBoundingClientRect();
            const targetX = window.innerWidth - window.innerWidth * 0.08 - rect.width / 2;
            const targetY = window.innerHeight - window.innerHeight * 0.08 - rect.height / 2;
            return {
              x: targetX - (rect.left + rect.width / 2) + deckX[index],
              y: targetY - (rect.top + rect.height / 2) + deckY[index],
            };
          };

          items.forEach((item, index) => {
            const position = deckPosition(item, index);
            gsap.set(item, {
              x: position.x,
              y: position.y,
              rotation: deckRotation[index],
              scale: deckScale[index],
              opacity: 0.88,
              zIndex: gallery.length - index,
              transformOrigin: "center",
            });
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          });

          items.forEach((item, index) => {
            const position = deckPosition(item, index);
            timeline
              .to(
                item,
                {
                  x: position.x * 0.42 + scatterX[index],
                  y: position.y * 0.38 + scatterY[index],
                  rotation: deckRotation[index] * 0.45,
                  scale: 0.92,
                  opacity: 0.94,
                  ease: "power1.inOut",
                  duration: 0.4,
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
                  duration: 0.6,
                },
                0.4,
              );
          });

          return () => timeline.kill();
        },
      );
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

        <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-12 sm:px-6 lg:px-12 md:absolute md:inset-x-0 md:bottom-8 md:top-[180px] md:p-0 md:px-12">
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-4 md:h-full md:grid-cols-4 md:grid-rows-2 md:gap-5"
          >
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


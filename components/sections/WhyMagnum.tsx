"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyFeatures } from "@/data/why";

gsap.registerPlugin(ScrollTrigger);

const rotations = [-1.2, 0.8, -0.6];

export default function WhyMagnum() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card || index === cardsRef.current.length - 1) return;

        gsap.to(card, {
          scale: 0.975,
          rotateZ: rotations[index],
          opacity: 0.82,
          ease: "none",
          scrollTrigger: {
            trigger: cardsRef.current[index + 1],
            start: "top bottom",
            end: "top 15vh",
            scrub: 0.6,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={containerRef} className="magnum-paper relative pb-32">
      <div className="pt-24 pb-12 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-black text-balance">
          Почему<br />Magnum
        </h2>
      </div>

      <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        {whyFeatures.map((feature, index) => (
          <div
            key={feature.id}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            className="sticky top-[15vh] w-full min-h-[70vh] flex flex-col justify-center mb-[10vh] origin-top"
          >
            <div className="bg-[#F1EFE9] border border-[rgba(8,9,11,0.12)] rounded-[2px] p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 w-full min-h-[60vh] transform-gpu">
              <div className="w-full md:w-[45%] flex flex-col justify-between order-2 md:order-1">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-display text-burgundy text-xl font-bold tabular-nums">
                    0{index + 1}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-black opacity-20"
                  >
                    <path d="M12 2 2 15s0 5 4 5c3.5 0 6-3 6-3s2.5 3 6 3c4 0 4-5 4-5L12 2Z" fill="currentColor" />
                  </svg>
                </div>

                <div className="my-auto">
                  <h3 className="font-display text-3xl md:text-5xl font-bold uppercase mb-6 text-black leading-[0.9] text-balance">
                    {feature.title}
                  </h3>
                  <p className="text-black/75 text-base md:text-lg leading-relaxed max-w-sm whitespace-pre-line font-medium text-pretty">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-[55%] relative aspect-[4/3] md:aspect-auto bg-[#E3DED6] overflow-hidden order-1 md:order-2 border border-black/[0.06] rounded-[2px]">
                {feature.media === null ? (
                  <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                    <Image
                      src="/magnum-bg.svg"
                      alt=""
                      fill
                      className="object-cover opacity-[0.08]"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                    <span className="relative z-10 font-display text-sm font-bold tracking-[0.18em] text-black/35">
                      MAGNUM
                    </span>
                    <span className="relative z-10 self-end font-display text-[clamp(72px,10vw,150px)] font-bold leading-none text-black/[0.09] tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={feature.media}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


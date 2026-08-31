"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyFeatures } from "@/data/why";

gsap.registerPlugin(ScrollTrigger);

const cardSurfaceClasses = ["bg-[#11090B]", "bg-[#18090D]", "bg-[#21070F]"];

const stackedStates = [
  { y: -28, scale: 0.955, rotation: -0.8, opacity: 0.72 },
  { y: -14, scale: 0.978, rotation: 0.45, opacity: 0.86 },
];

export default function WhyMagnum() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add("(min-width: 768px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const cards = cardsRef.current.filter(
          (card): card is HTMLElement => card !== null,
        );
        const surfaces = cards.map((card) =>
          card.querySelector<HTMLElement>("[data-why-card]"),
        );

        surfaces.forEach((surface, index) => {
          if (!surface) return;
          gsap.set(cards[index], { zIndex: index + 1 });

          if (index === 0) {
            gsap.set(surface, { y: 0, scale: 1, rotation: 0, opacity: 1 });
            return;
          }

          gsap.set(surface, {
            y: "52vh",
            scale: 0.985,
            rotation: 0,
            opacity: 1,
          });
        });

        surfaces.forEach((surface, index) => {
          if (!surface || index === 0) return;

          const previousSurface = surfaces[index - 1];
          const trigger = cards[index];
          if (!previousSurface || !trigger) return;

          gsap.to(surface, {
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top 88%",
              end: "top 13%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          gsap.to(previousSurface, {
            ...stackedStates[index - 1],
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top 88%",
              end: "top 13%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
        });
      });
    }, containerRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="why"
      ref={containerRef}
      aria-labelledby="why-title"
      className="relative overflow-hidden pb-16 md:pb-[26vh]"
      style={{
        background:
          "radial-gradient(circle at 72% 25%, rgba(125, 11, 41, 0.22), transparent 38%), linear-gradient(180deg, #08090B 0%, #13070A 48%, #21060C 100%)",
      }}
    >
      <div className="relative z-10 mx-auto w-[92vw] max-w-[1600px] pb-12 pt-24 md:w-[82vw]">
        <h2
          id="why-title"
          className="font-display font-bold uppercase text-[#F1EFE9] text-balance"
          style={{ fontSize: "clamp(54px, 6vw, 96px)", lineHeight: 0.88 }}
        >
          Почему<br />Magnum
        </h2>
      </div>

      <div className="relative z-10 space-y-6 md:space-y-0">
        {whyFeatures.map((feature, index) => (
          <article
            key={feature.id}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            className={[
              "relative mx-auto flex w-[92vw] min-h-[62svh] flex-col justify-center md:sticky md:top-[13vh] md:w-[82vw] md:min-h-[66svh] md:origin-top",
              index === whyFeatures.length - 1 ? "md:mb-0" : "md:mb-[18vh]",
            ].join(" ")}
          >
            <div
              data-why-card
              className={[
                cardSurfaceClasses[index] ?? cardSurfaceClasses[0],
                "flex min-h-[62svh] w-full transform-gpu flex-col gap-8 rounded-[2px] border border-[rgba(241,239,233,0.10)] p-6 will-change-transform motion-reduce:transform-none md:min-h-[66svh] md:flex-row md:gap-12 md:p-10",
              ].join(" ")}
            >
              <div className="order-2 flex w-full flex-col justify-between md:order-1 md:w-[42%]">
                <div className="mb-12 flex items-start justify-between">
                  <span className="font-display text-xl font-bold tabular-nums text-[#B22554]">
                    0{index + 1}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-[#F1EFE9]/35"
                  >
                    <path d="M12 2 2 15s0 5 4 5c3.5 0 6-3 6-3s2.5 3 6 3c4 0 4-5 4-5L12 2Z" fill="currentColor" />
                  </svg>
                </div>

                <div className="my-auto">
                  <h3 className="font-display mb-6 text-3xl font-bold uppercase leading-[0.9] text-[#F1EFE9] text-balance md:text-5xl">
                    {feature.title}
                  </h3>
                  <p className="max-w-sm whitespace-pre-line text-base font-medium leading-relaxed text-[rgba(241,239,233,0.68)] text-pretty md:text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-[rgba(241,239,233,0.07)] bg-[#08090B] md:order-2 md:aspect-auto md:w-[58%]">
                {feature.media === null ? (
                  <div
                    className="absolute inset-0 flex flex-col justify-between p-6 md:p-8"
                    style={{
                      background:
                        "radial-gradient(circle at 65% 35%, rgba(125,11,41,.26), transparent 42%), #0D090B",
                    }}
                  >
                    <Image
                      src="/magnum-bg.svg"
                      alt=""
                      aria-hidden="true"
                      fill
                      className="object-cover opacity-[0.06]"
                      sizes="(max-width: 768px) 92vw, 58vw"
                    />
                    <span className="relative z-10 font-display text-sm font-bold tracking-[0.18em] text-[rgba(241,239,233,0.42)]">
                      MAGNUM
                    </span>
                    <span className="relative z-10 self-end font-display text-[clamp(72px,10vw,150px)] font-bold leading-none tabular-nums text-[rgba(241,239,233,0.08)]">
                      0{index + 1}
                    </span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={feature.media}
                      alt={feature.title}
                      fill
                      className="object-cover contrast-[1.04] saturate-[0.92]"
                      sizes="(max-width: 768px) 92vw, 58vw"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(rgba(38, 5, 12, 0.06), rgba(8, 9, 11, 0.12))",
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
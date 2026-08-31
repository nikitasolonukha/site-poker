"use client";

import Image from "next/image";
import gsap from "gsap";
import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { reviews } from "../../data/reviews";

const reviewChips = [
  { src: "/poker-kit/chip-100.png", alt: "Фишка 100" },
  { src: "/poker-kit/chip-500.png", alt: "Фишка 500" },
  { src: "/poker-kit/chip-1k.png", alt: "Фишка 1K" },
] as const;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const outgoingTweenRef = useRef<gsap.core.Tween | null>(null);
  const incomingTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const activeReview = reviews[activeIndex];

  useEffect(() => {
    return () => {
      outgoingTweenRef.current?.kill();
      incomingTimelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const content = contentRef.current;
    const details = detailsRef.current;

    if (!content || !details || prefersReducedMotion()) {
      gsap.set([content, details].filter(Boolean), { opacity: 1, y: 0 });
      isTransitioningRef.current = false;
      return;
    }

    incomingTimelineRef.current?.kill();
    const timeline = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
      },
    });

    timeline.set(details, { opacity: 0, y: 6 });
    timeline.fromTo(
      content,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
    );
    timeline.to(
      details,
      { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" },
      "+=0.06",
    );

    incomingTimelineRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [activeIndex]);

  const selectReview = (nextIndex: number) => {
    if (
      nextIndex === activeIndex ||
      isTransitioningRef.current ||
      nextIndex < 0 ||
      nextIndex >= reviews.length
    ) {
      return;
    }

    if (prefersReducedMotion() || !contentRef.current) {
      setActiveIndex(nextIndex);
      return;
    }

    isTransitioningRef.current = true;
    outgoingTweenRef.current?.kill();
    outgoingTweenRef.current = gsap.to(contentRef.current, {
      opacity: 0,
      y: -12,
      duration: 0.22,
      ease: "power3.out",
      onComplete: () => setActiveIndex(nextIndex),
    });
  };

  const handleNavigationKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (activeIndex + direction + reviews.length) % reviews.length;
    selectReview(nextIndex);
  };

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative isolate overflow-hidden text-[#F1EFE9]"
      style={{
        background:
          "radial-gradient(circle at 72% 30%, rgba(125,11,41,.20), transparent 40%), #08090B",
      }}
    >
      <Image
        src="/magnum-bg.svg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none -z-10 object-cover opacity-[0.035] md:hidden"
      />

      <div className="mx-auto flex min-h-[720px] max-w-[1280px] flex-col px-5 py-20 md:min-h-[80svh] md:px-10 md:py-16 lg:px-14">
        <header className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/10 pb-5 text-[10px] font-bold tracking-[0.18em] text-[#B9B4B5] sm:text-[11px]">
          <h2 id="reviews-title" className="text-[#F1EFE9]">
            ОТЗЫВЫ
          </h2>
          <span>ЯНДЕКС КАРТЫ</span>
          <span className="text-[#D8C3CA]">4.7 ★</span>
          <span>17 ОТЗЫВОВ</span>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 md:grid-cols-[minmax(0,65fr)_minmax(250px,35fr)] md:gap-8 lg:py-16">
          <div className="max-w-[820px]">
            <div ref={contentRef} aria-live="polite" aria-atomic="true">
              <p
                aria-hidden="true"
                className="mb-5 font-display text-[12px] font-bold tracking-[0.24em] text-[#B22554]"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </p>

              <blockquote>
                <p className="font-display text-[clamp(2rem,4.8vw,4.875rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[#F1EFE9]">
                  {activeReview.quote}
                </p>
              </blockquote>

              <div ref={detailsRef} className="mt-9 max-w-[560px]">
                <p className="text-[11px] font-bold tracking-[0.16em] text-[#F1EFE9] sm:text-xs">
                  {activeReview.author.toUpperCase()}
                </p>
                <a
                  href={activeReview.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-[#C9A6B1] transition-colors hover:text-[#F1EFE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554] sm:text-[11px]"
                >
                  <span className="uppercase">{activeReview.source}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <p className="mt-4 max-w-[500px] text-sm leading-relaxed text-[#B9B4B5] sm:text-base">
                  {activeReview.summary}
                </p>
              </div>
            </div>
          </div>

          <aside
            aria-hidden="true"
            className="relative hidden min-h-[360px] overflow-hidden border-l border-white/10 pl-8 md:flex md:flex-col md:justify-end lg:pl-12"
          >
            <Image
              src="/magnum-bg.svg"
              alt=""
              fill
              sizes="35vw"
              className="object-cover object-center opacity-[0.07]"
            />
            <div className="relative z-10 pb-2">
              <p className="font-display text-[clamp(5rem,10vw,9rem)] leading-none tracking-[-0.08em] text-[#F1EFE9]/90">
                {String(activeIndex + 1).padStart(2, "0")}
              </p>
              <p className="mt-5 text-[10px] font-bold tracking-[0.22em] text-[#B9B4B5]">
                MAGNUM / 4.7★
              </p>
              <p className="mt-2 text-[10px] tracking-[0.16em] text-[#7E7376]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
              </p>
            </div>
          </aside>
        </div>

        <nav
          aria-label="Навигация по отзывам"
          onKeyDown={handleNavigationKey}
          className="flex items-center justify-between gap-6 border-t border-white/10 pt-5"
        >
          <div className="flex items-center gap-3">
            {reviews.map((review, index) => {
              const isActive = activeIndex === index;
              const chip = reviewChips[index];

              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => selectReview(index)}
                  aria-label={`Показать отзыв ${review.author}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className="grid min-h-11 min-w-11 place-items-center rounded-full outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[#B22554] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090B]"
                >
                  <Image
                    src={chip.src}
                    alt=""
                    aria-hidden="true"
                    width={44}
                    height={44}
                    sizes="(max-width: 640px) 40px, 44px"
                    className={`h-10 w-10 object-contain transition-[opacity,transform] duration-200 ease-out sm:h-11 sm:w-11 ${
                      isActive
                        ? "-translate-y-1 scale-100 opacity-100"
                        : "translate-y-0 scale-[.86] opacity-40 hover:-translate-y-0.5 hover:opacity-75"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-[11px] font-bold tracking-[0.18em] text-[#B9B4B5]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
          </p>
        </nav>
      </div>
    </section>
  );
}
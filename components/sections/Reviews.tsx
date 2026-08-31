"use client";

import Image from "next/image";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { reviews } from "../../data/reviews";

const REVIEWS_URL = "https://yandex.ru/maps/-/CTTRFVMQ";
const DISPLAYED_REVIEW_COUNT = 17;
const DRAG_THRESHOLD = 52;

type SlidePosition = "active" | "next" | "previous" | "hidden-next" | "hidden-previous";

type DragState = {
  pointerId: number;
  startX: number;
  lastX: number;
  lastTime: number;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const formatNumber = (value: number) => String(value).padStart(2, "0");

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressChipRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef(new Map<string, HTMLElement>());
  const dragRef = useRef<DragState | null>(null);

  const setSlideRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      slideRefs.current.set(id, node);
      return;
    }

    slideRefs.current.delete(id);
  }, []);

  const getSlidePosition = useCallback(
    (index: number): SlidePosition => {
      if (index === activeIndex) return "active";
      if (index === activeIndex + 1) return "next";
      if (index === activeIndex - 1) return "previous";
      return index > activeIndex ? "hidden-next" : "hidden-previous";
    },
    [activeIndex],
  );

  const moveProgressChip = useCallback(
    (animated: boolean) => {
      const line = progressLineRef.current;
      const chip = progressChipRef.current;
      if (!line || !chip) return;

      const progress = reviews.length > 1 ? activeIndex / (reviews.length - 1) : 0;
      const travel = Math.max(line.clientWidth - chip.offsetWidth, 0);
      gsap.to(chip, {
        x: travel * progress,
        duration: animated && !prefersReducedMotion() ? 0.72 : 0,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    [activeIndex],
  );

  useLayoutEffect(() => {
    const isDesktop =
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(min-width: 768px)").matches;
    const step = isDesktop ? 112 : 93;

    reviews.forEach((review, index) => {
      const slide = slideRefs.current.get(review.id);
      if (!slide) return;

      const position = getSlidePosition(index);
      const motion = {
        active: { xPercent: 0, opacity: 1, scale: 1, zIndex: 3 },
        next: { xPercent: step, opacity: 0.42, scale: 0.94, zIndex: 2 },
        previous: { xPercent: -step, opacity: 0.15, scale: 0.94, zIndex: 1 },
        "hidden-next": { xPercent: step * 2.15, opacity: 0, scale: 0.92, zIndex: 0 },
        "hidden-previous": { xPercent: -step * 2.15, opacity: 0, scale: 0.92, zIndex: 0 },
      }[position];

      gsap.to(slide, {
        ...motion,
        duration: prefersReducedMotion() ? 0 : 0.72,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });

    moveProgressChip(activeIndex !== 0);
  }, [activeIndex, getSlidePosition, moveProgressChip]);

  useEffect(() => {
    const line = progressLineRef.current;
    if (!line) return;

    const onResize = () => moveProgressChip(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveProgressChip]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const heading = section.querySelector<HTMLElement>("[data-reviews-heading]");
        const stats = section.querySelector<HTMLElement>("[data-reviews-stats]");
        const activeSlide = section.querySelector<HTMLElement>('[data-position="active"]');
        const nextSlide = section.querySelector<HTMLElement>('[data-position="next"]');
        const timeline = gsap.timeline({ defaults: { ease: "power3.inOut", overwrite: "auto" } });

        timeline
          .fromTo([heading, stats], { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.76, stagger: 0.06 })
          .fromTo(activeSlide, { y: 24, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.8 }, "<0.08")
          .fromTo(nextSlide, { x: 40, opacity: 0 }, { x: 0, opacity: 0.42, duration: 0.78 }, "<0.05");

        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    setActiveIndex((currentIndex) => {
      const targetIndex = Math.min(Math.max(nextIndex, 0), reviews.length - 1);
      return targetIndex === currentIndex ? currentIndex : targetIndex;
    });
  }, []);

  const resetTrack = () => {
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: 0,
        duration: prefersReducedMotion() ? 0 : 0.24,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (progressChipRef.current) {
      gsap.to(progressChipRef.current, {
        rotation: 0,
        duration: prefersReducedMotion() ? 0 : 0.24,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    dragRef.current = null;
    setIsDragging(false);
    resetTrack();

    if (Math.abs(distance) < DRAG_THRESHOLD) return;
    goTo(distance < 0 ? activeIndex + 1 : activeIndex - 1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: event.timeStamp,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    if (trackRef.current) {
      gsap.killTweensOf(trackRef.current);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = clamp(event.clientX - drag.startX, -140, 140);
    const elapsed = Math.max(event.timeStamp - drag.lastTime, 1);
    const velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;

    if (trackRef.current) {
      gsap.set(trackRef.current, { x: distance });
    }

    if (progressChipRef.current) {
      gsap.set(progressChipRef.current, { rotation: clamp(velocity * 7, -10, 10) });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  if (!reviews.length) return null;

  return (
    <section
      ref={sectionRef}
      id="reviews"
      aria-labelledby="reviews-title"
      className="min-h-[80svh] overflow-hidden bg-[#08090B] text-[#F1EFE9]"
      style={{
        background:
          "radial-gradient(circle at 82% 30%, rgba(125, 11, 41, .16), transparent 42%), #08090B",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-[5vw] md:pb-[100px] md:pt-[110px]">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2
            id="reviews-title"
            data-reviews-heading
            className="font-display text-[clamp(3.5rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[#F1EFE9]"
          >
            ОТЗЫВЫ
          </h2>

          <div
            data-reviews-stats
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold tracking-[0.1em] text-[#F1EFE9]/58 sm:text-xs md:flex-nowrap md:gap-x-5"
          >
            <span className="text-[#F1EFE9]">4.7 ★</span>
            <span>27 ОЦЕНОК</span>
            <span>17 ОТЗЫВОВ</span>
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554] md:opacity-70"
            >
              ЯНДЕКС КАРТЫ ↗
            </a>
          </div>
        </header>

        <div
          ref={sliderRef}
          id="reviews-track"
          data-testid="reviews-slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Отзывы гостей"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className="relative mt-20 h-[440px] touch-pan-y select-none overflow-visible outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#B22554] md:mt-[84px] md:h-[450px] lg:h-[470px]"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div ref={trackRef} className="relative h-full will-change-transform">
            {reviews.map((review, index) => {
              const position = getSlidePosition(index);
              const isActive = position === "active";

              return (
                <article
                  key={review.id}
                  ref={(node) => setSlideRef(review.id, node)}
                  data-testid={`review-slide-${review.id}`}
                  data-review-slide
                  data-position={position}
                  aria-current={isActive ? "true" : undefined}
                  aria-hidden={!isActive}
                  className="absolute left-0 top-0 flex h-full w-[86vw] origin-left flex-col pr-3 will-change-transform sm:w-[82vw] md:w-[68%] md:pr-6"
                >
                  <span className="text-[12px] font-semibold tracking-[0.16em] text-[#F1EFE9]/48">
                    {formatNumber(index + 1)} / {formatNumber(DISPLAYED_REVIEW_COUNT)}
                  </span>

                  <blockquote className="mt-7 md:mt-8">
                    <p className="font-sans text-[clamp(1.875rem,9vw,2.375rem)] font-medium leading-[1.04] tracking-[-0.045em] text-[#F1EFE9] md:text-[clamp(2.375rem,4.4vw,4.25rem)]">
                      {review.quote}
                    </p>
                    {review.body && (
                      <p className="mt-6 max-w-[620px] text-[16px] leading-[1.55] text-[#F1EFE9]/58 md:text-[18px]">
                        {review.body}
                      </p>
                    )}
                  </blockquote>

                  <footer className="mt-auto pt-8">
                    <p className="text-[13px] font-bold tracking-[0.08em] text-[#F1EFE9] md:text-[14px]">
                      {review.author.toUpperCase()}
                    </p>
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isActive ? undefined : -1}
                      className="mt-3 inline-flex text-[11px] font-semibold tracking-[0.1em] text-[#F1EFE9]/46 transition-opacity hover:text-[#F1EFE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554] md:text-xs"
                    >
                      {review.source.toUpperCase()} ↗
                    </a>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-8 border-t border-white/[0.1] pt-6 md:mt-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-5">
            <div className="flex min-w-[220px] items-center gap-3 text-[12px] font-semibold tracking-[0.12em] text-[#F1EFE9]/70 md:min-w-[300px]">
              <span>{formatNumber(activeIndex + 1)}</span>
              <div ref={progressLineRef} className="relative h-[38px] flex-1">
                <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#F1EFE9]/35" />
                <span
                  ref={progressChipRef}
                  data-testid="reviews-progress-chip"
                  className="absolute left-0 top-1/2 z-10 block h-[30px] w-[30px] -translate-y-1/2 md:h-[38px] md:w-[38px]"
                >
                  <Image src="/magnum-chip.svg" alt="" fill sizes="38px" className="object-contain" />
                </span>
              </div>
              <span>{formatNumber(DISPLAYED_REVIEW_COUNT)}</span>
            </div>

            <nav aria-label="Управление отзывами" className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Предыдущий отзыв"
                aria-controls="reviews-track"
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="text-xl leading-none text-[#F1EFE9]/55 transition-opacity hover:text-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                aria-label="Следующий отзыв"
                aria-controls="reviews-track"
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === reviews.length - 1}
                className="text-xl leading-none text-[#F1EFE9]/55 transition-opacity hover:text-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
              >
                <span aria-hidden="true">→</span>
              </button>
              <span className="hidden text-[11px] font-semibold tracking-[0.12em] text-[#F1EFE9]/42 md:inline">
                DRAG / ЛИСТАЙ
              </span>
            </nav>
          </div>

          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit border-b border-[#F1EFE9]/35 pb-1 text-[11px] font-bold tracking-[0.1em] text-[#F1EFE9] transition-[border-color,opacity] hover:border-[#F1EFE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554] md:text-xs"
          >
            СМОТРЕТЬ ВСЕ 17 ОТЗЫВОВ ↗
          </a>
        </div>
      </div>
    </section>
  );
}
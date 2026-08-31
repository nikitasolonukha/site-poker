"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { reviews } from "../../data/reviews";

const REVIEWS_URL = "https://yandex.ru/maps/-/CTTRFVMQ";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const cards = section.querySelectorAll<HTMLElement>("[data-review-card]");
        gsap.fromTo(
          cards,
          { y: 18, opacity: 0.75 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.07,
            ease: "power3.out",
            overwrite: "auto",
          },
        );
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const scrollTrack = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-review-card]");
    if (!track || !card) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  if (!reviews.length) return null;

  return (
    <section
      ref={sectionRef}
      id="reviews"
      aria-labelledby="reviews-title"
      className="overflow-hidden bg-[#08090B] text-[#F1EFE9]"
      style={{
        background:
          "radial-gradient(circle at 80% 20%, rgba(125,11,41,.13), transparent 38%), #08090B",
      }}
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:pt-[110px] md:pb-[120px] lg:px-14">
        <header className="mb-11 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2
            id="reviews-title"
            className="font-display text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-[#F1EFE9] md:text-[clamp(3rem,5vw,4.5rem)]"
          >
            ОТЗЫВЫ
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold tracking-[0.1em] sm:text-sm">
            <span className="text-[#F1EFE9]">4.7 ★</span>
            <span className="text-[#F1EFE9]/55">27 ОЦЕНОК</span>
            <span className="text-[#F1EFE9]/55">17 ОТЗЫВОВ</span>
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[#F1EFE9]/55 transition-colors hover:text-[#F1EFE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
            >
              ЯНДЕКС КАРТЫ ↗
            </a>
          </div>
        </header>

        <ol
          ref={trackRef}
          id="reviews-track"
          aria-label="Отзывы гостей"
          className="grid snap-x snap-mandatory grid-flow-col auto-cols-[86vw] gap-[18px] overflow-x-auto pb-3 pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:auto-cols-[calc((100%-18px)/2)] md:gap-[18px] md:pr-0 lg:auto-cols-[calc((100%-48px)/3)] lg:gap-6"
        >
          {reviews.map((review, index) => (
            <li key={review.id} className="snap-start">
              <article
                data-review-card
                className="flex min-h-[300px] h-full flex-col rounded-[2px] border border-[rgba(241,239,233,.09)] bg-[#11090B] p-[30px] sm:min-h-[320px] sm:p-[34px]"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-[#B22554]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <blockquote className="mt-7">
                  <p className="font-sans text-xl font-medium leading-[1.34] text-[#F1EFE9] sm:text-[22px] lg:text-[26px] lg:leading-[1.3]">
                    {review.quote}
                  </p>
                  {review.body && (
                    <p className="mt-5 text-sm leading-[1.5] text-[#F1EFE9]/55 sm:text-[15px]">
                      {review.body}
                    </p>
                  )}
                </blockquote>

                <footer className="mt-auto pt-8">
                  <p className="text-xs font-bold tracking-[0.14em] text-[#F1EFE9]">
                    {review.author.toUpperCase()}
                  </p>
                  <a
                    href={review.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-[11px] font-semibold tracking-[0.1em] text-[#F1EFE9]/55 transition-colors hover:text-[#F1EFE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
                  >
                    ЯНДЕКС КАРТЫ ↗
                  </a>
                </footer>
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Управление списком отзывов" className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Показать предыдущие отзывы"
              aria-controls="reviews-track"
              onClick={() => scrollTrack(-1)}
              className="grid h-11 w-11 place-items-center border border-white/20 text-lg text-[#F1EFE9] transition-colors hover:border-[#F1EFE9]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label="Показать следующие отзывы"
              aria-controls="reviews-track"
              onClick={() => scrollTrack(1)}
              className="grid h-11 w-11 place-items-center border border-white/20 text-lg text-[#F1EFE9] transition-colors hover:border-[#F1EFE9]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
            >
              <span aria-hidden="true">→</span>
            </button>
            <p className="ml-2 text-xs font-semibold tracking-[0.12em] text-[#F1EFE9]/55">
              <span className="sm:hidden">01 / 17</span>
              <span className="hidden sm:inline">01—03 / 17</span>
            </p>
          </nav>

          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit border-b border-[#F1EFE9]/45 pb-1 text-xs font-bold tracking-[0.1em] text-[#F1EFE9] transition-[border-color,color] duration-150 hover:border-[#F1EFE9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B22554]"
          >
            СМОТРЕТЬ ВСЕ 17 ОТЗЫВОВ ↗
          </a>
        </div>
      </div>
    </section>
  );
}
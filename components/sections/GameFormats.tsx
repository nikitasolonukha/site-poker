"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { formats } from "@/data/formats";
import { siteConfig } from "@/config/site";
import { getCardPresentation } from "./gameFormatsInteraction";

const SELECT_SPACING_MS = 400;
const FLIP_MS = 550;
const SWITCH_REPOSITION_MS = 350;
const SWITCH_FLIP_MS = 700;
const SWITCH_COMPLETE_MS = 1250;

export default function GameFormats() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const schedule = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  };

  const selectCard = (index: number) => {
    if (isTransitioning || selectedIndex === index) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHoveredIndex(null);
      setSelectedIndex(index);
      setFlippedIndex(index);
      return;
    }

    setIsTransitioning(true);
    setHoveredIndex(null);

    if (selectedIndex === null) {
      setSelectedIndex(index);
      schedule(() => setFlippedIndex(index), SELECT_SPACING_MS);
      schedule(() => setIsTransitioning(false), SELECT_SPACING_MS + FLIP_MS);
      return;
    }

    setFlippedIndex(null);
    schedule(() => setSelectedIndex(index), SWITCH_REPOSITION_MS);
    schedule(() => setFlippedIndex(index), SWITCH_FLIP_MS);
    schedule(() => setIsTransitioning(false), SWITCH_COMPLETE_MS);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(index);
    }
  };

  const getCardStyle = (index: number) => {
    const presentation = getCardPresentation(
      index,
      hoveredIndex,
      selectedIndex,
    );

    return {
      transform:
        "translate3d(" + presentation.x + "px, " + presentation.y +
        "px, 0) rotateZ(" + presentation.rotation + "deg) scale(" +
        presentation.scale + ")",
      opacity: presentation.opacity,
      zIndex: presentation.zIndex,
    };
  };

  const detailFormat = detailIndex === null ? null : formats[detailIndex];

  return (
    <section
      id="formats"
      className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(125,11,41,.22),transparent_55%),#21060C] px-0 py-24 md:px-[5vw] md:py-[120px]"
      data-state={isTransitioning ? "transitioning" : selectedIndex === null ? "idle" : "selected"}
    >
      {isTransitioning && (
        <span className="sr-only" aria-live="polite" data-state="transitioning">
          Карты меняются
        </span>
      )}

      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 mb-16 md:mb-20">
        <h2 className="font-display font-bold text-[#F1EFE9] text-[clamp(52px,6vw,96px)] leading-[0.9] text-balance">
          ФОРМАТЫ ИГРЫ
        </h2>
      </div>

      <div className="format-fan hide-scroll flex items-end gap-4 overflow-x-auto snap-x snap-mandatory px-[9vw] pb-8 md:relative md:mx-auto md:h-[520px] md:w-[min(1180px,92vw)] md:justify-center md:overflow-visible md:px-0 md:pb-0">
        {formats.slice(0, 3).map((format, index) => {
          const isSelected = selectedIndex === index;
          const isFlipped = flippedIndex === index;
          return (
            <div
              key={format.id}
              role="button"
              tabIndex={isTransitioning ? -1 : 0}
              aria-pressed={isSelected}
              aria-disabled={isTransitioning}
              aria-label={`Выбрать ${format.title}`}
              className="format-card-shell relative shrink-0 snap-center cursor-pointer outline-none md:absolute md:bottom-0"
              style={getCardStyle(index)}
              onClick={() => selectCard(index)}
              onKeyDown={(event) => handleCardKeyDown(event, index)}
              onMouseEnter={() => {
                if (!isTransitioning && index !== selectedIndex) setHoveredIndex(index);
              }}
              onMouseLeave={() => {
                setHoveredIndex((current) => current === index ? null : current);
              }}
            >
              {isSelected && (
                <span className="format-selected-indicator pointer-events-none absolute left-1/2 top-[-30px] hidden -translate-x-1/2 whitespace-nowrap font-sans text-[10px] font-semibold tracking-[0.14em] text-[#F1EFE9]/65 md:block">
                  ВЫБРАНО
                </span>
              )}
              <div className={`card-inner ${isFlipped ? "is-flipped" : ""}`}>
                <div className="card-back">
                  <Image
                    src="/magnum-card.svg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 78vw, 340px"
                    priority={index === 1}
                  />
                  <span className="absolute left-5 top-5 font-sans text-[11px] font-semibold tracking-[0.14em] text-white/55 tabular-nums">
                    0{index + 1}
                  </span>
                </div>

                <div className="card-front">
                  <span className="font-sans text-[12px] font-semibold tracking-[0.12em] text-[#7D0B29] tabular-nums">
                    0{index + 1}
                  </span>
                  <div className="mt-auto relative z-10">
                    <h3 className="font-display text-[30px] font-bold leading-none text-[#08090B] mb-5 text-balance">
                      ФОРМАТ 0{index + 1}
                    </h3>
                    <p className="font-sans text-[15px] leading-[1.5] text-[#08090B]/70 mb-8 text-pretty">
                      Описание будет добавлено после согласования.
                    </p>
                    <button
                      type="button"
                      className="min-h-11 inline-flex items-center border-b border-black/25 font-sans text-[13px] font-semibold tracking-[0.06em] text-[#08090B] transition-[border-color,transform] duration-200 hover:border-black active:scale-[0.98]"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDetailIndex(index);
                      }}
                    >
                      ПОДРОБНЕЕ ↗
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-8 w-44 h-44 opacity-[0.06] pointer-events-none">
                    <Image src="/magnum-bg.svg" alt="" fill className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {detailFormat && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <button
            type="button"
            aria-label="Закрыть подробности"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDetailIndex(null)}
          />
          <div className="relative bg-[#08090B] border border-white/10 p-8 sm:p-12 w-full max-w-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setDetailIndex(null)}
              className="absolute top-5 right-5 min-w-11 min-h-11 text-muted hover:text-warm-white transition-colors"
            >
              ×
            </button>

            <h3 className="font-display text-4xl sm:text-5xl font-bold uppercase mb-10 leading-none text-warm-white text-balance">
              {detailFormat.title}
            </h3>
            <dl className="mb-10 border-t border-white/10">
              <div className="grid sm:grid-cols-[1fr_2fr] gap-2 py-5 border-b border-white/10">
                <dt className="text-sm text-muted uppercase tracking-widest">Длительность</dt>
                <dd className="text-lg text-warm-white">{detailFormat.duration}</dd>
              </div>
              <div className="grid sm:grid-cols-[1fr_2fr] gap-2 py-5 border-b border-white/10">
                <dt className="text-sm text-muted uppercase tracking-widest">Описание</dt>
                <dd className="text-lg text-warm-white leading-relaxed">{detailFormat.description}</dd>
              </div>
            </dl>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-white/50 text-warm-white text-lg font-bold tracking-widest uppercase transition-colors hover:border-white"
            >
              Записаться ↗
            </a>
          </div>
        </div>
      )}
    </section>
  );
}


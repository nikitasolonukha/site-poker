"use client";
import { useState } from "react";
import Image from "next/image";
import { formats } from "@/data/formats";
import { siteConfig } from "@/config/site";

const FormatCard = ({ index }: { index: number }) => (
  <div className="relative w-full h-full rounded-[14px] bg-[#770A28] overflow-hidden flex flex-col justify-between p-6 xl:p-8"
       style={{
         boxShadow: '0 25px 60px rgba(0,0,0,.28)',
         border: '1px solid rgba(241,239,233,.12)'
       }}>
    
    {/* Spade Ornament */}
    <div className="absolute -bottom-12 -right-12 w-[250px] h-[250px] opacity-[0.12] pointer-events-none">
      <Image src="/magnum-bg.svg" alt="" fill className="object-contain" />
    </div>

    {/* Top Number */}
    <div className="relative z-10 text-[#F1EFE9] font-sans text-[12px] tracking-[0.12em] opacity-65">
      0{index + 1}
    </div>

    {/* Content Area */}
    <div className="relative z-10 mt-auto">
      <h3 className="font-display text-[26px] xl:text-[34px] font-semibold leading-none text-[#F1EFE9] mb-4">
        ФОРМАТ 0{index + 1}
      </h3>
      <p className="font-sans text-[15px] xl:text-[17px] leading-[1.5] text-[#F1EFE9]/90 mb-8 xl:mb-10">
        Описание будет добавлено после согласования.
      </p>
      
      <div className="flex items-center text-[#F1EFE9] font-sans text-[13px] font-semibold tracking-[0.06em]">
        ПОДРОБНЕЕ <span className="ml-1 text-lg leading-none">↗</span>
      </div>
    </div>
  </div>
);

export default function GameFormats() {
  const [selectedFormat, setSelectedFormat] = useState<typeof formats[0] | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getHoverStyles = (cardIndex: number, activeHover: number | null) => {
    if (activeHover === null) return {};

    const isSelected = cardIndex === activeHover;
    
    if (isSelected) {
      return {
        '--hover-t-y': '-28px',
        '--hover-r': '0deg',
        '--s': '1.02',
        zIndex: 50,
      } as React.CSSProperties;
    }

    const diff = cardIndex - activeHover;
    const offset = diff > 0 ? 25 : -25; 
    
    return {
      '--hover-t-x': `calc(var(--t-x) + ${offset}px)`,
      '--hover-r': `calc(var(--r) + ${diff > 0 ? 2 : -2}deg)`
    } as React.CSSProperties;
  };

  return (
    <section 
      id="formats" 
      className="relative w-full"
      style={{
        minHeight: '100svh',
        padding: '120px 5vw 100px',
        background: 'radial-gradient(circle at 50% 50%, rgba(125, 11, 41, .22), transparent 55%), #21060C'
      }}
    >
      <style>{`
        .magnum-card-0 {
          --t-x: 45px;
          --t-y: 0px;
          --r: -6deg;
          z-index: 10;
        }
        .magnum-card-1 {
          --t-x: 0px;
          --t-y: -10px;
          --r: 0deg;
          z-index: 30;
        }
        .magnum-card-2 {
          --t-x: -45px;
          --t-y: 0px;
          --r: 6deg;
          z-index: 20;
        }
        @media (min-width: 1100px) {
          .magnum-card-0 {
            --t-x: 80px;
            --t-y: 0px;
            --r: -8deg;
          }
          .magnum-card-1 {
            --t-x: 0px;
            --t-y: -20px;
            --r: -1deg;
          }
          .magnum-card-2 {
            --t-x: -80px;
            --t-y: 0px;
            --r: 7deg;
          }
        }
        /* Hide scrollbar for mobile slider */
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Section Title */}
      <div className="w-full max-w-[min(1180px,92vw)] mx-auto mb-[80px]">
        <h2 
          className="font-display font-bold text-[#F1EFE9]"
          style={{
            fontSize: 'clamp(54px, 6vw, 96px)',
            lineHeight: '0.9',
            maxWidth: '1100px'
          }}
        >
          ФОРМАТЫ ИГРЫ
        </h2>
      </div>

      {/* Desktop / Tablet Fan Layout */}
      <div 
        className="hidden md:flex justify-center items-end relative mx-auto"
        style={{ width: 'min(1180px, 92vw)' }}
      >
        <div className="relative w-full flex justify-center items-end h-[460px] min-[1100px]:h-[620px]">
          {formats.slice(0, 3).map((format, i) => (
            <div
              key={format.id}
              className={`absolute bottom-0 magnum-card-${i} transition-all duration-[450ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] cursor-pointer w-[290px] h-[460px] min-[1100px]:w-[350px] min-[1100px]:h-[520px]`}
              style={{
                transform: `translate(var(--hover-t-x, var(--t-x)), var(--hover-t-y, var(--t-y))) rotate(var(--hover-r, var(--r))) scale(var(--s, 1))`,
                ...getHoverStyles(i, hoveredIndex)
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedFormat(format)}
            >
              <FormatCard index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Swipe */}
      <div 
        className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scroll"
        style={{
          gap: '16px',
          padding: '0 20px',
        }}
      >
        {formats.slice(0, 3).map((format, i) => (
          <div
            key={format.id}
            className="snap-center shrink-0 cursor-pointer"
            style={{
              width: '82vw',
              height: '480px',
              flex: '0 0 82vw',
            }}
            onClick={() => setSelectedFormat(format)}
          >
            <FormatCard index={i} />
          </div>
        ))}
      </div>

      {/* Modal / Drawer (Existing functionality preserved) */}
      {selectedFormat && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setSelectedFormat(null)}
          />
          <div className="relative bg-[#08090B] sm:border border-[rgba(241,239,233,0.12)] sm:rounded-[2px] p-8 sm:p-12 w-full max-w-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedFormat(null)}
              className="absolute top-6 right-6 text-muted hover:text-warm-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <h3 className="font-display text-4xl sm:text-5xl font-bold uppercase mb-12 leading-none text-warm-white">
              {selectedFormat.title}
            </h3>
            
            <div className="flex flex-col mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center py-6 border-t border-b border-[rgba(241,239,233,0.12)]">
                <div className="w-full sm:w-1/3 text-sm text-muted uppercase tracking-widest mb-2 sm:mb-0">
                  Формат
                </div>
                <div className="w-full sm:w-2/3 text-lg font-medium text-warm-white">
                  {selectedFormat.title}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-6 border-b border-[rgba(241,239,233,0.12)]">
                <div className="w-full sm:w-1/3 text-sm text-muted uppercase tracking-widest mb-2 sm:mb-0">
                  Длительность
                </div>
                <div className="w-full sm:w-2/3 text-lg font-medium text-warm-white">
                  {selectedFormat.duration}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start py-6 border-b border-[rgba(241,239,233,0.12)]">
                <div className="w-full sm:w-1/3 text-sm text-muted uppercase tracking-widest mb-2 sm:mb-0">
                  Описание
                </div>
                <div className="w-full sm:w-2/3 text-lg font-medium text-warm-white leading-relaxed">
                  {selectedFormat.description}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-3 border-b border-[rgba(241,239,233,0.55)] text-warm-white hover:border-warm-white text-lg font-bold tracking-widest uppercase transition-all duration-300"
              >
                Записаться ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

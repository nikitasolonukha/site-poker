"use client";

import { useState, useRef } from "react";
import { reviews } from "@/data/reviews";
import gsap from "gsap";
import Image from "next/image";

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  if (!reviews || !reviews.length) return null;
  const activeReview = reviews[activeIndex];

  // Placeholder array for chip images. User can replace these with actual paths like /chips/100.webp
  const chipAssets = [
    "/magnum-chip.svg",
    "/magnum-chip.svg",
    "/magnum-chip.svg",
    "/magnum-chip.svg"
  ];

  const handleChipClick = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    
    gsap.to(quoteRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        setActiveIndex(index);
        gsap.fromTo(quoteRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", onComplete: () => setIsAnimating(false) }
        );
      }
    });
  };

  return (
    <section id="reviews" className="bg-[#ECE8E2] text-[#08090B] py-32 overflow-hidden border-t border-[rgba(8,9,11,0.06)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-16 items-center min-h-[50vh]">
          
          <div className="w-full md:w-3/5 flex flex-col justify-center">
            <h2 className="font-display text-sm tracking-widest text-[#7D0B29] uppercase font-bold mb-12">
              Отзывы
            </h2>
            
            <div ref={quoteRef} className="min-h-[200px] flex flex-col justify-center">
              <p className="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.1] mb-10 font-medium">
                {activeReview.quote}
              </p>
              
              <div>
                <p className="font-bold text-lg uppercase tracking-widest">{activeReview.author}</p>
                <p className="opacity-60 text-sm tracking-widest uppercase mt-1">{activeReview.source}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-16">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(idx)}
                  className="relative outline-none group cursor-pointer"
                  aria-label={`Отзыв ${idx + 1}`}
                >
                  <div 
                    className="w-14 h-14 relative transition-all duration-[350ms] ease-out"
                    style={{
                      transform: activeIndex === idx ? "translateY(-5px) rotate(10deg)" : "translateY(0) rotate(0)",
                      filter: activeIndex === idx ? "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" : "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                      opacity: activeIndex === idx ? 1 : 0.5
                    }}
                  >
                    <Image 
                      src={chipAssets[idx % chipAssets.length]} 
                      alt={`Chip ${idx}`} 
                      fill 
                      className="object-contain" 
                      sizes="56px"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end relative h-full">
            <div className="w-full max-w-sm aspect-square relative opacity-[0.04] pointer-events-none flex items-center justify-center">
              <Image src="/magnum-bg.svg" alt="Decoration" fill className="object-contain" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { whyFeatures } from "@/data/why";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "/gallery/image-10.webp", // Use the uploaded SVG
  "/magnum-live.mp4", 
  "/gallery/image-5.webp"
];

const rotations = [-2, 1.5, -1];

export default function WhyMagnum() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // For all cards except the last one, scale down and rotate when the next card comes up
        if (index < cardsRef.current.length - 1) {
          const nextCard = cardsRef.current[index + 1];
          const targetRotation = rotations[index];
          
          gsap.to(card, {
            scale: 0.95,
            rotateZ: targetRotation,
            opacity: 0.72,
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top 15vh", // when the next card is stuck
              scrub: true,
            }
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={containerRef} className="magnum-paper relative pb-32">
      <div className="pt-24 pb-12 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-black">
          Почему<br />
          Magnum
        </h2>
      </div>

      <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        {whyFeatures.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="sticky top-[15vh] w-full min-h-[70vh] flex flex-col justify-center mb-[10vh] origin-top"
          >
            <div className="bg-[#F1EFE9] border border-[rgba(8,9,11,0.12)] rounded-[2px] p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 w-full h-full min-h-[60vh] transform-gpu">
              
              <div className="w-full md:w-[45%] flex flex-col justify-between order-2 md:order-1">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-display text-burgundy text-xl font-bold">
                    0{i + 1}
                  </span>
                  <div className="w-6 h-6 opacity-30">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 15C2 15 2 20 6 20C9.5 20 12 17 12 17C12 17 14.5 20 18 20C22 20 22 15 22 15L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-3xl md:text-5xl font-bold uppercase mb-6 text-black leading-[0.9]">
                    {feature.title}
                  </h3>
                  <p className="text-black/80 text-base md:text-lg leading-relaxed max-w-sm whitespace-pre-line font-medium">
                    {feature.description}
                  </p>
                </div>

                <div className="hidden md:block w-12 h-12 border border-[rgba(8,9,11,0.12)] rounded-full flex items-center justify-center mt-12">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </div>
              </div>

              <div className="w-full md:w-[55%] relative aspect-[4/3] md:aspect-auto bg-[#ECE8E2] overflow-hidden order-1 md:order-2 border border-[rgba(8,9,11,0.06)] rounded-[2px]">
                {images[i].endsWith('.mp4') ? (
                  <video
                    src={images[i]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={images[i]}
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

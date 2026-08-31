"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MagnumCTAProps {
  chip?: string;
  title: string;
  label: string;
  href: string;
}

export default function MagnumCTA({ chip = "/magnum-chip.svg", title, label, href }: MagnumCTAProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const container = containerRef.current;
      const chipEl = chipRef.current;
      
      if (!container || !chipEl) return;

      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(chipEl, {
        x: 45,
        rotation: 125,
        duration: 0.5,
        ease: "power2.out"
      });

      container.addEventListener('mouseenter', () => hoverTl.play());
      container.addEventListener('mouseleave', () => hoverTl.reverse());

      return () => {
        container.removeEventListener('mouseenter', () => hoverTl.play());
        container.removeEventListener('mouseleave', () => hoverTl.reverse());
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-[#21060C] py-8 md:py-16 flex justify-center border-t border-[rgba(241,239,233,0.04)]">
      <Link href={href} className="block w-full max-w-6xl px-6 outline-none" ref={containerRef}>
        <div className="flex flex-col md:flex-row items-center justify-between border-y border-[rgba(241,239,233,0.08)] py-8 md:py-10 group relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-center w-full relative z-10 gap-6 md:gap-12">
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase font-bold text-[#F1EFE9] whitespace-nowrap">
              {title}
            </h3>

            <div className="hidden md:flex flex-1 items-center relative h-[2px] bg-transparent mx-4">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-[rgba(241,239,233,0.1)]"></div>
              
              <div 
                ref={chipRef} 
                className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[72px] h-[72px] md:w-[84px] md:h-[84px] drop-shadow-xl"
              >
                <Image
                  src={chip}
                  alt="Magnum Chip"
                  fill
                  sizes="84px"
                  className="object-contain"
                />
              </div>
            </div>
            
            <div className="font-sans text-sm md:text-base text-[#F1EFE9] tracking-[0.06em] uppercase font-semibold flex items-center whitespace-nowrap">
              {label} <span className="ml-2 text-xl md:text-2xl transition-transform duration-300 group-hover:translate-x-1.5">↗</span>
            </div>
          </div>
          
        </div>
      </Link>
    </div>
  );
}

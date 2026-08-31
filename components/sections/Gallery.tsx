"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { gallery } from "@/data/gallery";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      const items = imagesRef.current.filter(Boolean) as HTMLDivElement[];
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const initialRotations = [-4, 2, -1, 4, -3, 1, -2, 3, -1];

      // Initially set all items to be hidden via opacity to prevent FOUC (flash of unstyled content)
      gsap.set(items, { opacity: 0 });

      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const itemCenterY = rect.top + rect.height / 2;
        
        const deltaX = centerX - itemCenterX;
        const deltaY = centerY - itemCenterY;
        
        const rot = initialRotations[i % initialRotations.length];

        // Prepare the scattered state immediately, and make them visible
        gsap.set(item, {
          x: deltaX,
          y: deltaY,
          rotation: rot,
          scale: 0.88,
          zIndex: 10 - i,
          opacity: 1, // now it's safe to show them in their scattered position
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        }
      });

      // Scatter outward a bit as you start scrolling
      items.forEach((item) => {
        tl.to(item, {
          x: (gsap.getProperty(item, "x") as number) * 0.5,
          y: (gsap.getProperty(item, "y") as number) * 0.5,
          rotation: (gsap.getProperty(item, "rotation") as number) * 0.5,
          ease: "power1.inOut"
        }, 0);
      });

      // Snap to original grid positions
      items.forEach((item) => {
        tl.to(item, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: 1,
          ease: "power2.out"
        }, 0.4);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={containerRef} className="bg-[#08090B] relative pt-20 overflow-hidden min-h-[100svh] text-warm-white flex items-center">
      <div className="absolute top-24 left-0 right-0 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 z-10 pointer-events-none flex justify-between items-end">
        <h2 className="font-display text-3xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight">
          Галерея
        </h2>
        <span className="text-muted text-sm md:text-base tracking-widest uppercase font-bold">
          09 ФОТО
        </span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full pt-[80px]">
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[minmax(150px,22vh)]"
        >
          {gallery.map((item, i) => {
            let colSpan = "md:col-span-4";
            let rowSpan = "md:row-span-1";
            
            if (i === 0) { colSpan = "md:col-span-7"; rowSpan = "md:row-span-2"; }
            else if (i === 1) { colSpan = "md:col-span-5"; rowSpan = "md:row-span-3"; }
            else if (i === 2) { colSpan = "md:col-span-4"; rowSpan = "md:row-span-1"; }
            else if (i === 3) { colSpan = "md:col-span-3"; rowSpan = "md:row-span-2"; }
            else if (i === 4) { colSpan = "md:col-span-5"; rowSpan = "md:row-span-2"; }
            else if (i === 5) { colSpan = "md:col-span-4"; rowSpan = "md:row-span-2"; }
            else if (i === 6) { colSpan = "md:col-span-3"; rowSpan = "md:row-span-1"; }
            else if (i === 7) { colSpan = "md:col-span-8"; rowSpan = "md:row-span-2"; }
            else if (i === 8) { colSpan = "md:col-span-4"; rowSpan = "md:row-span-2"; }

            return (
              <div 
                key={item.id}
                ref={(el) => { imagesRef.current[i] = el; }}
                // Added opacity-0 initially for desktop so it doesn't flash before GSAP kicks in
                className={`${colSpan} ${rowSpan} relative group overflow-hidden rounded-[2px] will-change-transform bg-[#14070A] md:opacity-0`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={92}
                  priority={i < 4} // Make first few images priority to prevent flash
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
                  sizes={
                    colSpan.includes("7") || colSpan.includes("8") ? "(max-width: 768px) 100vw, 70vw" 
                    : "(max-width: 768px) 100vw, 40vw"
                  }
                />
                
                {/* Caption overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent flex items-end p-6 transition-opacity duration-400 ${
                    hoveredId === item.id || isMobile ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="text-warm-white font-sans text-[13px] tracking-widest whitespace-pre-line leading-[1.4] uppercase font-bold drop-shadow-md">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

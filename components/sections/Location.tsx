"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function Location() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="contacts" ref={sectionRef} className="bg-[#21060C] border-t border-[rgba(241,239,233,0.06)] overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[70vh]">
        
        {/* Left Side: Contacts */}
        <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center relative z-10 text-[#F1EFE9]">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-12 leading-none">
            {siteConfig.city}
          </h2>
          <p className="font-display text-2xl md:text-4xl uppercase text-[#F1EFE9]/90 mb-16 max-w-sm leading-[1.1] text-balance tracking-tight">
            БОЛЬШАЯ<br />
            НОВОДМИТРОВСКАЯ<br />
            36с13
          </p>

          <div className="mb-16">
            <a 
              href={siteConfig.telegram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-display text-xl md:text-2xl tracking-widest text-[#F1EFE9] hover:text-white transition-colors uppercase font-bold"
            >
              @MAGNUM_POKER
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 border-b border-[rgba(241,239,233,0.55)] text-[#F1EFE9] hover:border-white text-sm font-bold tracking-widest uppercase transition-all duration-300"
            >
              Написать ↗
            </a>
            {siteConfig.mapUrl && (
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-3 border-b border-[rgba(241,239,233,0.55)] text-[#F1EFE9] hover:border-white text-sm font-bold tracking-widest uppercase transition-all duration-300"
              >
                Построить маршрут ↗
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Map Visual */}
        <div className="w-full md:w-1/2 min-h-[50vh] relative bg-[#08090B] border-l border-[rgba(241,239,233,0.06)]">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?mode=search&text=Magnum+Club,+Москва,+Большая+Новодмитровская+улица,+36с13&theme=dark&z=16" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen={true}
            className="absolute inset-0 w-full h-full"
            style={{ position: 'absolute' }}
          ></iframe>

          {/* Business Card Overlay */}
          <div className="absolute bottom-12 right-12 z-20 hidden md:block">
            <div 
              className="relative w-[300px] h-[170px] cursor-pointer group transition-all duration-450 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
              style={{
                transform: "rotate(-3deg)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.32)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) translateY(-7px) scale(1.015)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(-3deg)";
              }}
            >
              <Image 
                src="/magnum-card.svg" 
                alt="Magnum Business Card" 
                fill 
                className="object-cover rounded-[2px]" 
                sizes="330px"
              />
              {/* Optional: if you have a specific business card image instead of the playing card back, replace the src above. */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

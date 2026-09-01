import { siteConfig } from "@/config/site";
import Image from "next/image";
import FinalCTAChip from "./FinalCTAChip";

export default function FinalCTA() {
  return (
    <section className="relative min-h-[100svh] bg-[#7D0B29] py-32 md:py-48 overflow-hidden text-[#F1EFE9]">
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[100vw] aspect-square opacity-[0.12] pointer-events-none mix-blend-overlay">
        <Image
          src="/magnum-bg.svg"
          alt="Magnum Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 flex flex-col md:flex-row items-center justify-between pb-12">
        <div className="w-full flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-display text-7xl md:text-8xl lg:text-[11rem] font-bold uppercase mb-12 text-[#F1EFE9] tracking-tight leading-[0.85]">
            ТВОЙ<br/>
            ХОД.
          </h2>
          
          <div className="mt-8">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-4 border-b-2 border-[#F1EFE9] text-[#F1EFE9] hover:opacity-70 text-xl md:text-2xl font-bold tracking-widest uppercase transition-opacity duration-300"
            >
              Записаться ↗
            </a>
          </div>
        </div>
      </div>
      {/* Four independently animated chips */}
      <div className="final-cta-chip absolute left-1/2 top-[4vw] w-[80vw] aspect-square -translate-x-1/2 pointer-events-none z-30 md:left-[calc(50%-339px)] md:right-auto lg:left-[calc(50%-54px)] xl:left-[calc(50%+106px)] md:top-[clamp(24px,4vw,56px)] md:h-[780px] md:w-[600px] md:translate-x-0 md:aspect-auto">
        <FinalCTAChip />
      </div>
      <div
        aria-hidden="true"
        className="final-cta-foreground pointer-events-none absolute inset-x-0 bottom-0 h-[10px] bg-[#08080A] z-40"
      />    </section>
  );
}

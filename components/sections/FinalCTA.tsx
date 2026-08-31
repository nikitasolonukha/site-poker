import { siteConfig } from "@/config/site";
import Image from "next/image";
import FinalCTAChip from "./FinalCTAChip";

export default function FinalCTA() {
  return (
    <section className="relative bg-[#7D0B29] py-32 md:py-48 overflow-hidden text-[#F1EFE9]">
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

      <div className="final-cta-cards pointer-events-none absolute z-10 right-[-15vw] top-[52%] w-[min(72vw,360px)] -translate-y-1/2 md:right-[7%] md:top-1/2 md:w-[clamp(340px,34vw,560px)]">
        <Image
          src="/final-cta-cards.svg"
          alt=""
          width={1062}
          height={1406}
          className="h-auto w-full"
          sizes="(max-width: 767px) 72vw, 560px"
        />
      </div>

      {/* Decorative Chip - 30% visible from bottom */}
      <div className="final-cta-chip absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[15%] bottom-[-20vw] md:bottom-[-250px] w-[80vw] md:w-[600px] aspect-square pointer-events-none z-30">
        <FinalCTAChip />
      </div>
    </section>
  );
}

import { siteConfig } from "@/config/site";

export default function Location() {
  return (
    <section
      id="contacts"
      className="bg-[#21060C] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row min-h-[70vh]">
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center text-[#F1EFE9]">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-12 leading-none">
            {siteConfig.city}
          </h2>
          <p className="font-display text-2xl md:text-4xl uppercase text-[#F1EFE9]/90 mb-16 max-w-lg leading-[1.1] text-balance tracking-tight">
            БОЛЬШАЯ НОВОДМИТРОВСКАЯ 36с13
          </p>

          <a
            href={siteConfig.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-12 inline-flex min-h-11 w-fit items-center font-display text-xl md:text-2xl tracking-widest text-[#F1EFE9] hover:text-white transition-colors uppercase font-bold"
          >
            @MAGNUM_POKER
          </a>

          <div className="flex flex-col sm:flex-row gap-8">
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-white/55 text-[#F1EFE9] hover:border-white text-sm font-bold tracking-widest uppercase transition-colors"
            >
              Написать ↗
            </a>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-white/55 text-[#F1EFE9] hover:border-white text-sm font-bold tracking-widest uppercase transition-colors"
            >
              Построить маршрут ↗
            </a>
          </div>
        </div>

        <div className="relative w-full min-h-[52vh] md:w-1/2 md:min-h-0 bg-[#08090B] border-l border-white/[0.06]">
          <iframe
            title="MAGNUM на карте Москвы"
            src="https://yandex.ru/map-widget/v1/?mode=search&text=Magnum+Club,+Москва,+Большая+Новодмитровская+улица,+36с13&theme=dark&z=16"
            width="100%"
            height="100%"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#7D0B29]/45 to-transparent" />
        </div>
      </div>
    </section>
  );
}


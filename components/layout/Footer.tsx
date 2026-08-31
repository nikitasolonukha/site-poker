import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="magnum-dark py-12 md:py-20 border-t border-[rgba(241,239,233,0.06)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex-1">
          <Link href="/" className="font-display font-bold text-4xl md:text-5xl tracking-widest text-warm-white">
            MAGNUM
          </Link>
          <p className="mt-4 text-sm text-muted uppercase tracking-widest">
            {siteConfig.tagline}
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-start md:items-end gap-6">
          <div className="text-sm md:text-base font-bold text-warm-white uppercase tracking-widest text-left md:text-right">
            {siteConfig.city}, {siteConfig.address}
          </div>
          <div className="flex gap-8">
            <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-warm-white text-muted transition-colors uppercase tracking-widest">
              Telegram
            </a>
            <Link href="#" className="text-sm font-bold hover:text-warm-white text-muted transition-colors uppercase tracking-widest">
              Политика конфиденциальности
            </Link>
          </div>
          <p className="text-xs text-muted/40 uppercase tracking-widest mt-4">
            © {new Date().getFullYear()} {siteConfig.name}. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
          </p>
        </div>
      </div>
    </footer>
  );
}

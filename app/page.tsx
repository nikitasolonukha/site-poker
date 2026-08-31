import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WhyMagnum from "@/components/sections/WhyMagnum";
import GameFormats from "@/components/sections/GameFormats";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import Location from "@/components/sections/Location";
import FinalCTA from "@/components/sections/FinalCTA";
import MagnumCTA from "@/components/ui/MagnumCTA";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <About />
        
        <MagnumCTA 
          title="ЕСТЬ ВОПРОС?"
          label="НАПИСАТЬ В TELEGRAM"
          href="https://t.me/MAGNUM_POKER"
        />
        
        <WhyMagnum />
        <GameFormats />
        
        <MagnumCTA 
          title="ГОТОВЫ СЕСТЬ ЗА СТОЛ?"
          label="ЗАПИСАТЬСЯ"
          href="https://t.me/MAGNUM_POKER"
        />

        <Gallery />
        <Reviews />
        <Location />
        
        <MagnumCTA 
          title="ОСТАЛИСЬ СОМНЕНИЯ?"
          label="СВЯЗАТЬСЯ С НАМИ"
          href="https://t.me/MAGNUM_POKER"
        />
        
        <FinalCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

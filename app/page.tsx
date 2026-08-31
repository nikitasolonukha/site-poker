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
import ChipDivider from "@/components/ui/ChipDivider";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <ChipDivider value="100" angle={-2.4} chipSide="right" />
        <About />
        <ChipDivider value="500" direction="reverse" angle={2.2} chipSide="left" />
        
        <MagnumCTA 
          title="ЕСТЬ ВОПРОС?"
          label="НАПИСАТЬ В TELEGRAM"
          href="https://t.me/MAGNUM_POKER"
        />
        <ChipDivider value="1K" angle={-1.8} chipSide="right" />
        
        <WhyMagnum />
        <ChipDivider value="5K" direction="reverse" angle={2.6} chipSide="left" />
        <GameFormats />
        <ChipDivider value="25K" angle={-2.1} chipSide="right" />
        
        <MagnumCTA 
          title="ГОТОВЫ СЕСТЬ ЗА СТОЛ?"
          label="ЗАПИСАТЬСЯ"
          href="https://t.me/MAGNUM_POKER"
        />

        <Gallery />
        <ChipDivider value="100K" direction="reverse" angle={2.3} chipSide="left" />
        <Reviews />
        <Location />
        <ChipDivider value="BOUNTY" angle={-2.5} chipSide="right" />
        
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

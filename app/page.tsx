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
        <ChipDivider value="500" surface="wine" chipSide="right" />
        <About />
        <ChipDivider value="100" surface="dark" direction="reverse" chipSide="left" />
        
        <MagnumCTA 
          title="ЕСТЬ ВОПРОС?"
          label="НАПИСАТЬ В TELEGRAM"
          href="https://t.me/MAGNUM_POKER"
        />
        <ChipDivider value="1K" surface="wine" chipSide="right" />
        
        <WhyMagnum />
        <ChipDivider value="5K" surface="paper" direction="reverse" chipSide="left" />
        <GameFormats />
        <ChipDivider value="25K" surface="wine" chipSide="right" />
        
        <MagnumCTA 
          title="ГОТОВЫ СЕСТЬ ЗА СТОЛ?"
          label="ЗАПИСАТЬСЯ"
          href="https://t.me/MAGNUM_POKER"
        />

        <Gallery />
        <ChipDivider value="100K" surface="dark" direction="reverse" chipSide="left" />
        <Reviews />
        <Location />
        <ChipDivider value="BOUNTY" surface="wine" chipSide="right" />
        
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

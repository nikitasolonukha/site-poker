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
import ChipRail from "@/components/ui/ChipRail";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <ChipRail denomination="500" />
        <About />

        <MagnumCTA 
          title="ЕСТЬ ВОПРОС?"
          label="НАПИСАТЬ В TELEGRAM ↗"
          href={siteConfig.telegram}
        />
        <ChipRail denomination="100" direction="reverse" chipSide="left" />

        <WhyMagnum />
        <ChipRail denomination="1K" />
        <GameFormats />

        <MagnumCTA 
          title="ГОТОВЫ СЕСТЬ ЗА СТОЛ?"
          label="ЗАПИСАТЬСЯ ↗"
          href={siteConfig.bookingUrl}
        />
        <ChipRail denomination="5K" direction="reverse" chipSide="left" />
        <Gallery />
        <ChipRail denomination="25K" />
        <Reviews />
        <ChipRail denomination="100K" direction="reverse" chipSide="left" />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

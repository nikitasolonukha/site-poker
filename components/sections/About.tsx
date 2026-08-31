"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 768;
      
      if (isDesktop && videoContainerRef.current && textRef.current && labelRef.current) {
        // Remove the CSS class that sets initial state to allow GSAP to take over cleanly
        videoContainerRef.current.classList.remove('video-mobile-fallback');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",
            scrub: 0.7,
            pin: true,
            invalidateOnRefresh: true, // Recalculate on resize
          }
        });

        // Use fromTo to ensure exact positioning based on current viewport
        tl.fromTo(videoContainerRef.current, {
          width: "42vw",
          height: "58vh",
          borderRadius: "2px",
          x: () => {
            // Calculate exactly how far to the right the video should sit
            const containerWidth = Math.min(window.innerWidth, 1440);
            const videoWidth = window.innerWidth * 0.42;
            // padding-x is 48px on lg screens
            const paddingPx = window.innerWidth >= 1024 ? 48 : 24; 
            return (containerWidth / 2) - (videoWidth / 2) - paddingPx;
          }
        }, {
          width: "90vw",
          height: "82vh",
          x: 0,
          borderRadius: "4px",
          ease: "power2.inOut"
        }, 0)
        .to(textRef.current, {
          opacity: 0,
          y: -35,
          ease: "power2.inOut"
        }, 0)
        .to(labelRef.current, {
          opacity: 1,
          ease: "power2.inOut"
        }, 0.5);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative w-full bg-[#08090B] overflow-hidden flex items-center justify-center min-h-[100svh]">
      
      {/* Background/Centered Video Wrapper (Absolute on Desktop to allow centering) */}
      <div className="w-full md:absolute md:inset-0 flex items-center md:justify-center z-0 md:pointer-events-none mt-8 md:mt-0 order-2 md:order-none px-4 sm:px-6 lg:px-12 md:px-0">
        
        <style>{`
          .video-mobile-fallback {
            width: 100%;
            height: 400px;
          }
          @media (min-width: 768px) {
            .video-mobile-fallback {
              width: 42vw;
              height: 58vh;
            }
          }
        `}</style>

        <div 
          ref={videoContainerRef} 
          className="relative overflow-hidden bg-[#1a1a1a] rounded-[2px] video-mobile-fallback md:pointer-events-auto"
        >
          <video
            src="/magnum-live.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col md:flex-row items-center md:justify-between py-24 md:py-0 h-full relative z-10 md:pointer-events-none">
        
        {/* Floating Label (Visible only on desktop after scroll) */}
        <div 
          ref={labelRef} 
          className="hidden md:flex absolute top-[10vh] left-6 lg:left-12 z-20 flex-col opacity-0 text-white mix-blend-difference"
        >
          <div className="text-xs tracking-widest font-bold uppercase mb-1">MAGNUM / LIVE</div>
          <div className="text-[10px] tracking-widest uppercase opacity-70">СПОРТИВНЫЙ ПОКЕР<br/>МОСКВА</div>
        </div>

        {/* Text Content */}
        <div ref={textRef} className="w-full md:w-[45%] flex flex-col justify-center mb-16 md:mb-0 pointer-events-auto">
          <div className="text-muted tracking-widest uppercase text-sm font-bold mb-8">
            О клубе
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-warm-white leading-[1.1] tracking-tight">
            Не казино.<br />
            Не про деньги.<br />
            <span className="text-[#7D0B29]">Про игру.</span>
          </h2>
          
          <p className="mt-8 text-muted text-base lg:text-lg max-w-md font-sans leading-relaxed md:hidden">
            MAGNUM — это клуб спортивного покера в Москве. Мы создали пространство для тех, кто ценит интеллектуальное противостояние, премиальный сервис и атмосферу настоящей игры.
          </p>
        </div>
        
        {/* Empty right column on desktop so flex-between works correctly without the video in the flow */}
        <div className="hidden md:block w-[45%]"></div>
        
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PokerChip, { type ChipValue } from "./PokerChip";

gsap.registerPlugin(ScrollTrigger);

export type ChipRailDenomination = Exclude<ChipValue, "BOUNTY">;

const railAccents: Record<ChipRailDenomination, string> = {
  "100": "#E5E5E5",
  "500": "#A50D24",
  "1K": "#C4A90A",
  "5K": "#6A21B5",
  "25K": "#A51282",
  "100K": "#9A371D",
};

type ChipRailProps = {
  denomination: ChipRailDenomination;
  direction?: "forward" | "reverse";
  chipSide?: "left" | "right";
};

const patternCopies = [0, 1];
const patternItems = [0, 1, 2, 3];

export default function ChipRail({
  denomination,
  direction = "forward",
  chipSide = "right",
}: ChipRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          chipRef.current,
          { x: -25, rotation: -45 },
          {
            x: 25,
            rotation: 45,
            ease: "none",
            scrollTrigger: {
              trigger: railRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });
    }, railRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={railRef}
      aria-hidden="true"
      className="chip-rail"
      data-denomination={denomination}
      data-motion="subtle"
      data-testid="chip-rail"
      style={{ "--chip-rail-accent": railAccents[denomination] } as CSSProperties}
    >
      <div className="chip-rail__viewport">
        <div className="chip-rail__track" data-direction={direction}>
          {patternCopies.map((copy) => (
            <div className="chip-rail__pattern" key={copy}>
              {patternItems.map((item) => (
                <span className="chip-rail__item" key={item}>
                  <span>MAGNUM</span><i>—</i><span>{denomination}</span><i>—</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div ref={chipRef} className={`chip-rail__chip chip-rail__chip--${chipSide}`}>
        <PokerChip value={denomination} decorative size="100%" />
      </div>
    </div>
  );
}

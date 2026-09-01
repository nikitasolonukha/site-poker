"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type ChipPreset = {
  id: string;
  src: string;
  left: string;
  top: string;
  width: string;
  baseRotation: number;
  idleX: number;
  idleY: number;
  rotateZ: number;
  rotateX: number;
  rotateY: number;
  cycleDuration: number;
  delay: number;
  parallax: number;
  tilt: number;
};

const chipPresets: ChipPreset[] = [
  {
    id: "chip-1",
    src: "/chips/magnum-chip-cta-tight.webp",
    left: "32%",
    top: "5%",
    width: "52%",
    baseRotation: 0,
    idleX: 6,
    idleY: -10,
    rotateZ: 2.2,
    rotateX: 1.4,
    rotateY: -1.8,
    cycleDuration: 8.8,
    delay: 0.6,
    parallax: 6,
    tilt: 1.2,
  },
  {
    id: "chip-2",
    src: "/chips/magnum-chip-cta-tight.webp",
    left: "53%",
    top: "39%",
    width: "31%",
    baseRotation: 84,
    idleX: -8,
    idleY: 14,
    rotateZ: -3.2,
    rotateX: -2,
    rotateY: 2.6,
    cycleDuration: 7.6,
    delay: 1.3,
    parallax: 8,
    tilt: 1.8,
  },
  {
    id: "chip-3",
    src: "/chips/magnum-chip-cta-tight.webp",
    left: "32%",
    top: "62%",
    width: "34%",
    baseRotation: 176,
    idleX: 10,
    idleY: -16,
    rotateZ: 3.8,
    rotateX: 2.4,
    rotateY: -3,
    cycleDuration: 7,
    delay: 0.15,
    parallax: 10,
    tilt: 2.4,
  },
  {
    id: "chip-4",
    src: "/chips/magnum-chip-cta-tight.webp",
    left: "4.5%",
    top: "86%",
    width: "58%",
    baseRotation: 0,
    idleX: -7,
    idleY: 8,
    rotateZ: -2,
    rotateX: -1.4,
    rotateY: 1.8,
    cycleDuration: 9.8,
    delay: 1.8,
    parallax: 14,
    tilt: 3,
  },
];

export default function FinalCTAChip() {
  const parallaxRefs = useRef<Array<HTMLDivElement | null>>([]);
  const idleRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const section = parallaxRefs.current[0]?.closest("section");

    if (!section || reducedMotion.matches) {
      return;
    }

    const idleTweens = chipPresets.flatMap((preset, index) => {
      const element = idleRefs.current[index];
      if (!element) return [];

      return gsap.to(element, {
        x: preset.idleX,
        y: preset.idleY,
        rotation: preset.rotateZ,
        rotationX: preset.rotateX,
        rotationY: preset.rotateY,
        duration: preset.cycleDuration / 2,
        delay: preset.delay,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    if (!finePointer.matches) {
      return () => idleTweens.forEach((tween) => tween.kill());
    }

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const updatePointerMotion = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      chipPresets.forEach((preset, index) => {
        const element = parallaxRefs.current[index];
        if (!element) return;

        element.style.transform = [
          `translate3d(${(currentX * preset.parallax).toFixed(2)}px, ${(currentY * preset.parallax).toFixed(2)}px, 0)`,
          `rotateX(${(-currentY * preset.tilt).toFixed(2)}deg)`,
          `rotateY(${(currentX * preset.tilt).toFixed(2)}deg)`,
        ].join(" ");
      });

      frame = window.requestAnimationFrame(updatePointerMotion);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      const isInside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isInside) {
        targetX = 0;
        targetY = 0;
        return;
      }

      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame = window.requestAnimationFrame(updatePointerMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      idleTweens.forEach((tween) => tween.kill());
      parallaxRefs.current.forEach((element) =>
        gsap.set(element, { clearProps: "transform" }),
      );
      idleRefs.current.forEach((element) =>
        gsap.set(element, { clearProps: "transform" }),
      );
    };
  }, []);

  return (
    <div aria-hidden="true" className="relative h-full w-full [perspective:900px]">
      {chipPresets.map((preset, index) => (
        <div
          key={preset.id}
          className="absolute will-change-transform"
          style={{ left: preset.left, top: preset.top, width: preset.width }}
        >
          <div
            ref={(element) => {
              parallaxRefs.current[index] = element;
            }}
            data-chip-id={preset.id}
            className="will-change-transform"
          >
            <div
              ref={(element) => {
                idleRefs.current[index] = element;
              }}
              className="will-change-transform [transform-style:preserve-3d]"
            >
              <div style={{ transform: `rotate(${preset.baseRotation}deg)` }}>
                <Image
                  src={preset.src}
                  alt=""
                  width={700}
                  height={500}
                  className="h-auto w-full object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.28)]"
                  sizes="(max-width: 768px) 68vw, 410px"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
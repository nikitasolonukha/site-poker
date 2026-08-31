"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type ChipPreset = {
  id: string;
  clipPath: string;
  idleX: number;
  idleY: number;
  rotateZ: number;
  rotateX: number;
  rotateY: number;
  duration: number;
  delay: number;
  parallax: number;
  tilt: number;
};

const chipPresets: ChipPreset[] = [
  {
    id: "chip-1",
    clipPath: "polygon(29% 3%, 72% 3%, 72% 35%, 29% 35%)",
    idleX: 4,
    idleY: -6,
    rotateZ: 1.5,
    rotateX: 1,
    rotateY: -1.3,
    duration: 8.8,
    delay: 0.6,
    parallax: 6,
    tilt: 1.2,
  },
  {
    id: "chip-2",
    clipPath: "polygon(43% 26%, 74% 26%, 74% 58%, 43% 58%)",
    idleX: -6,
    idleY: 10,
    rotateZ: -2.4,
    rotateX: -1.5,
    rotateY: 2,
    duration: 7.6,
    delay: 1.3,
    parallax: 8,
    tilt: 1.8,
  },
  {
    id: "chip-3",
    clipPath: "polygon(27% 53%, 62% 53%, 62% 80%, 27% 80%)",
    idleX: 8,
    idleY: -12,
    rotateZ: 2.8,
    rotateX: 1.8,
    rotateY: -2.5,
    duration: 7,
    delay: 0.15,
    parallax: 10,
    tilt: 2.4,
  },
  {
    id: "chip-4",
    clipPath: "polygon(8% 76%, 54% 76%, 54% 100%, 8% 100%)",
    idleX: -5,
    idleY: 5,
    rotateZ: -1.3,
    rotateX: -1,
    rotateY: 1.2,
    duration: 9.8,
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
        duration: preset.duration,
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
    <div
      aria-hidden="true"
      className="relative h-full w-full [perspective:900px]"
    >
      {chipPresets.map((preset, index) => (
        <div key={preset.id} className="absolute inset-0">
          <div
            ref={(element) => {
              parallaxRefs.current[index] = element;
            }}
            data-chip-id={preset.id}
            className="absolute inset-0 will-change-transform"
          >
            <div
              ref={(element) => {
                idleRefs.current[index] = element;
              }}
              style={{ clipPath: preset.clipPath }}
              className="absolute inset-0 will-change-transform [transform-style:preserve-3d]"
            >
              <Image
                src="/chips/magnum-chip-cta.webp"
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 600px"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
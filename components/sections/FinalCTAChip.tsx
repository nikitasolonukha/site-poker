"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type MotionVariant = "A" | "B";

const motionPresets = {
  A: {
    duration: 9.5,
    delay: 0.4,
    idleX: 2,
    idleY: 3,
    rotateZ: 1.2,
    rotateX: 1.1,
    rotateY: -1.4,
    parallax: 6,
    tilt: 1.5,
    smoothing: 0.055,
  },
  B: {
    duration: 8.8,
    delay: 0.15,
    idleX: 4,
    idleY: 5,
    rotateZ: 2,
    rotateX: 1.8,
    rotateY: -2.2,
    parallax: 12,
    tilt: 3,
    smoothing: 0.07,
  },
} as const;

export default function FinalCTAChip() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);
  const [motionVariant] = useState<MotionVariant>(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("chipMotion") === "B"
      ? "B"
      : "A",
  );

  useEffect(() => {
    const parallaxElement = parallaxRef.current;
    const idleElement = idleRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const section = parallaxElement?.closest("section");

    if (!parallaxElement || !idleElement || !section || reducedMotion.matches) {
      return;
    }

    const preset = motionPresets[motionVariant];
    const idleTween = gsap.to(idleElement, {
      x: preset.idleX,
      y: -preset.idleY,
      rotation: preset.rotateZ,
      rotationX: preset.rotateX,
      rotationY: preset.rotateY,
      duration: preset.duration,
      delay: preset.delay,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    if (!finePointer.matches) {
      return () => idleTween.kill();
    }

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const updatePointerMotion = () => {
      currentX += (targetX - currentX) * preset.smoothing;
      currentY += (targetY - currentY) * preset.smoothing;

      parallaxElement.style.transform = [
        `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`,
        `rotateX(${(-currentY * preset.tilt / preset.parallax).toFixed(2)}deg)`,
        `rotateY(${(currentX * preset.tilt / preset.parallax).toFixed(2)}deg)`,
      ].join(" ");

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

      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetX = normalizedX * 2 * preset.parallax;
      targetY = normalizedY * 2 * preset.parallax;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame = window.requestAnimationFrame(updatePointerMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      idleTween.kill();
      gsap.set([parallaxElement, idleElement], { clearProps: "transform" });
    };
  }, [motionVariant]);

  return (
    <div
      ref={parallaxRef}
      aria-hidden="true"
      data-chip-motion={motionVariant}
      className="relative h-full w-full will-change-transform [perspective:900px]"
    >
      <div
        ref={idleRef}
        className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
      >
        <span className="absolute bottom-[17%] left-[18%] h-[15%] w-[64%] rounded-[50%] bg-black/35 blur-2xl" />
        <Image
          src="/magnum-chip.svg"
          alt=""
          fill
          className="z-10 object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
          sizes="(max-width: 768px) 80vw, 600px"
        />
      </div>
    </div>
  );
}
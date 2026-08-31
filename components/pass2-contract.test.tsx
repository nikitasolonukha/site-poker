import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { gallery } from "../data/gallery";
import { whyFeatures } from "../data/why";
import { siteConfig } from "../config/site";

const projectFile = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("PASS 2 visual system contract", () => {
  it("provides one compact MAGNUM ChipRail component", async () => {
    const componentPath = resolve(process.cwd(), "components/ui/ChipRail.tsx");
    expect(existsSync(componentPath)).toBe(true);
    if (!existsSync(componentPath)) return;

    const modulePath = "./ui/ChipRail";
    const { default: ChipRail } = await import(/* @vite-ignore */ modulePath);
    render(<ChipRail denomination="500" />);

    const rail = screen.getByTestId("chip-rail");
    expect(rail).toHaveAttribute("data-denomination", "500");
    expect(rail).toHaveAttribute("data-motion", "subtle");
    expect(screen.getAllByText("MAGNUM").length).toBeGreaterThan(1);
    expect(screen.getAllByText("500").length).toBeGreaterThan(1);
    expect(screen.getByTestId("poker-chip")).toHaveAttribute(
      "data-asset",
      "/poker-kit/chip-500.png",
    );
  });

  it("uses only two intermediate CTAs and shared configuration links", () => {
    const page = projectFile("app/page.tsx");

    expect(page).toContain("<ChipRail");
    expect(page).not.toContain("ChipDivider");
    expect(page).not.toContain("ОСТАЛИСЬ СОМНЕНИЯ");
    expect(page.match(/<MagnumCTA/g)).toHaveLength(2);
    expect(page).toContain("siteConfig.telegram");
    expect(page).toContain("siteConfig.bookingUrl");
  });

  it("keeps Hero layout separate from the 3D chip interaction", () => {
    const hero = projectFile("components/sections/Hero.tsx");

    expect(hero).toContain("chipPositionRef");
    expect(hero).toContain("MagnumChip3D");
    expect(hero).toContain("ssr: false");
    expect(hero).not.toContain("/magnum-chip.svg");
    expect(hero).not.toContain("<img");
    expect(hero).not.toContain("rotateY: -540");
    expect(hero).not.toContain("chipSpinRef");
  });

  it("integrates the licensed 3D MAGNUM Hero chip without a 2D fallback", () => {
    const chipPath = resolve(process.cwd(), "components/hero/MagnumChip3D.tsx");
    const creditsPath = resolve(process.cwd(), "public/THIRD_PARTY_ASSETS.md");

    expect(existsSync(resolve(process.cwd(), "public/models/magnum-chip-base.glb"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "public/models/magnum-chip.glb"))).toBe(true);
    expect(existsSync(chipPath)).toBe(true);
    expect(existsSync(creditsPath)).toBe(true);
    if (!existsSync(chipPath) || !existsSync(creditsPath)) return;

    const chip = readFileSync(chipPath, "utf8");
    const hero = projectFile("components/sections/Hero.tsx");
    const credits = readFileSync(creditsPath, "utf8");

    expect(chip).toContain('useGLTF("/models/magnum-chip.glb")');
    expect(chip).toContain("ContactShadows");
    expect(chip).not.toContain("useTexture");
    expect(chip).toContain("dpr={[1, 1.5]}");
    expect(chip).toContain('frameloop="always"');
    expect(chip).toContain('dispose={null}');
    expect(chip).toContain("isAnimatingRef");
    expect(chip).toContain("object.castShadow = true");
    expect(chip).not.toContain("object.material = new THREE.MeshStandardMaterial");
    expect(chip).toContain("hasPaintedRef");
    expect(chip).toContain("<Suspense fallback={null}>");
    expect(chip).toContain("onCreated");
    expect(hero).toContain("MagnumChip3D");
    expect(hero).toContain("<MagnumChip3D />");
    expect(hero).not.toContain("isChip3DReady");
    expect(credits).toContain("Casino Poker Chip");
    expect(credits).toContain("CC BY 4.0");
  });
  it("keeps the original pinned About video treatment", () => {
    const about = projectFile("components/sections/About.tsx");

    expect(about).toMatch(/pin:\s*true/);
    expect(about).not.toContain("sticky-about");
    expect(about).toContain("video-mobile-fallback");
    expect(about).toContain('end: "+=120%"');
  });

  it("uses the supplied Why MAGNUM media", () => {
    expect(whyFeatures.map((feature) => feature.media)).toEqual([
      "/why/building.webp",
      "/why/parking.png",
      "/why/food-court.png",
    ]);

    for (const feature of whyFeatures) {
      expect(existsSync(resolve(process.cwd(), "public", feature.media!.slice(1)))).toBe(true);
    }

    const why = projectFile("components/sections/WhyMagnum.tsx");
    expect(why).toContain("src={feature.media}");
  });

  it("renders Formats as click-selected 3D playing cards without auto switch", () => {
    const formats = projectFile("components/sections/GameFormats.tsx");

    expect(formats).toContain("/magnum-card.svg");
    expect(formats).toContain("card-inner");
    expect(formats).toContain("card-back");
    expect(formats).toContain("card-front");
    expect(formats).toContain('data-state="transitioning"');
    expect(formats).not.toMatch(/setInterval|auto.?switch/i);
  });

  it("keeps Gallery visible in a deterministic non-pinned sticky scene", () => {
    const gallerySource = projectFile("components/sections/Gallery.tsx");

    expect(gallerySource).not.toMatch(/pin:\s*true/);
    expect(gallerySource).not.toContain("md:opacity-0");
    expect(gallerySource).toContain("gallery-sticky");
    expect(gallerySource).toContain("gsap.matchMedia()");
    expect(gallerySource).toContain("invalidateOnRefresh: true");
    expect(gallerySource).toContain("md:h-[calc(100svh-280px)]");
    expect(gallerySource).toContain("const revealTimeline");
    expect(gallerySource).toContain("clipPath: \"inset(20% 16% 20% 16%)\"");
    expect(gallerySource).toContain("stagger: 0.08");
    expect(gallerySource).toContain('end: "bottom bottom"');
    expect(gallery).toHaveLength(8);
    expect(new Set(gallery.map((item) => item.src)).size).toBe(8);
    expect(gallery.every((item) => item.caption.includes("/ 08"))).toBe(true);
  });

  it("places the supplied card-group illustration beside the final CTA", () => {
    const finalCta = projectFile("components/sections/FinalCTA.tsx");

    expect(existsSync(resolve(process.cwd(), "public/final-cta-cards.svg"))).toBe(true);
    expect(finalCta).toContain("/final-cta-cards.svg");
    expect(finalCta).toContain("final-cta-cards");
    expect(finalCta).toContain("md:right-[7%]");
  });
  it("removes the map overlay and keeps CTA chip motion restrained", () => {
    const location = projectFile("components/sections/Location.tsx");
    const cta = projectFile("components/ui/MagnumCTA.tsx");

    expect(location).not.toContain("/magnum-card.svg");
    expect(cta).toContain("handleEnter");
    expect(cta).toContain("handleLeave");
    expect(cta).toContain("x: 32");
    expect(cta).toContain("rotation: 95");
    expect(cta).toContain("w-[46px]");
  });

  it("uses the requested shared conversion destinations", () => {
    expect(siteConfig.bookingUrl).toBe("https://t.me/magnum_poker");
    expect(siteConfig.telegram).toBe("https://t.me/magnum_poker");
  });

  it("contains no QUANTUM branding in the active implementation", () => {
    const activeSources = [
      "app/page.tsx",
      "components/sections/Hero.tsx",
      "components/sections/About.tsx",
      "components/sections/WhyMagnum.tsx",
      "components/sections/GameFormats.tsx",
      "components/sections/Gallery.tsx",
      "components/sections/Location.tsx",
      "components/ui/MagnumCTA.tsx",
    ].map(projectFile);

    expect(activeSources.join("\n")).not.toMatch(/quantum/i);
  });
});

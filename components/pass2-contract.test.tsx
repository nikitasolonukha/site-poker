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

  it("separates Hero scroll and interactive transforms", () => {
    const hero = projectFile("components/sections/Hero.tsx");

    expect(hero).toContain("chipScrollRef");
    expect(hero).toContain("chipInteractiveRef");
    expect(hero).toContain("handleChipClick");
    expect(hero).toContain("chip-face--front");
    expect(hero).toContain("chip-face--back");
    expect(hero).toContain("prefers-reduced-motion");
  });

  it("keeps About video visible inside a non-pinned sticky scene", () => {
    const about = projectFile("components/sections/About.tsx");

    expect(about).not.toMatch(/pin:\s*true/);
    expect(about).toContain("sticky-about");
    expect(about).toContain("gsap.matchMedia()");
    expect(about).toContain('poster="/gallery/image-3.webp"');
  });

  it("uses only confirmed Why Magnum media", () => {
    expect(whyFeatures.every((feature) => feature.media === null)).toBe(true);

    const why = projectFile("components/sections/WhyMagnum.tsx");
    expect(why).toContain("feature.media === null");
    expect(why).toContain("MAGNUM");
    expect(why).not.toContain("rounded-full");
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
    expect(gallery).toHaveLength(8);
    expect(new Set(gallery.map((item) => item.src)).size).toBe(8);
    expect(gallery.every((item) => item.caption.includes("/ 08"))).toBe(true);
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

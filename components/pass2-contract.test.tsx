import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { gallery } from "../data/gallery";
import { reviews } from "../data/reviews";
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

  it("keeps Hero layout separate from the resilient 3D chip interaction", () => {
    const hero = projectFile("components/sections/Hero.tsx");

    expect(hero).toContain("chipPositionRef");
    expect(hero).toContain("MagnumChip3D");
    expect(hero).toContain("ssr: false");
    expect(hero).toContain("/magnum-chip.svg");
    expect(hero).toContain("chip3DReady");
    expect(hero).toContain("chip3DError");
    expect(hero).not.toContain("rotateY: -540");
    expect(hero).not.toContain("chipSpinRef");
  });

  it("integrates the licensed 3D MAGNUM Hero chip with a safe SVG fallback", () => {
    const chipPath = resolve(process.cwd(), "components/hero/MagnumChip3D.tsx");
    const creditsPath = resolve(process.cwd(), "public/THIRD_PARTY_ASSETS.md");

    expect(existsSync(resolve(process.cwd(), "public/models/magnum-chip-base.glb"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "public/models/magnum-chip.glb"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "public/textures/magnum-chip-face.webp"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "scripts/build-magnum-chip.py"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "assets/blender/magnum-chip.blend"))).toBe(true);
    expect(existsSync(chipPath)).toBe(true);
    expect(existsSync(creditsPath)).toBe(true);
    if (!existsSync(chipPath) || !existsSync(creditsPath)) return;

    const chip = readFileSync(chipPath, "utf8");
    const hero = projectFile("components/sections/Hero.tsx");
    const credits = readFileSync(creditsPath, "utf8");

    expect(chip).toContain('useGLTF("/models/magnum-chip.glb")');
    expect(chip).toContain("ContactShadows");
    expect(chip).not.toContain("useTexture");
    expect(chip).toContain("const maxDpr");
    expect(chip).toContain("? 1.25 : 1.5");
    expect(chip).toContain("dpr={[1, maxDpr]}");
    expect(chip).toContain('frameloop="demand"');
    expect(chip).toContain("new THREE.Box3()");
    expect(chip).toContain("getCenter");
    expect(chip).toContain("ChipSceneErrorBoundary");
    expect(chip).not.toContain("rotation={[Math.PI / 2, 0, 0]}");
    expect(chip).toContain('dispose={null}');
    expect(chip).not.toContain("isAnimatingRef");
    expect(chip).toContain("object.castShadow = true");
    expect(chip).not.toContain("object.material = new THREE.MeshStandardMaterial");
    expect(chip).toContain("hasPaintedRef");
    expect(chip).not.toContain("FLIP_DURATION");
    expect(chip).not.toContain("Math.PI * 2");
    expect(chip).not.toContain("onPointerMove");
    expect(chip).not.toContain("onClick");
    expect(chip).toContain("<Suspense fallback={null}>");
    expect(chip).toContain("onCreated");
    expect(hero).toContain("MagnumChip3D");
    expect(hero).toContain("<MagnumChip3D");
    expect(hero).toContain("chip3DReady");
    expect(hero).toContain("chip3DError");
    expect(hero).toContain("ChipSvgFallback");
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


  it("uses the dark vertical stacked-scroll system for Why Magnum", () => {
    const why = projectFile("components/sections/WhyMagnum.tsx");

    expect(why).not.toContain("magnum-paper");
    expect(why).toContain("#08090B");
    expect(why).toContain("#21060C");
    expect(why).toContain("#F1EFE9");
    expect(why).toContain("#B22554");
    expect(why).toContain("bg-[#11090B]");
    expect(why).toContain("bg-[#18090D]");
    expect(why).toContain("bg-[#21070F]");
    expect(why).toContain("relative overflow-x-clip pb-16");
    expect(why).toContain("relative z-10 space-y-6 md:space-y-0 md:pb-[26vh]");
    expect(why).toContain("md:sticky");
    expect(why).toContain("md:top-[13vh]");
    expect(why).toContain("md:w-[82vw]");
    expect(why).toContain("md:min-h-[66svh]");
    expect(why).toContain("md:pb-[26vh]");
    expect(why).toContain('y: "52vh"');
    expect(why).toContain("scale: 0.985");
    expect(why).toContain("rotation: -0.8");
    expect(why).toContain("scale: 0.955");
    expect(why).toContain("opacity: 0.72");
    expect(why).toContain("scale: 0.978");
    expect(why).toContain("opacity: 0.86");
    expect(why).toContain("scrub: 0.65");
    expect(why).not.toContain("rotationY");
    expect(why).not.toContain("transformPerspective");
    expect(why).not.toContain("pin: true");
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

  it("publishes exactly the three verified Yandex Maps review excerpts", () => {
    expect(reviews).toHaveLength(3);
    expect(reviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "yandex-1",
          author: "Дима Ярец",
          quote: "«Лучший клуб покера из всех, где я был»",
          body:
            "«Играю в этом клубе далеко не первый раз и всегда с огромным удовольствием. Всегда радует качество и скорость обслуживания.»",
          source: "Яндекс Карты",
          sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
        }),
        expect.objectContaining({
          id: "yandex-2",
          author: "Алёна Бикеева",
          quote: "«Очень тёплое и уютное место»",
          body:
            "«Приходишь — и сразу чувствуешь атмосферу: спокойная игра, приятные люди, всё по-домашнему.»",
        }),
        expect.objectContaining({
          id: "yandex-3",
          author: "1TLM",
          quote: "«Персонал на высшем уровне»",
          body: "«Очень советую посетить это место, очень уютная атмосфера.»",
        }),
      ]),
    );
  });

  it("renders the verified reviews as an editorial slider with an active review and next preview", async () => {
    const modulePath = "./sections/Reviews";
    const { default: Reviews } = await import(/* @vite-ignore */ modulePath);
    render(<Reviews />);

    expect(screen.getByRole("heading", { name: "ОТЗЫВЫ" })).toBeInTheDocument();
    expect(screen.getByText("4.7 ★")).toBeInTheDocument();
    expect(screen.getByText("27 ОЦЕНОК")).toBeInTheDocument();
    expect(screen.getByText("17 ОТЗЫВОВ")).toBeInTheDocument();
    expect(screen.getByTestId("reviews-slider")).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByTestId("review-slide-yandex-1")).toHaveAttribute("aria-current", "true");
    expect(screen.getByTestId("review-slide-yandex-2")).toHaveAttribute("data-position", "next");
    expect(screen.getByText("«Лучший клуб покера из всех, где я был»")).toBeInTheDocument();
    expect(screen.getByTestId("reviews-progress-chip")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Предыдущий отзыв" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Следующий отзыв" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Смотреть все 17 отзывов/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("uses an accessible editorial review track between Gallery and Location", () => {
    const page = projectFile("app/page.tsx");
    const reviewsSection = projectFile("components/sections/Reviews.tsx");

    expect(page.indexOf("<Gallery />")).toBeLessThan(page.indexOf("<Reviews />"));
    expect(page.indexOf("<Reviews />")).toBeLessThan(page.indexOf("<Location />"));
    expect(reviewsSection).toContain("rgba(125, 11, 41, .16)");
    expect(reviewsSection).toContain("27 ОЦЕНОК");
    expect(reviewsSection).toContain('aria-roledescription="carousel"');
    expect(reviewsSection).toContain("onPointerDown");
    expect(reviewsSection).toContain("onPointerMove");
    expect(reviewsSection).toContain("onPointerUp");
    expect(reviewsSection).toContain("ArrowRight");
    expect(reviewsSection).toContain("power3.inOut");
    expect(reviewsSection).toContain("duration: prefersReducedMotion() ? 0 : 0.72");
    expect(reviewsSection).toContain("magnum-chip.svg");
    expect(reviewsSection).not.toContain("reviewChips");
    expect(reviewsSection).not.toContain("data-review-card");
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
    expect(cta).toContain('"/chips/magnum-chip-cta.webp"');
    expect(cta).toContain('sizes="(min-width: 768px) 42px, 32px"');
    expect(cta).toContain("width={42}");
    expect(cta).toContain("height={42}");
    expect(cta).toContain("object-contain");
    expect(cta).toContain("unoptimized");
    expect(cta).toContain("x: 3");
    expect(cta).toContain("rotation: 3");
    expect(cta).not.toContain("rotation: 95");
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

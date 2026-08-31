import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type CardPresentation = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

type GetCardPresentation = (
  index: number,
  hoveredIndex: number | null,
  selectedIndex: number | null,
) => CardPresentation;

const loadPresentation = async () => {
  const helperPath = resolve(
    process.cwd(),
    "components/sections/gameFormatsInteraction.ts",
  );
  expect(existsSync(helperPath)).toBe(true);
  if (!existsSync(helperPath)) return undefined;

  const modulePath = "./gameFormatsInteraction";
  const interactionModule = await import(/* @vite-ignore */ modulePath);
  return (interactionModule as unknown as {
    getCardPresentation?: GetCardPresentation;
  }).getCardPresentation;
};

describe("Game Formats interaction", () => {
  it("uses the approved wider deterministic default fan", async () => {
    const getCardPresentation = await loadPresentation();
    expect(getCardPresentation).toBeTypeOf("function");
    if (!getCardPresentation) return;

    expect(getCardPresentation(0, null, null)).toMatchObject({
      x: -120,
      y: 0,
      rotation: -9,
      scale: 1,
      opacity: 1,
    });
    expect(getCardPresentation(1, null, null)).toMatchObject({
      x: 0,
      y: -10,
      rotation: 0,
    });
    expect(getCardPresentation(2, null, null)).toMatchObject({
      x: 120,
      y: 0,
      rotation: 9,
    });
  });

  it("lifts one hovered card while calmly moving its neighbors aside", async () => {
    const getCardPresentation = await loadPresentation();
    expect(getCardPresentation).toBeTypeOf("function");
    if (!getCardPresentation) return;

    expect(getCardPresentation(0, 1, null).x).toBe(-145);
    expect(getCardPresentation(1, 1, null)).toMatchObject({
      x: 0,
      y: -22,
      rotation: 0,
      scale: 1.02,
    });
    expect(getCardPresentation(2, 1, null).x).toBe(145);
  });

  it("keeps the selected card stable and moves the other two aside", async () => {
    const getCardPresentation = await loadPresentation();
    expect(getCardPresentation).toBeTypeOf("function");
    if (!getCardPresentation) return;

    expect(getCardPresentation(0, 0, 0)).toMatchObject({
      x: -40,
      y: -35,
      rotation: 0,
      scale: 1.04,
      opacity: 1,
      zIndex: 20,
    });
    expect(getCardPresentation(1, 0, 0)).toMatchObject({
      x: 145,
      y: 12,
      rotation: 5,
      scale: 0.96,
    });
    expect(getCardPresentation(2, 0, 0).x).toBe(285);
  });

  it("separates spacing state from the 3D flip state", () => {
    const source = readFileSync(
      resolve(process.cwd(), "components/sections/GameFormats.tsx"),
      "utf8",
    );

    expect(source).toContain("const [isTransitioning, setIsTransitioning]");
    expect(source).toContain("const [flippedIndex, setFlippedIndex]");
    expect(source).toContain("SELECT_SPACING_MS = 400");
  });
});

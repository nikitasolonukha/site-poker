import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const componentPath = resolve(process.cwd(), "components/sections/FinalCTAChip.tsx");

describe("Final CTA chip motion", () => {
  it("provides restrained A/B motion with pointer smoothing and reduced-motion support", () => {
    expect(existsSync(componentPath)).toBe(true);
    if (!existsSync(componentPath)) return;

    const source = readFileSync(componentPath, "utf8");
    expect(source).toContain('"chipMotion"');
    expect(source).toContain("requestAnimationFrame");
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).toContain("pointermove");
    expect(source).toContain("duration: 9.5");
    expect(source).toContain("duration: 8.8");
    expect(source).toContain("parallax: 6");
    expect(source).toContain("parallax: 12");
    expect(source).not.toMatch(/elastic|bounce|wiggle|rotate\([^)]*180/i);
  });
});
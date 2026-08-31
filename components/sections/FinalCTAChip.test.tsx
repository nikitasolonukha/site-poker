import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const componentPath = resolve(process.cwd(), "components/sections/FinalCTAChip.tsx");

describe("Final CTA chip motion", () => {
  it("gives all four rendered chips individually paced visible rocking", () => {
    expect(existsSync(componentPath)).toBe(true);
    if (!existsSync(componentPath)) return;

    const source = readFileSync(componentPath, "utf8");
    expect(source).toContain("const chipPresets");
    expect(source).toContain('id: "chip-1"');
    expect(source).toContain('id: "chip-2"');
    expect(source).toContain('id: "chip-3"');
    expect(source).toContain('id: "chip-4"');
    expect(source).toContain('src="/chips/magnum-chip-cta.webp"');
    expect(source).toContain("clipPath: preset.clipPath");
    expect(source).toContain("duration: 8.8");
    expect(source).toContain("duration: 7.6");
    expect(source).toContain("duration: 7");
    expect(source).toContain("duration: 9.8");
    expect(source).toContain("parallax: 6");
    expect(source).toContain("parallax: 14");
    expect(source).toContain("requestAnimationFrame");
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).not.toMatch(/elastic|bounce|wiggle|rotate\([^)]*180/i);
    const styles = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
    expect(styles).not.toContain("final-chip-float");
  });
});
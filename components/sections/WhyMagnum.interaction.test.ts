import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = () =>
  readFileSync(resolve(process.cwd(), "components/sections/WhyMagnum.tsx"), "utf8");

describe("Why Magnum sticky stack", () => {
  it("uses a shared pure-CSS sticky stack without JS geometry", () => {
    const why = source();

    expect(why).toContain("why-stack");
    expect(why).toContain("why-stack-card");
    expect(why).toContain("md:sticky");
    expect(why).toContain(
      "md:top-[calc(var(--stack-top)+var(--index)*var(--peek))]",
    );
    expect(why).toContain('"--stack-top": "112px"');
    expect(why).toContain('"--peek": "14px"');
    expect(why).toContain('style={{ "--index": index, zIndex: 10 + index * 10 } as CSSProperties}');
    expect(why).toContain("why-stack-reading-space hidden md:block md:h-[82svh]");
    expect(why).toContain("why-stack-end-space hidden h-[36svh] md:block");
  });

  it("keeps card geometry out of GSAP and ScrollTrigger", () => {
    const why = source();

    expect(why).not.toContain("gsap");
    expect(why).not.toContain("ScrollTrigger");
    expect(why).not.toContain("data-why-scroll-marker");
    expect(why).not.toContain("transform-gpu");
    expect(why).not.toContain("will-change-transform");
  });
});

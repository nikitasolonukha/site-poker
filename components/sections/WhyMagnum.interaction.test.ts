import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = () =>
  readFileSync(resolve(process.cwd(), "components/sections/WhyMagnum.tsx"), "utf8");

describe("Why Magnum stacked scroll", () => {
  it("uses non-sticky flow markers to drive card entrances", () => {
    const why = source();

    expect(why).toContain("data-why-scroll-marker");
    expect(why).toContain("marker.style.top = `${card.offsetTop}px`");
    expect(why).toContain("trigger: markers[index]");
    expect(why).toContain('ScrollTrigger.addEventListener("refreshInit", syncMarkers)');
  });
});

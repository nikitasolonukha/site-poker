import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = () =>
  readFileSync(resolve(process.cwd(), "components/sections/WhyMagnum.tsx"), "utf8");

describe("Why Magnum stacked scroll", () => {
  it("uses non-sticky flow markers to drive card entrances", () => {
    const why = source();

    expect(why).toContain("data-why-scroll-marker");
    expect(why).toContain("card.offsetTop + entryDelay");
    expect(why).toContain("trigger: markers[index]");
    expect(why).toContain('ScrollTrigger.addEventListener("refreshInit", syncMarkers)');
  });
  it("begins the third card from the completed second-card entry", () => {
    const why = source();

    expect(why).toContain("const entryTweens");
    expect(why).toContain("const secondEntryTrigger = entryTweens[index - 1]?.scrollTrigger");
    expect(why).toContain("secondEntryTrigger.end + 1");
    expect(why).toContain("window.innerHeight * THIRD_CARD_ENTRY_DISTANCE");
  });
});

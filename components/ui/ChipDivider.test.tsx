import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChipDivider from "./ChipDivider";
import PokerChip from "./PokerChip";

describe("PokerChip", () => {
  it("renders the requested denomination and tone", () => {
    render(<PokerChip value="25K" tone="pink" />);

    const chip = screen.getByRole("img", { name: "Фишка 25K" });
    expect(chip).toHaveAttribute("data-tone", "pink");
    expect(chip).toHaveAttribute("data-asset", "/poker-kit/chip-25k.png");
    expect(chip.querySelector("img")?.getAttribute("src")).toContain("chip-25k.png");
  });

  it("can be hidden from assistive technology when decorative", () => {
    render(<PokerChip value="500" tone="red" decorative />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByTestId("poker-chip")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ChipDivider", () => {
  it("renders a doubled ticker, a chip, and the requested direction", () => {
    render(
      <ChipDivider
        value="5K"
        tone="violet"
        direction="reverse"
      />,
    );

    const divider = screen.getByTestId("chip-divider");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveAttribute("data-tone", "violet");
    expect(screen.getAllByTestId("chip-divider-segment")).toHaveLength(2);
    expect(screen.getByTestId("chip-divider-track")).toHaveAttribute(
      "data-direction",
      "reverse",
    );
    screen.getAllByTestId("chip-divider-segment").forEach((segment) => {
      expect(segment).toHaveAttribute("data-asset", "/poker-kit/rail-5k.svg");
    });
    expect(screen.getByTestId("poker-chip")).toHaveAttribute(
      "data-asset",
      "/poker-kit/chip-5k.png",
    );
  });
});

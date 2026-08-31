import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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


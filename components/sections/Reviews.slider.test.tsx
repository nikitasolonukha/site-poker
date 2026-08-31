import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Reviews from "./Reviews";

describe("Reviews editorial slider", () => {
  it("shows one active review and a visible next preview instead of a card grid", () => {
    render(<Reviews />);

    expect(screen.getByTestId("reviews-slider")).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
    expect(screen.getByTestId("review-slide-yandex-1")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByTestId("review-slide-yandex-2")).toHaveAttribute(
      "data-position",
      "next",
    );
    expect(screen.getByTestId("reviews-progress-chip")).toBeInTheDocument();
  });

  it("moves reviews with buttons and keyboard arrows", () => {
    render(<Reviews />);

    const slider = screen.getByTestId("reviews-slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(screen.getByTestId("review-slide-yandex-2")).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Предыдущий отзыв" }));

    expect(screen.getByTestId("review-slide-yandex-1")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Следующий отзыв" })).toBeInTheDocument();
  });

  it("keeps the full Yandex Maps review collection available as an external link", () => {
    render(<Reviews />);

    const cta = screen.getByRole("link", { name: /Смотреть все 17 отзывов/i });
    expect(cta).toHaveAttribute("href", "https://yandex.ru/maps/-/CTTRFVMQ");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });
});
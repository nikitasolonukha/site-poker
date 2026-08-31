import Image from "next/image";
import type { CSSProperties } from "react";

export type ChipValue = "100" | "500" | "1K" | "5K" | "25K" | "100K" | "BOUNTY";
export type ChipTone = "black" | "red" | "yellow" | "violet" | "pink" | "orange" | "bounty";

const chipAssets: Record<ChipValue, string> = {
  "100": "/poker-kit/chip-100.png",
  "500": "/poker-kit/chip-500.png",
  "1K": "/poker-kit/chip-1k.png",
  "5K": "/poker-kit/chip-5k.png",
  "25K": "/poker-kit/chip-25k.png",
  "100K": "/poker-kit/chip-100k.png",
  BOUNTY: "/poker-kit/chip-bounty.png",
};

export const chipTones: Record<ChipValue, ChipTone> = {
  "100": "black",
  "500": "red",
  "1K": "yellow",
  "5K": "violet",
  "25K": "pink",
  "100K": "orange",
  BOUNTY: "bounty",
};

type PokerChipProps = {
  value: ChipValue;
  tone?: ChipTone;
  decorative?: boolean;
  className?: string;
  size?: string;
};

export default function PokerChip({
  value,
  tone = chipTones[value],
  decorative = false,
  className = "",
  size = "100%",
}: PokerChipProps) {
  const asset = chipAssets[value];

  return (
    <span
      className={`poker-chip ${className}`}
      data-asset={asset}
      data-testid="poker-chip"
      data-tone={tone}
      data-value={value}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `Фишка ${value}`}
      aria-hidden={decorative ? "true" : undefined}
      style={{ "--poker-chip-size": size } as CSSProperties}
    >
      <Image src={asset} alt="" fill draggable={false} sizes={size} className="poker-chip__image" />
    </span>
  );
}

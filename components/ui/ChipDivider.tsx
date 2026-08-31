import Image from "next/image";
import PokerChip, { chipTones, type ChipTone, type ChipValue } from "./PokerChip";

const railAssets: Record<ChipValue, string> = {
  "100": "/poker-kit/rail-100.svg",
  "500": "/poker-kit/rail-500.svg",
  "1K": "/poker-kit/rail-1k.svg",
  "5K": "/poker-kit/rail-5k.svg",
  "25K": "/poker-kit/rail-25k.svg",
  "100K": "/poker-kit/rail-100k.svg",
  BOUNTY: "/poker-kit/rail-bounty.svg",
};

type ChipDividerProps = {
  value: ChipValue;
  tone?: ChipTone;
  direction?: "forward" | "reverse";
  chipSide?: "left" | "right";
  surface?: "dark" | "paper" | "wine";
};

export default function ChipDivider({
  value,
  tone = chipTones[value],
  direction = "forward",
  chipSide = "right",
  surface = "dark",
}: ChipDividerProps) {
  const railAsset = railAssets[value];

  return (
    <div
      aria-hidden="true"
      className="chip-divider"
      data-testid="chip-divider"
      data-alignment="straight"
      data-emphasis="subtle"
      data-surface={surface}
      data-tone={tone}
    >
      <div className="chip-divider__rail">
        <div className="chip-divider__track" data-direction={direction} data-testid="chip-divider-track">
          {[0, 1].map((copy) => (
            <span
              className="chip-divider__segment"
              data-asset={railAsset}
              data-testid="chip-divider-segment"
              key={copy}
            >
              <Image
                src={railAsset}
                alt=""
                fill
                draggable={false}
                sizes="max(1180px, 145vw)"
                className="chip-divider__rail-image"
              />
            </span>
          ))}
        </div>
      </div>

      <div className={`chip-divider__chip chip-divider__chip--${chipSide}`}>
        <PokerChip value={value} tone={tone} decorative size="clamp(64px, 7vw, 96px)" />
      </div>
    </div>
  );
}

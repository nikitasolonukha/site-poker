import Image from "next/image";
import type { CSSProperties } from "react";
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
  angle?: number;
};

export default function ChipDivider({
  value,
  tone = chipTones[value],
  direction = "forward",
  chipSide = "right",
  angle = -2,
}: ChipDividerProps) {
  const railAsset = railAssets[value];

  return (
    <div
      aria-hidden="true"
      className="chip-divider"
      data-testid="chip-divider"
      data-tone={tone}
      style={{ "--chip-divider-angle": `${angle}deg` } as CSSProperties}
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
        <PokerChip value={value} tone={tone} decorative size="clamp(92px, 11vw, 158px)" />
      </div>
    </div>
  );
}

export type CardPresentation = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const defaultFan: CardPresentation[] = [
  { x: -120, y: 0, rotation: -9, scale: 1, opacity: 1, zIndex: 10 },
  { x: 0, y: -10, rotation: 0, scale: 1, opacity: 1, zIndex: 12 },
  { x: 120, y: 0, rotation: 9, scale: 1, opacity: 1, zIndex: 11 },
];

const hoverX = [
  [-135, 20, 145],
  [-145, 0, 145],
  [-145, -20, 135],
];

const selectedFans: CardPresentation[][] = [
  [
    { x: -40, y: -35, rotation: 0, scale: 1.04, opacity: 1, zIndex: 20 },
    { x: 145, y: 12, rotation: 5, scale: 0.96, opacity: 0.84, zIndex: 11 },
    { x: 285, y: 20, rotation: 12, scale: 0.94, opacity: 0.8, zIndex: 10 },
  ],
  [
    { x: -230, y: 15, rotation: -12, scale: 0.96, opacity: 0.82, zIndex: 10 },
    { x: 0, y: -35, rotation: 0, scale: 1.04, opacity: 1, zIndex: 20 },
    { x: 230, y: 15, rotation: 12, scale: 0.96, opacity: 0.82, zIndex: 11 },
  ],
  [
    { x: -285, y: 20, rotation: -12, scale: 0.94, opacity: 0.8, zIndex: 10 },
    { x: -145, y: 12, rotation: -5, scale: 0.96, opacity: 0.84, zIndex: 11 },
    { x: 40, y: -35, rotation: 0, scale: 1.04, opacity: 1, zIndex: 20 },
  ],
];

export function getCardPresentation(
  index: number,
  hoveredIndex: number | null,
  selectedIndex: number | null,
): CardPresentation {
  if (selectedIndex !== null) {
    const selectedPresentation = selectedFans[selectedIndex][index];

    if (hoveredIndex === index && index !== selectedIndex) {
      return {
        ...selectedPresentation,
        y: selectedPresentation.y - 10,
        scale: Math.min(selectedPresentation.scale + 0.015, 1),
        opacity: Math.min(selectedPresentation.opacity + 0.08, 0.92),
        zIndex: 15,
      };
    }

    return selectedPresentation;
  }

  const base = defaultFan[index];
  if (hoveredIndex === null) return base;

  if (hoveredIndex === index) {
    return {
      ...base,
      x: hoverX[hoveredIndex][index],
      y: -22,
      rotation: 0,
      scale: 1.02,
      zIndex: 20,
    };
  }

  return {
    ...base,
    x: hoverX[hoveredIndex][index],
  };
}

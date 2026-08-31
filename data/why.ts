export type WhyFeature = {
  id: string;
  title: string;
  description: string;
  media: string | null;
};

export const whyFeatures: WhyFeature[] = [
  {
    id: "location",
    title: "ЛОКАЦИЯ",
    description: "Москва,\nБольшая Новодмитровская улица,\n36с13.",
    media: "/why/building.webp",
  },
  {
    id: "parking",
    title: "ПАРКОВКА",
    description: "Удобство для гостей клуба.\nДетали парковки уточняются.",
    media: "/why/parking.png",
  },
  {
    id: "food-courts",
    title: "ФУДКОРТЫ",
    description: "Рядом с клубом — фудкорты и места, где можно поужинать после игры.",
    media: "/why/food-court.png",
  },
];
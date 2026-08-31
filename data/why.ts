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
    media: null,
  },
  {
    id: "parking",
    title: "ПАРКОВКА",
    description: "Удобство для гостей клуба.\nДетали парковки уточняются.",
    media: null,
  },
  {
    id: "around",
    title: "ВОКРУГ",
    description: "Клуб находится в районе с развитой городской инфраструктурой.",
    media: null,
  },
];

export type Review = {
  id: string;
  author: string;
  quote: string;
  summary: string;
  source: "Яндекс Карты";
  sourceUrl: string;
};

export const reviews: Review[] = [
  {
    id: "yandex-1",
    author: "Дима Ярец",
    quote: "Лучший клуб покера из всех, где я был",
    summary:
      "Регулярно бывает в клубе и отдельно отмечает качество и скорость обслуживания.",
    source: "Яндекс Карты",
    sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
  },
  {
    id: "yandex-2",
    author: "Алёна Бикеева",
    quote: "Очень тёплое и уютное место",
    summary:
      "Отмечает спокойную атмосферу, организацию пространства и внимание к деталям.",
    source: "Яндекс Карты",
    sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
  },
  {
    id: "yandex-3",
    author: "1TLM",
    quote: "Персонал на высшем уровне",
    summary:
      "Отдельно выделяет уютную атмосферу клуба и качество работы команды.",
    source: "Яндекс Карты",
    sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
  },
];
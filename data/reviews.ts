export type Review = {
  id: string;
  author: string;
  quote: string;
  body?: string;
  source: "Яндекс Карты";
  sourceUrl: string;
};

export const reviews: Review[] = [
  {
    id: "yandex-1",
    author: "Дима Ярец",
    quote: "«Лучший клуб покера из всех, где я был»",
    body:
      "«Играю в этом клубе далеко не первый раз и всегда с огромным удовольствием. Всегда радует качество и скорость обслуживания.»",
    source: "Яндекс Карты",
    sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
  },
  {
    id: "yandex-2",
    author: "Алёна Бикеева",
    quote: "«Очень тёплое и уютное место»",
    body:
      "«Приходишь — и сразу чувствуешь атмосферу: спокойная игра, приятные люди, всё по-домашнему.»",
    source: "Яндекс Карты",
    sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
  },
  {
    id: "yandex-3",
    author: "1TLM",
    quote: "«Персонал на высшем уровне»",
    body: "«Очень советую посетить это место, очень уютная атмосфера.»",
    source: "Яндекс Карты",
    sourceUrl: "https://yandex.ru/maps/-/CTTRFVMQ",
  },
];
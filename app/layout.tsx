import type { Metadata } from "next";
import { Unbounded, Onest } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MAGNUM — клуб спортивного покера в Москве",
  description: "MAGNUM — клуб спортивного покера в Москве. Игра не на деньги. Москва, Большая Новодмитровская улица, 36с13.",
  openGraph: {
    title: "MAGNUM — клуб спортивного покера в Москве",
    description: "MAGNUM — клуб спортивного покера в Москве. Игра не на деньги. Москва, Большая Новодмитровская улица, 36с13.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAGNUM — клуб спортивного покера",
    description: "MAGNUM — клуб спортивного покера в Москве. Игра не на деньги. Москва, Большая Новодмитровская улица, 36с13.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable} scroll-smooth antialiased selection:bg-[#7D0B29] selection:text-[#F1EFE9]`}>
      <body className="font-sans overflow-x-hidden min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

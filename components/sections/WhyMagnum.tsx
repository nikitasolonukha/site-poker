import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import { whyFeatures } from "@/data/why";

const cardSurfaceClasses = ["bg-[#11090B]", "bg-[#18090D]", "bg-[#21070F]"];

export default function WhyMagnum() {
  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="relative overflow-x-clip pb-16"
      style={{
        background:
          "radial-gradient(circle at 72% 25%, rgba(125, 11, 41, 0.22), transparent 38%), linear-gradient(180deg, #08090B 0%, #13070A 48%, #21060C 100%)",
      }}
    >
      <div className="relative z-10 mx-auto w-[92vw] max-w-[1600px] pb-12 pt-24 md:w-[82vw]">
        <h2
          id="why-title"
          className="font-display font-bold uppercase text-[#F1EFE9] text-balance"
          style={{ fontSize: "clamp(54px, 6vw, 96px)", lineHeight: 0.88 }}
        >
          Почему<br />Magnum
        </h2>
      </div>

      <div
        className="why-stack relative z-10 mx-auto w-[92vw] max-w-[1180px] space-y-6 pb-6 md:w-[calc(100vw-96px)] md:space-y-0 md:pb-0"
        style={{ "--stack-top": "112px", "--peek": "14px" } as CSSProperties}
      >
        {whyFeatures.map((feature, index) => (
          <Fragment key={feature.id}>
            <article
              className="why-stack-card relative flex min-h-[62svh] flex-col justify-center md:sticky md:h-[clamp(540px,68svh,680px)] md:min-h-0 md:origin-top md:top-[calc(var(--stack-top)+var(--index)*var(--peek))]"
            style={{ "--index": index, zIndex: 10 + index * 10 } as CSSProperties}
          >
            <div
              className={[
                cardSurfaceClasses[index] ?? cardSurfaceClasses[0],
                "flex min-h-[62svh] w-full flex-col gap-8 rounded-[2px] border border-[rgba(241,239,233,0.10)] p-6 md:h-full md:min-h-0 md:flex-row md:gap-12 md:p-10",
              ].join(" ")}
            >
              <div className="order-2 flex w-full flex-col justify-between md:order-1 md:w-[42%]">
                <div className="mb-12 flex items-start justify-between">
                  <span className="font-display text-xl font-bold tabular-nums text-[#B22554]">
                    0{index + 1}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-[#F1EFE9]/35"
                  >
                    <path d="M12 2 2 15s0 5 4 5c3.5 0 6-3 6-3s2.5 3 6 3c4 0 4-5 4-5L12 2Z" fill="currentColor" />
                  </svg>
                </div>

                <div className="my-auto">
                  <h3 className="font-display mb-6 text-3xl font-bold uppercase leading-[0.9] text-[#F1EFE9] text-balance md:text-5xl">
                    {feature.title}
                  </h3>
                  <p className="max-w-sm whitespace-pre-line text-base font-medium leading-relaxed text-[rgba(241,239,233,0.68)] text-pretty md:text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-[rgba(241,239,233,0.07)] bg-[#08090B] md:order-2 md:aspect-auto md:w-[58%]">
                {feature.media === null ? (
                  <div
                    className="absolute inset-0 flex flex-col justify-between p-6 md:p-8"
                    style={{
                      background:
                        "radial-gradient(circle at 65% 35%, rgba(125,11,41,.26), transparent 42%), #0D090B",
                    }}
                  >
                    <Image
                      src="/magnum-bg.svg"
                      alt=""
                      aria-hidden="true"
                      fill
                      className="object-cover opacity-[0.06]"
                      sizes="(max-width: 768px) 92vw, 58vw"
                    />
                    <span className="relative z-10 font-display text-sm font-bold tracking-[0.18em] text-[rgba(241,239,233,0.42)]">
                      MAGNUM
                    </span>
                    <span className="relative z-10 self-end font-display text-[clamp(72px,10vw,150px)] font-bold leading-none tabular-nums text-[rgba(241,239,233,0.08)]">
                      0{index + 1}
                    </span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={feature.media}
                      alt={feature.title}
                      fill
                      className="object-cover contrast-[1.04] saturate-[0.92]"
                      sizes="(max-width: 768px) 92vw, 58vw"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(rgba(38, 5, 12, 0.06), rgba(8, 9, 11, 0.12))",
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            </article>
            {index < whyFeatures.length - 1 && (
              <div
                aria-hidden="true"
                className="why-stack-reading-space hidden md:block md:h-[82svh]"
              />
            )}
          </Fragment>
        ))}
        <div aria-hidden="true" className="why-stack-end-space hidden h-[36svh] md:block" />
      </div>
    </section>
  );
}
import React from "react";
import Marquee from "react-fast-marquee";

const WORDS = [
  "SUNET PUR",
  "ANC ADAPTIV",
  "LIVRARE GRATUITA PESTE 200€",
  "2 ANI GARANTIE",
  "INGINERIE VOLT",
  "RETUR 30 ZILE",
];

export const EditorialMarquee = () => {
  return (
    <div
      className="border-y border-white/10 bg-void py-5"
      data-testid="editorial-marquee"
    >
      <Marquee speed={40} gradient={false} pauseOnHover>
        {WORDS.map((w, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-[#888890]">
              {w}
            </span>
            <span className="text-volt">+</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
};

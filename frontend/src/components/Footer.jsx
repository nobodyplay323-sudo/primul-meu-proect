import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t border-white/10 bg-void px-6 pb-10 pt-20 md:px-12 lg:px-16"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="font-heading text-5xl uppercase leading-none tracking-tighter sm:text-7xl">
            Auzi
            <br />
            diferenta<span className="text-volt">.</span>
          </h2>
          <p className="mt-6 max-w-md font-body text-base text-[#888890]">
            VOLT proiecteaza echipamente audio si electronice pentru cei care
            refuza compromisul. Inginerie de precizie, design fara zgomot.
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-8">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#55555c]">
            Navigare
          </p>
          <ul className="space-y-3">
            {[
              { l: "Magazin", to: "/magazin" },
              { l: "Casti", to: "/magazin?categorie=Casti" },
              { l: "Boxe", to: "/magazin?categorie=Boxe" },
              { l: "Accesorii", to: "/magazin?categorie=Accesorii" },
            ].map((i) => (
              <li key={i.l}>
                <Link
                  to={i.to}
                  className="font-body text-lg transition-colors duration-300 hover:text-volt"
                >
                  {i.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#55555c]">
            Social
          </p>
          <ul className="space-y-3">
            {["Instagram", "YouTube", "TikTok"].map((s) => (
              <li key={s}>
                <a
                  href="#"
                  className="group flex items-center gap-1 font-body text-lg transition-colors duration-300 hover:text-volt"
                >
                  {s}
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#55555c]">
          © {new Date().getFullYear()} VOLT — Toate drepturile rezervate
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#55555c]">
          Construit pentru portofoliu
        </p>
      </div>
    </footer>
  );
};

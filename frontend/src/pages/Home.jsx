import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MaskedLines, Reveal } from "../components/Reveal";
import { EditorialMarquee } from "../components/EditorialMarquee";
import { ProductCard } from "../components/ProductCard";
import { fetchProducts, fetchCategories } from "../lib/api";

const HERO_BG =
  "https://images.pexels.com/photos/31650385/pexels-photo-31650385.jpeg";

const CHAPTERS = [
  {
    n: "01",
    title: "Acustica fara compromis",
    body: "Fiecare driver este acordat manual intr-o camera anecoica. Nu urmarim numere pe hartie, ci senzatia unei incaperi pline de muzica.",
  },
  {
    n: "02",
    title: "Materiale care conteaza",
    body: "Aluminiu frezat CNC, memory foam de densitate ridicata si textile reciclate. Obiecte construite pentru a fi folosite un deceniu, nu un sezon.",
  },
  {
    n: "03",
    title: "Tacere, la comanda",
    body: "Anularea activa a zgomotului de generatia a treia analizeaza mediul de 50.000 de ori pe secunda. Tu decizi cat din lume lasi sa intre.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 5 }).then(setFeatured).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const onMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMouse({
      x: (e.clientX / innerWidth - 0.5) * 30,
      y: (e.clientY / innerHeight - 0.5) * 30,
    });
  };

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 pt-32 md:px-12 lg:px-16"
      >
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={HERO_BG}
            alt=""
            animate={{ x: mouse.x, y: mouse.y }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 to-transparent" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-6xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-[#888890]"
          >
            <span className="text-volt">/</span> Echipament audio premium — Est. 2025
          </motion.p>

          <h1 className="font-heading text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter sm:text-7xl lg:text-[8.5vw]">
            <MaskedLines
              lines={["Sunetul", "care se", "vede."]}
              lineClassName="font-heading"
              delay={0.35}
            />
          </h1>

          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <Link
                to="/magazin"
                data-testid="hero-cta"
                className="group flex items-center gap-3 bg-white px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors duration-300 hover:bg-volt hover:text-white"
              >
                Descopera colectia
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="max-w-xs font-body text-sm text-[#888890]"
            >
              Casti, boxe si accesorii proiectate pentru puristii sunetului.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="relative z-10 mt-16 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#888890]"
        >
          <ArrowDown className="h-4 w-4 animate-bounce" />
          Scroll pentru a explora
        </motion.div>
      </section>

      <EditorialMarquee />

      {/* FEATURED */}
      <section className="px-6 py-24 md:px-12 md:py-40 lg:px-16" data-testid="featured-section">
        <Reveal>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-[#888890]">
                <span className="text-volt">01</span> / Selectie
              </p>
              <h2 className="font-heading text-4xl uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
                In prim-plan
              </h2>
            </div>
            <Link
              to="/magazin"
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#888890] transition-colors hover:text-white"
            >
              Vezi tot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6">
          {featured[0] && (
            <div className="md:col-span-4 md:row-span-2">
              <ProductCard product={featured[0]} index={0} large />
            </div>
          )}
          {featured.slice(1, 3).map((p, i) => (
            <div key={p.id} className="md:col-span-2">
              <ProductCard product={p} index={i + 1} />
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section
        id="manifest"
        className="relative border-y border-white/10 px-6 py-24 md:px-12 md:py-40 lg:px-16"
        data-testid="manifesto-section"
      >
        <Reveal>
          <p className="mb-16 font-mono text-xs uppercase tracking-[0.25em] text-[#888890]">
            <span className="text-volt">02</span> / Manifest
          </p>
        </Reveal>
        <div className="space-y-24 md:space-y-40">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.n}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-16"
            >
              <div className="relative md:col-span-5">
                <span
                  className="text-stroke font-heading text-[28vw] font-extrabold leading-none md:text-[15vw]"
                  aria-hidden
                >
                  {c.n}
                </span>
              </div>
              <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
                <h3 className="font-heading text-3xl uppercase leading-tight tracking-tight sm:text-4xl">
                  {c.title}
                </h3>
                <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-[#888890]">
                  {c.body}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 py-24 md:px-12 md:py-40 lg:px-16" data-testid="categories-section">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-[#888890]">
            <span className="text-volt">03</span> / Categorii
          </p>
          <h2 className="mb-14 font-heading text-4xl uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
            Alege-ti arma
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.05}>
              <Link
                to={`/magazin?categorie=${encodeURIComponent(cat.name)}`}
                data-testid={`category-${cat.name}`}
                className="group flex h-48 flex-col justify-between bg-void p-6 transition-colors duration-300 hover:bg-surface"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-[#888890]">
                  {String(cat.count).padStart(2, "0")}
                </span>
                <div className="flex items-end justify-between">
                  <span className="font-heading text-xl uppercase tracking-tight">
                    {cat.name}
                  </span>
                  <ArrowUpRightIcon />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArrowUpRightIcon() {
  return (
    <ArrowRight className="h-5 w-5 -rotate-45 text-[#888890] transition-all duration-300 group-hover:rotate-0 group-hover:text-volt" />
  );
}

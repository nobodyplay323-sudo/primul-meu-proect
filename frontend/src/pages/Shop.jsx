import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts, fetchCategories } from "../lib/api";
import { ProductCard } from "../components/ProductCard";
import { MaskedLines } from "../components/Reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const SORTS = [
  { value: "featured", label: "Recomandate" },
  { value: "price_asc", label: "Pret crescator" },
  { value: "price_desc", label: "Pret descrescator" },
  { value: "rating", label: "Cele mai apreciate" },
  { value: "name", label: "Alfabetic" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("categorie") || "All";
  const q = searchParams.get("q") || "";
  const [sort, setSort] = useState("featured");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (q) params.search = q;
    if (sort !== "featured") params.sort = sort;
    fetchProducts(params)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, q, sort]);

  const setCategory = (name) => {
    const next = new URLSearchParams(searchParams);
    if (name === "All") next.delete("categorie");
    else next.set("categorie", name);
    setSearchParams(next);
  };

  const filters = useMemo(
    () => [{ name: "All", count: null }, ...categories],
    [categories]
  );

  return (
    <div className="px-6 pb-32 pt-32 md:px-12 md:pt-40 lg:px-16" data-testid="shop-page">
      <div className="mb-12">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-[#888890]">
          <span className="text-volt">/</span>{" "}
          {q ? `Rezultate pentru "${q}"` : "Toate produsele"}
        </p>
        <h1 className="font-heading text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter sm:text-7xl lg:text-[7vw]">
          <MaskedLines lines={["Magazin"]} />
        </h1>
      </div>

      <div className="mb-10 flex flex-col justify-between gap-6 border-y border-white/10 py-5 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" data-testid="category-filters">
          {filters.map((f) => (
            <button
              key={f.name}
              data-testid={`filter-${f.name}`}
              onClick={() => setCategory(f.name)}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                category === f.name
                  ? "border-volt bg-volt text-white"
                  : "border-white/15 text-[#888890] hover:border-white/40 hover:text-white"
              }`}
            >
              {f.name === "All" ? "Toate" : f.name}
              {f.count != null && (
                <span className="ml-2 opacity-60">{f.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#55555c]">
            Sorteaza
          </span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              data-testid="sort-select"
              className="w-[220px] rounded-none border-white/15 bg-transparent font-mono text-xs uppercase tracking-widest"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-white/15 bg-surface">
              {SORTS.map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="min-h-[460px] animate-pulse border border-white/10 bg-surface"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-32 text-center">
          <p className="font-heading text-3xl uppercase tracking-tight text-[#888890]">
            Niciun produs gasit
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-testid="products-grid"
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

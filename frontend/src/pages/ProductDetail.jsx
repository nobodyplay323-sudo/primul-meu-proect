import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Star, Check, Truck, Shield, Plus, Minus } from "lucide-react";
import { fetchProduct, fetchProducts, formatPrice } from "../lib/api";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setQty(1);
    setActiveImg(0);
    window.scrollTo(0, 0);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        setNotFound(false);
        fetchProducts({ category: p.category, limit: 5 })
          .then((list) => setRelated(list.filter((x) => x.slug !== slug).slice(0, 4)))
          .catch(() => {});
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <p className="font-heading text-4xl uppercase tracking-tight">
          Produs inexistent
        </p>
        <Link
          to="/magazin"
          className="border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-volt hover:bg-volt"
        >
          Inapoi la magazin
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-volt" />
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} adaugat in cos`, {
      description: `${qty} x ${formatPrice(product.price)}`,
    });
  };

  return (
    <div className="px-6 pb-32 pt-28 md:px-12 md:pt-32 lg:px-16" data-testid="product-detail-page">
      <Link
        to="/magazin"
        className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#888890] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Inapoi
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="spotlight flex aspect-square items-center justify-center border border-white/10 bg-surface p-12"
          >
            <img
              src={product.gallery[activeImg] || product.image}
              alt={product.name}
              className="max-h-full w-auto object-contain"
              data-testid="product-main-image"
            />
          </motion.div>
          {product.gallery.length > 1 && (
            <div className="mt-4 flex gap-4">
              {product.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex h-24 w-24 items-center justify-center border bg-surface p-3 transition-colors ${
                    activeImg === i ? "border-volt" : "border-white/10"
                  }`}
                >
                  <img src={g} alt="" className="max-h-full w-auto object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#888890]">
            {product.brand} — {product.category}
          </p>
          <h1 className="mt-4 font-heading text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 font-body text-lg text-[#888890]">{product.tagline}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "fill-volt text-volt"
                      : "text-[#55555c]"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-[#888890]">
              {product.rating.toFixed(1)} · {product.reviews} recenzii
            </span>
          </div>

          <div className="mt-8 flex items-end gap-4">
            <span className="font-heading text-4xl">{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="mb-1 font-mono text-lg text-[#55555c] line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>

          <p className="mt-8 max-w-xl font-body text-base leading-relaxed text-[#b5b5bb]">
            {product.description}
          </p>

          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#888890]">
                Culori disponibile
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="h-8 w-8 rounded-full border border-white/20"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center border border-white/15">
              <button
                data-testid="qty-dec"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-14 w-14 items-center justify-center hover:text-volt"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-mono text-lg">{qty}</span>
              <button
                data-testid="qty-inc"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-14 w-14 items-center justify-center hover:text-volt"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              data-testid="pdp-add-to-cart"
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 bg-white py-4 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors duration-300 hover:bg-volt hover:text-white"
            >
              <Plus className="h-4 w-4" /> Adauga in cos —{" "}
              {formatPrice(product.price * qty)}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            {[
              { icon: Truck, t: "Livrare gratuita", s: "peste 200€" },
              { icon: Shield, t: "2 ani garantie", s: "inclusa" },
              { icon: Check, t: "Retur 30 zile", s: "fara intrebari" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-volt" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider">{f.t}</p>
                  <p className="font-body text-xs text-[#888890]">{f.s}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Specs */}
          {Object.keys(product.specs).length > 0 && (
            <div className="mt-12" data-testid="specs-table">
              <h2 className="mb-6 font-heading text-2xl uppercase tracking-tight">
                Specificatii
              </h2>
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-4">
                    <dt className="font-mono text-xs uppercase tracking-widest text-[#888890]">
                      {k}
                    </dt>
                    <dd className="font-body text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-32">
          <h2 className="mb-10 font-heading text-3xl uppercase tracking-tight sm:text-4xl">
            Ai putea prefera
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

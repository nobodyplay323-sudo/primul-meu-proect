import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../lib/api";
import { useCart } from "../context/CartContext";
import { Plus } from "lucide-react";

export const ProductCard = ({ product, index = 0, large = false }) => {
  const { addItem } = useCart();

  return (
    <motion.div
      data-testid={`product-card-${product.slug}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.08 }}
      className={`group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-surface ${
        large ? "min-h-[560px]" : "min-h-[460px]"
      }`}
    >
      <Link to={`/produs/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />

      <div className="flex items-start justify-between p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888890]">
            {product.category}
          </p>
        </div>
        {product.badge && (
          <span className="border border-volt px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-volt">
            {product.badge}
          </span>
        )}
      </div>

      <div className="spotlight relative flex flex-1 items-center justify-center px-8">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-[260px] w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="relative border-t border-white/10 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-heading text-xl uppercase tracking-tight">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-1 font-body text-sm text-[#888890]">
              {product.tagline}
            </p>
          </div>
          <div className="text-right">
            {product.old_price && (
              <p className="font-mono text-xs text-[#55555c] line-through">
                {formatPrice(product.old_price)}
              </p>
            )}
            <p className="font-heading text-lg">{formatPrice(product.price)}</p>
          </div>
        </div>

        <button
          data-testid={`add-to-cart-${product.slug}`}
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="relative z-20 mt-5 flex w-full items-center justify-center gap-2 border border-white/15 bg-transparent py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-volt hover:bg-volt"
        >
          <Plus className="h-4 w-4" /> Adauga in cos
        </button>
      </div>
    </motion.div>
  );
};

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { fetchOrder, formatPrice } from "../lib/api";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder(orderNumber)
      .then(setOrder)
      .catch(() => setNotFound(true));
  }, [orderNumber]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <p className="font-heading text-4xl uppercase tracking-tight">Comanda inexistenta</p>
        <Link to="/magazin" className="border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-volt hover:bg-volt">
          Inapoi la magazin
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-volt" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-32 pt-32 md:pt-40" data-testid="confirmation-page">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8 flex h-16 w-16 items-center justify-center border border-volt bg-volt/10"
      >
        <Check className="h-8 w-8 text-volt" />
      </motion.div>

      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#888890]">
        Comanda confirmata
      </p>
      <h1 className="mt-4 font-heading text-5xl font-extrabold uppercase leading-none tracking-tighter sm:text-6xl">
        Multumim,
        <br />
        {order.full_name.split(" ")[0]}!
      </h1>
      <p className="mt-6 max-w-lg font-body text-lg text-[#888890]">
        Comanda ta a fost inregistrata. Vei primi un email de confirmare la{" "}
        <span className="text-white">{order.email}</span>.
      </p>

      <div className="mt-10 flex items-center gap-4 border-y border-white/10 py-5">
        <span className="font-mono text-xs uppercase tracking-widest text-[#888890]">
          Numar comanda
        </span>
        <span data-testid="order-number" className="font-heading text-xl tracking-tight text-volt">
          {order.order_number}
        </span>
      </div>

      <div className="mt-10">
        <h2 className="mb-6 font-heading text-2xl uppercase tracking-tight">Produse</h2>
        <div className="space-y-4">
          {order.items.map((i) => (
            <div key={i.product_id} className="flex gap-4 border-b border-white/10 pb-4">
              <div className="flex h-16 w-16 items-center justify-center border border-white/10 bg-surface">
                <img src={i.image} alt={i.name} className="max-h-12 w-auto object-contain" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-heading text-sm uppercase tracking-tight">{i.name}</p>
                  <p className="font-mono text-xs text-[#888890]">x{i.quantity}</p>
                </div>
                <p className="font-mono text-sm">{formatPrice(i.price * i.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 font-mono text-sm">
          <div className="flex justify-between text-[#888890]">
            <span>Subtotal</span>
            <span className="text-white">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#888890]">
            <span>Livrare</span>
            <span className="text-white">
              {order.shipping === 0 ? "GRATUIT" : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3">
            <span className="font-heading text-lg uppercase">Total</span>
            <span className="font-heading text-2xl">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <Link
        to="/magazin"
        className="group mt-12 inline-flex items-center gap-3 bg-white px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors duration-300 hover:bg-volt hover:text-white"
      >
        Continua cumparaturile
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

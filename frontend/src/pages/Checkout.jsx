import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder, formatPrice } from "../lib/api";

const SHIPPING = [
  { id: "standard", label: "Standard", desc: "3–5 zile lucratoare", price: 15 },
  { id: "express", label: "Express", desc: "24–48 ore", price: 25 },
  { id: "pickup", label: "Ridicare din showroom", desc: "Bucuresti", price: 0 },
];

const FIELDS = [
  { name: "full_name", label: "Nume complet", type: "text", ph: "Ion Popescu" },
  { name: "email", label: "Email", type: "email", ph: "ion@exemplu.ro" },
  { name: "phone", label: "Telefon", type: "tel", ph: "+40 7xx xxx xxx" },
  { name: "address", label: "Adresa", type: "text", ph: "Str. Exemplu nr. 10", full: true },
  { name: "city", label: "Oras", type: "text", ph: "Bucuresti" },
  { name: "postal_code", label: "Cod postal", type: "text", ph: "010101" },
];

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "România",
    notes: "",
  });

  const method = SHIPPING.find((s) => s.id === shippingMethod);
  const shippingCost =
    shippingMethod === "standard" && subtotal >= 200 ? 0 : method.price;
  const total = subtotal + shippingCost;

  const update = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    for (const f of FIELDS) {
      if (!form[f.name].trim()) {
        toast.error(`Completeaza campul: ${f.label}`);
        return;
      }
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Adresa de email nu este valida");
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          product_id: i.product_id,
          slug: i.slug,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        ...form,
        shipping_method: shippingMethod,
      });
      clear();
      navigate(`/comanda/${order.order_number}`, { state: { order } });
    } catch (err) {
      toast.error("A aparut o eroare la plasarea comenzii. Incearca din nou.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6" data-testid="checkout-empty">
        <p className="font-heading text-4xl uppercase tracking-tight">Cosul este gol</p>
        <Link
          to="/magazin"
          className="border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-volt hover:bg-volt"
        >
          Continua cumparaturile
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 pb-32 pt-28 md:px-12 md:pt-32 lg:px-16" data-testid="checkout-page">
      <Link
        to="/magazin"
        className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#888890] hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Continua cumparaturile
      </Link>
      <h1 className="mb-12 font-heading text-5xl font-extrabold uppercase leading-none tracking-tighter sm:text-6xl">
        Finalizare
      </h1>

      <form onSubmit={submit} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#888890]">
            <span className="text-volt">01</span> / Date livrare
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#888890]">
                  {f.label}
                </label>
                <input
                  data-testid={`input-${f.name}`}
                  type={f.type}
                  value={form[f.name]}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.ph}
                  className="w-full border border-white/15 bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-[#55555c] focus:border-volt focus:outline-none"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#888890]">
                Note comanda (optional)
              </label>
              <textarea
                data-testid="input-notes"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                placeholder="Instructiuni de livrare..."
                className="w-full border border-white/15 bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-[#55555c] focus:border-volt focus:outline-none"
              />
            </div>
          </div>

          <h2 className="mb-6 mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[#888890]">
            <span className="text-volt">02</span> / Metoda de livrare
          </h2>
          <div className="space-y-3" data-testid="shipping-methods">
            {SHIPPING.map((s) => (
              <button
                type="button"
                key={s.id}
                data-testid={`shipping-${s.id}`}
                onClick={() => setShippingMethod(s.id)}
                className={`flex w-full items-center justify-between border px-5 py-4 text-left transition-colors duration-300 ${
                  shippingMethod === s.id
                    ? "border-volt bg-volt/10"
                    : "border-white/15 hover:border-white/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      shippingMethod === s.id ? "border-volt" : "border-white/40"
                    }`}
                  >
                    {shippingMethod === s.id && (
                      <span className="h-2 w-2 rounded-full bg-volt" />
                    )}
                  </span>
                  <div>
                    <p className="font-heading text-sm uppercase tracking-tight">{s.label}</p>
                    <p className="font-body text-xs text-[#888890]">{s.desc}</p>
                  </div>
                </div>
                <span className="font-mono text-sm">
                  {s.id === "standard" && subtotal >= 200
                    ? "GRATUIT"
                    : s.price === 0
                    ? "GRATUIT"
                    : formatPrice(s.price)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="border border-white/10 bg-surface p-6 lg:sticky lg:top-28">
            <h2 className="mb-6 font-heading text-xl uppercase tracking-tight">
              Sumar comanda
            </h2>
            <div className="max-h-72 space-y-4 overflow-y-auto">
              {items.map((i) => (
                <div key={i.product_id} className="flex gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center border border-white/10 bg-void">
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

            <div className="mt-6 space-y-3 border-t border-white/10 pt-6 font-mono text-sm">
              <div className="flex justify-between text-[#888890]">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#888890]">
                <span>Livrare</span>
                <span className="text-white">
                  {shippingCost === 0 ? "GRATUIT" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="font-heading text-lg uppercase">Total</span>
                <span data-testid="order-total" className="font-heading text-2xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              data-testid="place-order-button"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-white py-4 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors duration-300 hover:bg-volt hover:text-white disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {submitting ? "Se proceseaza..." : "Plaseaza comanda"}
            </button>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#55555c]">
              Plata simulata — mediu demo
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

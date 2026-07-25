import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/api";

export const CartDrawer = () => {
  const { isOpen, setIsOpen, items, updateQty, removeItem, subtotal, count } =
    useCart();
  const navigate = useNavigate();

  const goCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            data-testid="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-void"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
              <h2 className="font-heading text-xl uppercase tracking-tight">
                Cosul tau <span className="text-[#888890]">({count})</span>
              </h2>
              <button
                data-testid="close-cart"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center border border-white/10 transition-colors hover:border-volt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-[#55555c]" />
                <p className="font-mono text-xs uppercase tracking-widest text-[#888890]">
                  Cosul este gol
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/magazin");
                  }}
                  className="mt-2 border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-volt hover:bg-volt"
                >
                  Exploreaza magazinul
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      data-testid={`cart-item-${item.slug}`}
                      className="flex gap-4 border-b border-white/10 py-5"
                    >
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center border border-white/10 bg-surface">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-16 w-auto object-contain"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between">
                          <h3 className="font-heading text-sm uppercase tracking-tight">
                            {item.name}
                          </h3>
                          <button
                            data-testid={`remove-${item.slug}`}
                            onClick={() => removeItem(item.product_id)}
                            className="text-[#888890] transition-colors hover:text-volt"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-white/10">
                            <button
                              data-testid={`dec-${item.slug}`}
                              onClick={() =>
                                updateQty(item.product_id, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center hover:text-volt"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm">
                              {item.quantity}
                            </span>
                            <button
                              data-testid={`inc-${item.slug}`}
                              onClick={() =>
                                updateQty(item.product_id, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center hover:text-volt"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-heading text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 px-6 py-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#888890]">
                      Subtotal
                    </span>
                    <span className="font-heading text-2xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mb-4 font-body text-xs text-[#888890]">
                    Livrare gratuita pentru comenzi peste 200€. Taxele se
                    calculeaza la finalizare.
                  </p>
                  <button
                    data-testid="checkout-button"
                    onClick={goCheckout}
                    className="w-full bg-white py-4 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors duration-300 hover:bg-volt hover:text-white"
                  >
                    Finalizeaza comanda
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

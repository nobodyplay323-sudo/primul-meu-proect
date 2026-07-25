import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV = [
  { label: "Magazin", to: "/magazin" },
  { label: "Casti", to: "/magazin?categorie=Casti" },
  { label: "Boxe", to: "/magazin?categorie=Boxe" },
  { label: "Manifest", to: "/#manifest" },
];

export const Navbar = () => {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/magazin?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-500 ${
        scrolled
          ? "border-white/10 bg-void/70 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <Link
          to="/"
          data-testid="logo-link"
          className="font-heading text-2xl font-extrabold tracking-tighter"
        >
          VOLT<span className="text-volt">.</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#888890] transition-colors duration-300 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form
            onSubmit={submitSearch}
            className="hidden items-center border border-white/10 bg-white/[0.03] px-3 py-2 lg:flex"
          >
            <Search className="h-4 w-4 text-[#888890]" />
            <input
              data-testid="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cauta produse"
              className="w-32 bg-transparent px-2 font-mono text-xs uppercase tracking-widest text-white placeholder:text-[#55555c] focus:outline-none"
            />
          </form>

          <button
            data-testid="cart-button"
            onClick={() => setIsOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center border border-white/10 transition-colors duration-300 hover:border-volt hover:bg-white/[0.04]"
            aria-label="Deschide cosul"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span
                data-testid="cart-count"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-volt font-mono text-[10px] font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center border border-white/10 md:hidden"
            aria-label="Meniu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-void/95 px-6 py-6 md:hidden">
          <form onSubmit={submitSearch} className="mb-5 flex items-center border border-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-[#888890]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cauta produse"
              className="w-full bg-transparent px-2 font-mono text-xs uppercase tracking-widest text-white placeholder:text-[#55555c] focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="font-heading text-2xl uppercase tracking-tight"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

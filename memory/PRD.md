# PRD — VOLT (Magazin de electronice)

## Problem Statement
"Un magazin de electronice" (Romanian). Built for the user's portfolio, requested award-worthy / Awwwards-level design with heavy motion craft.

## Art Direction
High-Contrast Swiss Brutalism / Editorial Future. Dark mode (#050505). Fonts: Syne (headings), Manrope (body), JetBrains Mono (labels). Accent red #E63946. framer-motion + lenis smooth scroll, masked kinetic hero, parallax, editorial marquee, numbered manifesto chapters.

## Architecture
- Backend: FastAPI + MongoDB (motor). Products auto-seeded (13 items, 5 categories). Routes under /api: products (filter/search/sort), categories, product by slug, orders (create/get) with shipping logic.
- Frontend: React + react-router. Pages: Home, Shop (/magazin), ProductDetail (/produs/:slug), Checkout, OrderConfirmation (/comanda/:orderNumber). Cart via localStorage context. shadcn Select for sorting, sonner toasts.

## Implemented (2025)
- Kinetic hero (masked line reveal + parallax + mouse-follow), editorial marquee, bento featured grid, manifesto chapters, categories grid.
- Full catalog with category filters, search, sort.
- Product detail: gallery, specs, quantity, colors, related products, add-to-cart toast.
- Cart drawer with qty controls; simulated checkout with shipping methods; order confirmation.
- Tested: backend 100%, frontend flow verified end-to-end.

## Personas
- Portfolio visitor / recruiter evaluating design & code quality.
- Demo shopper browsing premium audio gear.

## Backlog / Next
- P1: Wishlist / favorites, product reviews UI, real payment (Stripe) if going live.
- P2: Admin dashboard for product CRUD, order history, email confirmations (Resend/SendGrid).
- P2: Filters by price range / brand, quick-view modal.

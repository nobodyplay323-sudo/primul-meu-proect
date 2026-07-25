import React, { useEffect } from "react";
import "@/App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ReactLenis } from "lenis/react";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App min-h-screen bg-void">
      <div className="grain" />
      <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
        <BrowserRouter>
          <CartProvider>
            <ScrollToTop />
            <Navbar />
            <CartDrawer />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/magazin" element={<Shop />} />
                <Route path="/produs/:slug" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/comanda/:orderNumber" element={<OrderConfirmation />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="bottom-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 0,
                  color: "#f3f4f6",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                },
              }}
            />
          </CartProvider>
        </BrowserRouter>
      </ReactLenis>
    </div>
  );
}

export default App;

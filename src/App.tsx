import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/products/:category" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
            <Route path="*" element={
              <Layout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                  <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                  <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-[#e31837] text-white px-8 py-3 rounded-md font-bold hover:bg-[#b01229] transition-colors inline-block">
                    Go Home
                  </a>
                </div>
              </Layout>
            } />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;

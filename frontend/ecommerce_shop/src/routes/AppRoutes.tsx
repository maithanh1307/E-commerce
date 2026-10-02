import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/HomePage";
import Product from "../pages/product/ProductPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import { CartProvider } from "../components/cart/CartContext";
import CartPage from "../pages/cart/CartPage";
import CartDrawer from "../components/cart/CartDrawer";
import CheckoutPage from "../pages/checkout/CheckOutPage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
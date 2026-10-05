import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/HomePage";
import Product from "../pages/product/ProductPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import { CartProvider } from "../components/cart/CartContext";
import CartPage from "../pages/cart/CartPage";
import CartDrawer from "../components/cart/CartDrawer";
import CheckoutPage from "../pages/checkout/CheckOutPage";
import OrderHistoryPage from "../pages/order/OrderHistoryPage";
import AccountLayout from "../pages/account/AccountPage";
import ProfileSection from "../pages/account/components/ProfileSection";
import { PaymentMethodsSection } from "../pages/account/components/PlaceholderSection";
import AddressesSection from "../pages/account/components/AddressSection";
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
          <Route path="/orders" element={<OrderHistoryPage />} />
           <Route path="/account" element={<AccountLayout />}>
              <Route index element={<ProfileSection />} />
              <Route path="addresses" element={<AddressesSection />} />
              <Route path="payment" element={<PaymentMethodsSection />} />
          </Route>
        </Routes>

        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/HomePage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/products" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/account" element={<Account />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
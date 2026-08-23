import { Navigate, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layouts";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import NotFound from "../pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/giris" element={<Login />} />
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Navigate to="/urunler" replace />} />
      <Route path="urunler" element={<Products />} />
      <Route path="urunler/:id" element={<ProductDetail />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

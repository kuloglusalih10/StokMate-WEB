import { Navigate, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layouts";
import Products from "../pages/Products";

const AppRoutes = () => (
  <Routes>
    <Route path="/giris" element={<Login />} />
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Navigate to="/urunler" replace />} />
      <Route path="urunler" element={<Products />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

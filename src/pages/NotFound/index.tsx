import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Lottie from "lottie-react";
import notFoundAnimation from "../../assets/404.json";
import { BRAND_COLORS } from "../../constants/colors";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_COLORS.white,
        padding: 24,
        textAlign: "center",
      }}
    >
      <Lottie animationData={notFoundAnimation} loop autoplay style={{ width: "100%", maxWidth: 360 }} />

      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: BRAND_COLORS.accent,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        HATA 404
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 800,
          color: BRAND_COLORS.secondary,
          letterSpacing: "-0.02em",
        }}
      >
        Sayfa bulunamadı
      </h1>

      <p style={{ margin: "14px 0 32px", fontSize: 15, lineHeight: 1.7, color: "#5C5C5C", maxWidth: 420 }}>
        Aradığınız sayfa taşınmış, kaldırılmış ya da hiç var olmamış olabilir. Adresi kontrol edin ya da ana
        sayfaya dönün.
      </p>

      <Button type="primary" size="large" icon={<HomeOutlined />} onClick={() => navigate("/urunler")}>
        Ürünlere dön
      </Button>
    </div>
  );
};

export default NotFound;

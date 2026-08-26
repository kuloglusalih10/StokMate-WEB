import { Component, type ReactNode } from "react";
import { Button } from "antd";
import { WarningOutlined, HomeOutlined } from "@ant-design/icons";
import { BRAND_COLORS } from "../../constants/colors";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("Uygulama hatası:", error, info.componentStack);
  }

  handleGoToProducts = () => {
    window.location.assign("/urunler");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

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
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            background: "rgba(245, 34, 45, 0.1)",
            color: "#F5222D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            marginBottom: 28,
          }}
        >
          <WarningOutlined />
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
          Bir şeyler ters gitti
        </h1>

        <p style={{ margin: "14px 0 32px", fontSize: 15, lineHeight: 1.7, color: "#5C5C5C", maxWidth: 420 }}>
          Beklenmedik bir hata oluştu. Ürünler sayfasına dönüp tekrar deneyebilirsiniz.
        </p>

        <Button type="primary" size="large" icon={<HomeOutlined />} onClick={this.handleGoToProducts}>
          Ürünlere dön
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;

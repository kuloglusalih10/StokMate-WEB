import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const ProductDetailLoading = () => (
  <div>
    <Skeleton.Input active size="small" style={{ width: 120, marginBottom: 20 }} />

    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 24, marginBottom: 20 }}>
      <div
        style={{
          ...cardStyle,
          flex: "0 1 320px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Skeleton.Image active style={{ width: "100%", height: 280, borderRadius: 16 }} />
        <div style={{ marginTop: 24 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 0",
                borderBottom: index === 4 ? "none" : "1px solid #F5F5F5",
              }}
            >
              <Skeleton.Avatar active shape="square" size={40} style={{ borderRadius: 12 }} />
              <Skeleton.Input active size="small" style={{ width: "60%" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Skeleton.Button active size="small" shape="round" style={{ width: 90 }} />
            <Skeleton.Button active size="small" shape="round" style={{ width: 70 }} />
          </div>
          <Skeleton.Input active size="large" style={{ width: "60%" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                ...cardStyle,
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <Skeleton.Input active size="small" style={{ width: 90, marginBottom: 10 }} />
                <Skeleton.Input active size="default" style={{ width: 70 }} />
              </div>
              <Skeleton.Avatar active shape="square" size={48} style={{ borderRadius: 14 }} />
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <Skeleton active title={false} paragraph={{ rows: 3 }} />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailLoading;

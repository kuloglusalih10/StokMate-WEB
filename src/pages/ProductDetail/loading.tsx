import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const MetaRowSkeleton = ({ last }: { last?: boolean }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 0",
      borderBottom: last ? "none" : "1px solid #F5F5F5",
    }}
  >
    <Skeleton.Avatar active shape="square" size={40} style={{ borderRadius: 12 }} />
    <div style={{ flex: 1 }}>
      <Skeleton.Input active size="small" style={{ width: "35%", marginBottom: 8 }} />
      <Skeleton.Input active size="small" style={{ width: "65%" }} />
    </div>
  </div>
);

const ProductDetailLoading = () => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <Skeleton.Input active size="small" style={{ width: 120 }} />
      <div style={{ display: "flex", gap: 12 }}>
        <Skeleton.Button active size="large" style={{ width: 110 }} />
        <Skeleton.Button active size="large" style={{ width: 90 }} />
      </div>
    </div>

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
        <Skeleton.Image active style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 16 }} />
        <div style={{ marginTop: 24 }}>
          <MetaRowSkeleton />
          <MetaRowSkeleton />
          <MetaRowSkeleton />
          <MetaRowSkeleton />
          <MetaRowSkeleton last />
        </div>
      </div>

      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <Skeleton.Button active size="small" shape="round" style={{ width: 90 }} />
            <Skeleton.Button active size="small" shape="round" style={{ width: 100 }} />
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
                <Skeleton.Input active size="small" style={{ width: 90, marginBottom: 8 }} />
                <Skeleton.Input active size="default" style={{ width: 70 }} />
              </div>
              <Skeleton.Avatar active shape="square" size={48} style={{ borderRadius: 14 }} />
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Skeleton.Avatar active shape="square" size={36} style={{ borderRadius: 10 }} />
            <Skeleton.Input active size="small" style={{ width: 110 }} />
          </div>
          <Skeleton active title={false} paragraph={{ rows: 3 }} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #F5F5F5",
            }}
          >
            <Skeleton.Input active size="small" style={{ width: 170 }} />
            <Skeleton.Input active size="small" style={{ width: 170 }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailLoading;

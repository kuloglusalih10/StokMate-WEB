import { Skeleton } from "antd";

const CANVAS = "#E9EAE4";
const CARD = "#FFFFFF";
const LINE_SOFT = "rgba(14,17,22,0.06)";
const INK = "#0E1116";
const INK2 = "#171C24";

const cardStyle = {
  background: CARD,
  border: `1px solid ${LINE_SOFT}`,
  borderRadius: 14,
  padding: "20px 22px",
};

const cardHeadStyle = {
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
  gap: 14,
  marginBottom: 18,
  flexWrap: "wrap" as const,
};

const MATRIX_ROWS = 6;
const CATEGORY_BAR_ROWS = 6;
const BRAND_COUNT = 6;
const SUPPLIER_LEGEND_ROWS = 4;
const STATUS_ROWS = 3;

const MatrixRowSkeleton = () => (
  <div style={{ display: "grid", gridTemplateColumns: "132px 1fr 62px", alignItems: "center", gap: 14 }}>
    <Skeleton.Input active size="small" style={{ width: 100 }} />
    <Skeleton.Node active style={{ width: "100%", height: 24, borderRadius: 5 }} />
    <Skeleton.Input active size="small" style={{ width: 50 }} />
  </div>
);

const CategoryBarRowSkeleton = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <Skeleton.Input active size="small" style={{ width: 90 }} />
    <Skeleton.Node active style={{ flex: 1, height: 18, borderRadius: 3 }} />
    <Skeleton.Input active size="small" style={{ width: 70 }} />
  </div>
);

const StatisticsLoading = () => (
  <div
    style={{
      margin: "-24px",
      padding: "30px 34px 56px",
      background: CANVAS,
      minHeight: "calc(100vh - 76px)",
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 26, flexWrap: "wrap" }}>
      <div>
        <Skeleton.Input active size="small" style={{ width: 200, marginBottom: 10 }} />
        <Skeleton.Input active size="large" style={{ width: 220, height: 34 }} />
      </div>
      <Skeleton.Input active size="small" style={{ width: 140, borderRadius: 999 }} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
      <section
        style={{
          gridColumn: "span 12",
          background: INK,
          borderRadius: 14,
          padding: "28px 30px",
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <Skeleton.Input active size="small" style={{ width: 160, background: "rgba(242,243,238,.12)" }} />
          <div style={{ marginTop: 14, marginBottom: 22 }}>
            <Skeleton.Input active size="large" style={{ width: 260, height: 56, background: "rgba(242,243,238,.14)" }} />
          </div>
          <Skeleton.Node active style={{ width: "100%", height: 12, borderRadius: 6, background: "rgba(242,243,238,.12)" }} />
          <div style={{ display: "flex", gap: 28, marginTop: 16, flexWrap: "wrap" }}>
            <Skeleton.Input active size="small" style={{ width: 90, background: "rgba(242,243,238,.12)" }} />
            <Skeleton.Input active size="small" style={{ width: 90, background: "rgba(242,243,238,.12)" }} />
            <Skeleton.Input active size="small" style={{ width: 70, background: "rgba(242,243,238,.12)" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, borderRadius: 12, overflow: "hidden" }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ background: INK2, padding: "16px 18px" }}>
              <Skeleton.Input active size="small" style={{ width: 50, background: "rgba(242,243,238,.14)", marginBottom: 8 }} />
              <Skeleton.Input active size="small" style={{ width: 80, background: "rgba(242,243,238,.1)" }} />
            </div>
          ))}
        </div>
      </section>

      <section style={{ gridColumn: "span 12", ...cardStyle }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 140, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 220 }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Skeleton.Input active size="small" style={{ width: 90, borderRadius: 999 }} />
            <Skeleton.Input active size="small" style={{ width: 90, borderRadius: 999 }} />
            <Skeleton.Input active size="small" style={{ width: 90, borderRadius: 999 }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: MATRIX_ROWS }).map((_, index) => (
            <MatrixRowSkeleton key={index} />
          ))}
        </div>
      </section>

      <section style={{ gridColumn: "span 7", ...cardStyle }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 160, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 200 }} />
          </div>
          <Skeleton.Input active size="small" style={{ width: 90 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Array.from({ length: CATEGORY_BAR_ROWS }).map((_, index) => (
            <CategoryBarRowSkeleton key={index} />
          ))}
        </div>
      </section>

      <section style={{ gridColumn: "span 5", ...cardStyle }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 110, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 130 }} />
          </div>
          <Skeleton.Input active size="small" style={{ width: 60 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <Skeleton.Avatar active shape="circle" size={168} style={{ flex: "0 0 auto" }} />
          <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: SUPPLIER_LEGEND_ROWS }).map((_, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <Skeleton.Input active size="small" style={{ width: 110 }} />
                <Skeleton.Input active size="small" style={{ width: 30 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ gridColumn: "span 6", ...cardStyle }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 220, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 260 }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 220, padding: "0 10px" }}>
          {Array.from({ length: BRAND_COUNT }).map((_, index) => (
            <Skeleton.Node key={index} active style={{ flex: 1, height: 70 + ((index * 23) % 130), borderRadius: 3 }} />
          ))}
        </div>
      </section>

      <section style={{ gridColumn: "span 6", ...cardStyle, display: "flex", flexDirection: "column" }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 130, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 180 }} />
          </div>
        </div>
        <Skeleton.Node active style={{ width: "100%", height: 10, borderRadius: 3, marginBottom: 14 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Array.from({ length: STATUS_ROWS }).map((_, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Skeleton.Input active size="small" style={{ width: 130 }} />
              <Skeleton.Input active size="small" style={{ width: 30 }} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: "auto", paddingTop: 20 }}>
          <Skeleton.Input active size="small" style={{ width: 90 }} />
          <Skeleton.Input active size="small" style={{ width: 90 }} />
        </div>
      </section>
    </div>
  </div>
);

export default StatisticsLoading;

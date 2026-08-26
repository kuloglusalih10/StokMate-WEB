import { Skeleton } from "antd";

const CANVAS = "#E9EAE4";
const CARD = "#FFFFFF";
const LINE_SOFT = "rgba(14,17,22,0.06)";
const INK = "#0E1116";

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

const LOG_ROWS = 4;

const ProductDetailLoading = () => (
  <div
    style={{
      margin: "-24px",
      padding: "30px 34px 56px",
      background: CANVAS,
      minHeight: "calc(100vh - 76px)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Skeleton.Avatar active shape="square" size={34} style={{ borderRadius: 10 }} />
        <Skeleton.Input active size="small" style={{ width: 220 }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Skeleton.Button active size="large" style={{ width: 120 }} />
        <Skeleton.Button active size="large" style={{ width: 100 }} />
        <Skeleton.Button active size="large" style={{ width: 70 }} />
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
      <section
        style={{
          gridColumn: "span 12",
          background: INK,
          borderRadius: 14,
          padding: "26px 30px",
          display: "grid",
          gridTemplateColumns: "1.25fr 1fr",
          gap: 44,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <Skeleton.Avatar active shape="square" size={112} style={{ borderRadius: 12, flex: "0 0 112px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <Skeleton.Input active size="small" style={{ width: 70, background: "rgba(242,243,238,.12)" }} />
              <Skeleton.Input active size="small" style={{ width: 60, background: "rgba(242,243,238,.12)" }} />
            </div>
            <Skeleton.Input active size="large" style={{ width: 260, height: 30, background: "rgba(242,243,238,.14)", marginBottom: 10 }} />
            <Skeleton.Input active size="small" style={{ width: 180, background: "rgba(242,243,238,.1)" }} />
          </div>
        </div>
        <div>
          <Skeleton.Input active size="small" style={{ width: 120, background: "rgba(242,243,238,.12)", marginBottom: 14 }} />
          <Skeleton.Input active size="large" style={{ width: 180, height: 40, background: "rgba(242,243,238,.14)", marginBottom: 16 }} />
          <Skeleton.Node active style={{ width: "100%", height: 11, borderRadius: 3, background: "rgba(242,243,238,.12)" }} />
          <div style={{ display: "flex", gap: 26, marginTop: 16 }}>
            <Skeleton.Input active size="small" style={{ width: 80, background: "rgba(242,243,238,.12)" }} />
            <Skeleton.Input active size="small" style={{ width: 80, background: "rgba(242,243,238,.12)" }} />
          </div>
        </div>
      </section>

      <section style={{ gridColumn: "span 7", ...cardStyle, display: "flex", flexDirection: "column" }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 130, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 200 }} />
          </div>
          <Skeleton.Input active size="small" style={{ width: 70 }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
          <Skeleton.Input active size="large" style={{ width: 100, height: 52 }} />
          <Skeleton.Input active size="small" style={{ width: 130, marginLeft: "auto", borderRadius: 999 }} />
        </div>
        <Skeleton.Node active style={{ width: "100%", height: 14, borderRadius: 7, marginBottom: 30 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: "auto" }}>
          <Skeleton.Input active size="small" style={{ width: "100%" }} />
          <Skeleton.Input active size="small" style={{ width: "100%" }} />
          <Skeleton.Input active size="small" style={{ width: "100%" }} />
        </div>
      </section>

      <section style={{ gridColumn: "span 5", ...cardStyle }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 140, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 180 }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <Skeleton.Input active size="small" style={{ width: 70, marginBottom: 6 }} />
              <Skeleton.Input active size="small" style={{ width: 110 }} />
            </div>
          ))}
        </div>
      </section>

      <section style={{ gridColumn: "span 7", ...cardStyle }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 110, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 220 }} />
          </div>
          <Skeleton.Input active size="small" style={{ width: 90 }} />
        </div>
        <Skeleton.Node active style={{ width: "100%", height: 220 }} />
      </section>

      <section style={{ gridColumn: "span 5", ...cardStyle, display: "flex", flexDirection: "column" }}>
        <div style={cardHeadStyle}>
          <div>
            <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 160 }} />
          </div>
        </div>
        <Skeleton active title={false} paragraph={{ rows: 3 }} />
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${LINE_SOFT}` }}>
          <Skeleton.Input active size="small" style={{ width: 120, marginBottom: 12 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: LOG_ROWS }).map((_, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Skeleton.Input active size="small" style={{ width: 40 }} />
                <Skeleton.Input active size="small" style={{ flex: 1 }} />
                <Skeleton.Input active size="small" style={{ width: 40 }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "auto", paddingTop: 18, borderTop: `1px solid ${LINE_SOFT}`, display: "flex", gap: 26 }}>
          <Skeleton.Input active size="small" style={{ width: 100 }} />
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>
      </section>
    </div>
  </div>
);

export default ProductDetailLoading;

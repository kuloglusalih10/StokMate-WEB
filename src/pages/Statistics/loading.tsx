import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

const STAT_CARDS = 4;
const LEGEND_ROWS = 4;

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const StatCardSkeleton = () => (
  <div
    style={{
      background: BRAND_COLORS.white,
      border: "1px solid #F0F0F0",
      borderRadius: 18,
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      boxShadow: "0 2px 10px rgba(14, 15, 12, 0.04)",
    }}
  >
    <div>
      <div style={{ marginBottom: 8 }}>
        <Skeleton.Input active size="small" style={{ width: 130 }} />
      </div>
      <Skeleton.Input active size="default" style={{ width: 100 }} />
    </div>
    <Skeleton.Avatar active shape="square" size={52} style={{ borderRadius: 14 }} />
  </div>
);

const DonutChartSkeleton = () => (
  <div style={cardStyle}>
    <div style={{ marginBottom: 20 }}>
      <Skeleton.Input active size="small" style={{ width: 170 }} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <Skeleton.Avatar active shape="circle" size={180} style={{ flex: "0 0 auto" }} />
      <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 14 }}>
        {Array.from({ length: LEGEND_ROWS }).map((_, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
          >
            <Skeleton.Input active size="small" style={{ width: 110 }} />
            <Skeleton.Input active size="small" style={{ width: 30 }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BarChartSkeleton = () => (
  <div style={cardStyle}>
    <div style={{ marginBottom: 20 }}>
      <Skeleton.Input active size="small" style={{ width: 170 }} />
    </div>
    <Skeleton.Node active style={{ width: "100%", height: 220 }} />
  </div>
);

const StatisticsLoading = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <Skeleton.Input active size="large" style={{ width: 220, height: 34 }} />
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 24,
      }}
    >
      {Array.from({ length: STAT_CARDS }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: 20,
        marginBottom: 24,
      }}
    >
      <DonutChartSkeleton />
      <BarChartSkeleton />
      <BarChartSkeleton />
      <BarChartSkeleton />
      <DonutChartSkeleton />
      <DonutChartSkeleton />
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
      }}
    >
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  </div>
);

export default StatisticsLoading;

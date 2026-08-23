import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

const ROW_COUNT = 5;

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const RowSkeleton = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 4px",
      borderBottom: "1px solid #F5F5F5",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Skeleton.Avatar active shape="square" size={40} style={{ borderRadius: 12 }} />
      <div>
        <div style={{ marginBottom: 6 }}>
          <Skeleton.Input active size="small" style={{ width: 150 }} />
        </div>
        <Skeleton.Input active size="small" style={{ width: 90 }} />
      </div>
    </div>
    <Skeleton.Button active size="default" shape="round" style={{ width: 96 }} />
  </div>
);

const SettingsLoading = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <Skeleton.Input active size="large" style={{ width: 140, height: 34 }} />
    </div>

    <div
      style={{
        display: "flex",
        gap: 32,
        marginBottom: 20,
        borderBottom: "1px solid #F0F0F0",
        paddingBottom: 14,
      }}
    >
      <Skeleton.Input active size="small" style={{ width: 100 }} />
      <Skeleton.Input active size="small" style={{ width: 90 }} />
      <Skeleton.Input active size="small" style={{ width: 110 }} />
    </div>

    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Skeleton.Input active size="small" style={{ width: 90 }} />
        <Skeleton.Button active size="default" style={{ width: 170 }} />
      </div>
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <RowSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default SettingsLoading;

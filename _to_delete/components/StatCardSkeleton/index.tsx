import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

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
      <div style={{ marginBottom: 12 }}>
        <Skeleton.Input active size="small" style={{ width: 110 }} />
      </div>
      <Skeleton.Input active size="default" style={{ width: 90 }} />
    </div>
    <Skeleton.Avatar active shape="square" size={52} style={{ borderRadius: 14 }} />
  </div>
);

export default StatCardSkeleton;

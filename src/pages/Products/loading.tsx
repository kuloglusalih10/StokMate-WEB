import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

const CARD_COUNT = 4;
const TABLE_ROWS = 8;
const TABLE_COLUMNS = 6;

export const StatsCardsSkeleton = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 20,
      marginBottom: 28,
    }}
  >
    {Array.from({ length: CARD_COUNT }).map((_, index) => (
      <div
        key={index}
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
    ))}
  </div>
);

export const ProductsTableSkeleton = () => (
  <div
    style={{
      background: BRAND_COLORS.white,
      border: "1px solid #F0F0F0",
      borderRadius: 12,
      overflow: "hidden",
    }}
  >
    {Array.from({ length: TABLE_ROWS }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "18px 24px",
          borderBottom: rowIndex === TABLE_ROWS - 1 ? "none" : "1px solid #F5F5F5",
        }}
      >
        {Array.from({ length: TABLE_COLUMNS }).map((__, colIndex) => (
          <Skeleton.Input
            key={colIndex}
            active
            size="small"
            style={
              colIndex === 0
                ? { width: 220, flex: "1 1 220px" }
                : { width: 90, flex: "0 0 auto" }
            }
          />
        ))}
      </div>
    ))}
  </div>
);

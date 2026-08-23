import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const TableSkeleton = ({ rows = 8, columns = 6 }: TableSkeletonProps) => (
  <div
    style={{
      background: BRAND_COLORS.white,
      border: "1px solid #F0F0F0",
      borderRadius: 12,
      overflow: "hidden",
    }}
  >
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "18px 24px",
          borderBottom: rowIndex === rows - 1 ? "none" : "1px solid #F5F5F5",
        }}
      >
        {Array.from({ length: columns }).map((__, colIndex) => (
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

export default TableSkeleton;

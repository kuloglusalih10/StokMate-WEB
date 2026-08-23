import { Skeleton } from "antd";
import { BRAND_COLORS } from "../../constants/colors";

const CARD_COUNT = 4;
const TABLE_ROWS = 8;

const COLUMNS = [
  { label: "Ürün", width: 300 },
  { label: "Kategori", width: 160 },
  { label: "Marka", width: 140 },
  { label: "Fiyat", width: 130 },
  { label: "Stok", width: 110 },
  { label: "Durum", width: 170 },
];

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
          <div style={{ marginBottom: 8 }}>
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
  <div style={{ borderRadius: 8, overflow: "hidden" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#FAFAFA",
        padding: "14px 24px",
        borderRadius: "8px 8px 0 0",
      }}
    >
      {COLUMNS.map((column) => (
        <div
          key={column.label}
          style={{
            flex: `0 0 ${column.width}px`,
            fontSize: 15,
            fontWeight: 600,
            color: BRAND_COLORS.secondary,
          }}
        >
          {column.label}
        </div>
      ))}
    </div>

    {Array.from({ length: TABLE_ROWS }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 24px",
          borderTop: "1px solid #F5F5F5",
        }}
      >
        <div style={{ flex: "0 0 300px", display: "flex", alignItems: "center", gap: 14 }}>
          <Skeleton.Avatar active shape="square" size={52} style={{ borderRadius: 8 }} />
          <div style={{ flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: "70%", marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: "40%" }} />
          </div>
        </div>
        <div style={{ flex: "0 0 160px" }}>
          <Skeleton.Button active size="small" shape="round" style={{ width: 100 }} />
        </div>
        <div style={{ flex: "0 0 140px" }}>
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>
        <div style={{ flex: "0 0 130px" }}>
          <Skeleton.Input active size="small" style={{ width: 80 }} />
        </div>
        <div style={{ flex: "0 0 110px" }}>
          <Skeleton.Input active size="small" style={{ width: 50 }} />
        </div>
        <div style={{ flex: "0 0 170px" }}>
          <Skeleton.Button active size="small" shape="round" style={{ width: 130 }} />
        </div>
      </div>
    ))}
  </div>
);

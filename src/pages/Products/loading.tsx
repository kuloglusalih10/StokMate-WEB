import { Skeleton } from "antd";

const MUTED_BG = "rgba(14,17,22,0.03)";
const LINE_SOFT = "rgba(14,17,22,0.06)";
const TABLE_ROWS = 8;

const COLUMNS = [
  { label: "Ürün", width: 320 },
  { label: "Kategori", width: 160 },
  { label: "Marka", width: 140 },
  { label: "Fiyat", width: 130 },
  { label: "Stok", width: 110 },
  { label: "Durum", width: 170 },
];

export const ProductsTableSkeleton = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", background: MUTED_BG, padding: "14px 24px" }}>
      {COLUMNS.map((column) => (
        <div key={column.label} style={{ flex: `0 0 ${column.width}px`, fontSize: 13, fontWeight: 600, color: "#6C7178" }}>
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
          borderTop: `1px solid ${LINE_SOFT}`,
        }}
      >
        <div style={{ flex: "0 0 320px", display: "flex", alignItems: "center", gap: 14 }}>
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

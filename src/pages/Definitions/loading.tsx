import { Skeleton } from "antd";

const COLORS = {
  canvas: "#E9EAE4",
  card: "#FFFFFF",
  line: "rgba(14,17,22,0.10)",
  lineSoft: "rgba(14,17,22,0.06)",
};

const ROW_COUNT = 5;

const RowSkeleton = ({ last }: { last: boolean }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "12px 20px",
      borderBottom: last ? "none" : `1px solid ${COLORS.lineSoft}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 13, flex: 1 }}>
      <Skeleton.Avatar active shape="square" size={34} style={{ borderRadius: 9 }} />
      <div>
        <Skeleton.Input active size="small" style={{ width: 140, marginBottom: 6 }} />
        <Skeleton.Input active size="small" style={{ width: 80 }} />
      </div>
    </div>
    <Skeleton.Input active size="small" style={{ width: 150 }} />
    <Skeleton.Button active size="small" shape="round" style={{ width: 130 }} />
  </div>
);

const DefinitionsLoading = () => (
  <div
    style={{
      margin: "-24px",
      padding: "30px 34px 56px",
      background: COLORS.canvas,
      minHeight: "calc(100vh - 76px)",
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 22 }}>
      <div>
        <Skeleton.Input active size="small" style={{ width: 130, marginBottom: 10 }} />
        <Skeleton.Input active size="large" style={{ width: 220, height: 38 }} />
      </div>
      <Skeleton.Button active size="large" style={{ width: 150 }} />
    </div>

    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <Skeleton.Button active size="default" shape="round" style={{ width: 130 }} />
      <Skeleton.Button active size="default" shape="round" style={{ width: 110 }} />
      <Skeleton.Button active size="default" shape="round" style={{ width: 130 }} />
    </div>

    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${COLORS.line}` }}>
        <div>
          <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 6 }} />
          <Skeleton.Input active size="small" style={{ width: 200 }} />
        </div>
        <Skeleton.Input active size="default" style={{ width: 230 }} />
      </div>
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <RowSkeleton key={index} last={index === ROW_COUNT - 1} />
      ))}
      <div style={{ padding: "13px 20px", borderTop: `1px solid ${COLORS.line}`, display: "flex", justifyContent: "space-between" }}>
        <Skeleton.Input active size="small" style={{ width: 180 }} />
        <Skeleton.Input active size="small" style={{ width: 140 }} />
      </div>
    </div>
  </div>
);

export default DefinitionsLoading;

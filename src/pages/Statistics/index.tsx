import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-toastify";
import {
  getProductStatsBreakdown,
  type ProductStatsBreakdown,
  type CategoryBreakdownItem,
} from "../../services/products";
import StatisticsLoading from "./loading";

type MatrixFilter = "saglikli" | "kritik" | "tukenen";

const COLORS = {
  ink: "#0E1116",
  ink2: "#171C24",
  canvas: "#E9EAE4",
  card: "#FFFFFF",
  line: "rgba(14,17,22,0.10)",
  lineSoft: "rgba(14,17,22,0.06)",
  text: "#0E1116",
  muted: "#6C7178",
  teal: "#10635C",
  tealDark: "#0A4C46",
  tealSoft: "#D7E5E2",
  lime: "#C6F24E",
  amber: "#E1962B",
  rust: "#C63F26",
  pasif: "#B9BDC2",
};

const SANS = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace";

const SUPPLIER_SHADES = ["#0A4C46", "#10635C", "#2A7B72", "#4E9389", "#7BAEA6", "#AECAC5"];

const STATUS_ORDER: { status: number; label: string; color: string }[] = [
  { status: 1, label: "Aktif", color: COLORS.teal },
  { status: 2, label: "Pasif", color: COLORS.pasif },
  { status: 3, label: "Üretimi durduruldu", color: COLORS.rust },
];

const toTL = (kurus: number) => Math.round(kurus / 100);
const formatMoney = (tl: number) => "₺" + tl.toLocaleString("tr-TR");
const formatPercent1 = (n: number) => "%" + n.toFixed(1).replace(".", ",");
const formatPercent0 = (n: number) => "%" + Math.round(n);

const niceValueCeil = (value: number) => {
  if (value <= 0) return 100;
  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  const fraction = value / base;
  const steps = [1, 1.2, 1.5, 2, 3, 5, 7, 10];
  const niceFraction = steps.find((step) => fraction <= step) ?? 10;
  return niceFraction * base;
};

const niceCountCeil = (value: number) => {
  if (value <= 5) return 5;
  if (value <= 30) return Math.ceil(value / 5) * 5;
  return Math.ceil(value / 10) * 10;
};

const eyebrowStyle = {
  fontFamily: MONO,
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: COLORS.muted,
};

const cardStyle = {
  background: COLORS.card,
  border: `1px solid ${COLORS.lineSoft}`,
  borderRadius: 14,
  padding: "20px 22px",
};

const cardHeadStyle = {
  display: "flex",
  alignItems: "baseline" as const,
  justifyContent: "space-between" as const,
  gap: 14,
  marginBottom: 18,
  flexWrap: "wrap" as const,
};

const cardTitleStyle = {
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  margin: 0,
  color: COLORS.text,
};

const cardSubtitleStyle = {
  margin: "2px 0 0",
  fontSize: 12,
  color: COLORS.muted,
};

const swatch = (color: string, size = 9) => ({
  width: size,
  height: size,
  borderRadius: 3,
  background: color,
  display: "inline-block" as const,
  flex: "0 0 auto",
});

const reveal = (mounted: boolean, delay: number) => ({
  opacity: mounted ? 1 : 0,
  transform: mounted ? "none" : "translateY(10px)",
  transition: `opacity .55s cubic-bezier(.2,.7,.2,1) ${delay}s, transform .55s cubic-bezier(.2,.7,.2,1) ${delay}s`,
});

type HealthMatrixRowProps = {
  category: CategoryBreakdownItem;
  maxCount: number;
  filter: MatrixFilter | null;
};

const HealthMatrixRow = ({ category, maxCount, filter }: HealthMatrixRowProps) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const risk = category.lowStockCount + category.outOfStockCount;
  const cells: MatrixFilter[] = [
    ...Array(category.outOfStockCount).fill("tukenen" as const),
    ...Array(category.lowStockCount).fill("kritik" as const),
    ...Array(category.healthyCount).fill("saglikli" as const),
  ];
  const cellLabel: Record<MatrixFilter, string> = {
    saglikli: "Sağlıklı",
    kritik: "Kritik",
    tukenen: "Tükenen",
  };
  const cellColor: Record<MatrixFilter, string> = {
    saglikli: COLORS.tealSoft,
    kritik: COLORS.amber,
    tukenen: COLORS.rust,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "132px 1fr 62px", alignItems: "center", gap: 14 }}>
      <span
        style={{
          fontSize: 12.5,
          color: COLORS.text,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {category.categoryName}
      </span>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${maxCount}, 1fr)`, gap: 5 }}>
        {cells.map((type, index) => (
          <span
            key={index}
            title={`${category.categoryName} · ${cellLabel[type]}`}
            onMouseEnter={() => setHoveredCell(index)}
            onMouseLeave={() => setHoveredCell(null)}
            style={{
              height: 24,
              borderRadius: 5,
              background: cellColor[type],
              opacity: filter && filter !== type ? 0.16 : 1,
              transform: hoveredCell === index ? "translateY(-2px)" : "none",
              transition: "opacity .18s ease, transform .18s ease",
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: MONO, fontSize: 11.5, color: risk ? COLORS.rust : COLORS.muted, textAlign: "right" }}>
        {risk ? `${risk} riskli` : "temiz"}
      </span>
    </div>
  );
};

type CategoryValueChartProps = {
  categories: { key: string; name: string; valueTL: number }[];
  total: number;
  mounted: boolean;
};

const CategoryValueChart = ({ categories, total, mounted }: CategoryValueChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 700;
  const padL = 138;
  const padR = 140;
  const top = 10;
  const rowH = 36;
  const maxValue = Math.max(...categories.map((c) => c.valueTL), 1);
  const xMax = niceValueCeil(maxValue);
  const plotW = W - padL - padR;
  const H = top + categories.length * rowH + 30;
  const x = (v: number) => padL + (v / xMax) * plotW;
  const ticks = [0, xMax * 0.25, xMax * 0.5, xMax * 0.75, xMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }} role="img" aria-label="Kategoriye göre stok değeri">
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={x(t)}
            y1={top}
            x2={x(t)}
            y2={top + categories.length * rowH}
            stroke={i === 0 ? COLORS.line : COLORS.lineSoft}
            strokeWidth={1}
          />
          <text
            x={x(t)}
            y={H - 10}
            textAnchor={i === 0 ? "start" : "middle"}
            style={{ fontFamily: MONO, fontSize: 10, fill: COLORS.muted, letterSpacing: "0.03em" }}
          >
            {i === 0 ? "₺0" : `₺${Math.round(t / 1000)}B`}
          </text>
        </g>
      ))}
      {categories.map((c, i) => {
        const y = top + i * rowH;
        const w = Math.max(x(c.valueTL) - padL, 0);
        return (
          <g key={c.key} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <title>{`${c.name} · ${formatMoney(c.valueTL)}`}</title>
            <text x={0} y={y + 22} style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, fill: COLORS.text }}>
              {c.name}
            </text>
            <rect
              x={padL}
              y={y + 9}
              height={18}
              rx={3}
              width={mounted ? w : 0}
              fill={hovered === i ? COLORS.tealDark : COLORS.teal}
              style={{ transition: "width .9s cubic-bezier(.2,.7,.2,1), fill .18s ease" }}
            />
            <text
              x={W - 46}
              y={y + 23}
              textAnchor="end"
              style={{ fontFamily: MONO, fontSize: 11, fill: COLORS.text, letterSpacing: "-0.01em" }}
            >
              {formatMoney(c.valueTL)}
            </text>
            <text x={W} y={y + 23} textAnchor="end" style={{ fontFamily: MONO, fontSize: 10, fill: COLORS.muted }}>
              {formatPercent1(total > 0 ? (c.valueTL / total) * 100 : 0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

type BrandBarChartProps = {
  brands: { key: string; name: string; count: number }[];
  mounted: boolean;
};

const BrandBarChart = ({ brands, mounted }: BrandBarChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 560;
  const H = 280;
  const padL = 30;
  const padR = 6;
  const top = 24;
  const base = 232;
  const maxCount = Math.max(...brands.map((b) => b.count), 1);
  const yMax = niceCountCeil(maxCount);
  const band = (W - padL - padR) / Math.max(brands.length, 1);
  const bw = Math.min(band - 34, 52);
  const y = (v: number) => base - (v / yMax) * (base - top);
  const ticks = [0, yMax / 3, (yMax * 2) / 3, yMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }} role="img" aria-label="En çok ürüne sahip markalar">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={y(t)} x2={W - padR} y2={y(t)} stroke={i === 0 ? COLORS.line : COLORS.lineSoft} strokeWidth={1} />
          <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" style={{ fontFamily: MONO, fontSize: 10, fill: COLORS.muted, letterSpacing: "0.03em" }}>
            {Math.round(t)}
          </text>
        </g>
      ))}
      {brands.map((b, i) => {
        const cx = padL + band * i + band / 2;
        const targetY = y(b.count);
        const targetH = base - targetY;
        return (
          <g key={b.key} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <title>{`${b.name} · ${b.count} ürün`}</title>
            <rect
              x={cx - bw / 2}
              width={bw}
              rx={3}
              y={mounted ? targetY : base}
              height={mounted ? targetH : 0}
              fill={hovered === i ? COLORS.teal : COLORS.ink}
              style={{ transition: "height .9s cubic-bezier(.2,.7,.2,1), y .9s cubic-bezier(.2,.7,.2,1), fill .18s ease" }}
            />
            <text
              x={cx}
              y={targetY - 9}
              textAnchor="middle"
              style={{
                fontFamily: MONO,
                fontSize: 11,
                fill: hovered === i ? COLORS.teal : COLORS.text,
                letterSpacing: "-0.01em",
                transition: "fill .18s ease",
              }}
            >
              {b.count}
            </text>
            <text x={cx} y={base + 22} textAnchor="middle" style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, fill: COLORS.text }}>
              {b.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

type SupplierDonutProps = {
  suppliers: { key: string; name: string; count: number }[];
  mounted: boolean;
};

const SupplierDonut = ({ suppliers, mounted }: SupplierDonutProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const R = 58;
  const C = 2 * Math.PI * R;
  const total = suppliers.reduce((sum, s) => sum + s.count, 0) || 1;
  let acc = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 168px", width: 168, position: "relative" }}>
        <svg viewBox="0 0 160 160" style={{ overflow: "visible" }} role="img" aria-label="Tedarikçilere göre ürün dağılımı">
          {suppliers.map((sp, i) => {
            const frac = sp.count / total;
            const len = mounted ? Math.max(frac * C - 3, 2) : 0;
            const rotation = -90 + acc * 360;
            acc += frac;
            return (
              <circle
                key={sp.key}
                cx={80}
                cy={80}
                r={R}
                fill="none"
                stroke={SUPPLIER_SHADES[i % SUPPLIER_SHADES.length]}
                strokeWidth={21}
                strokeDasharray={`${len} ${C - len}`}
                transform={`rotate(${rotation} 80 80)`}
                opacity={hovered === null || hovered === i ? 1 : 0.2}
                style={{ transition: "stroke-dasharray .9s cubic-bezier(.2,.7,.2,1), opacity .18s ease" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <title>{`${sp.name} · ${sp.count} ürün`}</title>
              </circle>
            );
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center" }}>
          <b style={{ fontFamily: MONO, fontSize: 24, fontWeight: 500, letterSpacing: "-0.03em", display: "block", lineHeight: 1 }}>{total}</b>
          <span style={{ fontSize: 10.5, color: COLORS.muted, letterSpacing: "0.02em" }}>ürün</span>
        </div>
      </div>
      <ul style={{ flex: 1, minWidth: 210, margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
        {suppliers.map((sp, i) => (
          <li
            key={sp.key}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, cursor: "default" }}
          >
            <span style={swatch(SUPPLIER_SHADES[i % SUPPLIER_SHADES.length])} />
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sp.name}</span>
            <span style={{ fontFamily: MONO, fontSize: 12 }}>{sp.count}</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: COLORS.muted, width: 42, textAlign: "right" }}>
              {formatPercent1((sp.count / total) * 100)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Statistics = () => {
  const [pageParent] = useAutoAnimate({ duration: 350 });
  const [gridParent] = useAutoAnimate({ duration: 300 });
  const [matrixParent] = useAutoAnimate({ duration: 250 });
  const [data, setData] = useState<ProductStatsBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [matrixFilter, setMatrixFilter] = useState<MatrixFilter | null>(null);
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== "undefined" && window.innerWidth < 1180);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getProductStatsBreakdown();
      setLoading(false);

      if (!result.res) {
        toast.error(result.message);
        return;
      }

      setData(result.data);
    };

    load();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 1180);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => setMounted(true), 140);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading || !data) {
    return <StatisticsLoading />;
  }

  const totalInventoryTL = toTL(data.totalInventoryValue);
  const totalCostTL = toTL(data.totalCostValue);
  const potentialProfitTL = totalInventoryTL - totalCostTL;
  const marginPercent = totalInventoryTL > 0 ? (potentialProfitTL / totalInventoryTL) * 100 : 0;
  const costPercent = 100 - marginPercent;
  const riskyCount = data.lowStockCount + data.outOfStockCount;
  const riskyPercent = data.totalProducts > 0 ? (riskyCount / data.totalProducts) * 100 : 0;
  const maxCategoryCount = Math.max(...data.byCategory.map((c) => c.productCount), 1);
  const riskiestCategory = data.byCategory.reduce<CategoryBreakdownItem | null>((worst, category) => {
    const risk = category.lowStockCount + category.outOfStockCount;
    if (risk === 0) return worst;
    const worstRisk = worst ? worst.lowStockCount + worst.outOfStockCount : 0;
    return risk > worstRisk ? category : worst;
  }, null);
  const categoryChartData = [...data.byCategory]
    .sort((a, b) => b.stockValue - a.stockValue)
    .map((c) => ({ key: String(c.categoryId), name: c.categoryName, valueTL: toTL(c.stockValue) }));
  const brandChartData = data.byBrand.map((b) => ({ key: String(b.brandId), name: b.brandName, count: b.productCount }));
  const supplierChartData = data.bySupplier.map((s) => ({ key: String(s.supplierId), name: s.supplierName, count: s.productCount }));
  const brandCoveragePercent =
    data.totalProducts > 0 ? (data.byBrand.reduce((sum, b) => sum + b.productCount, 0) / data.totalProducts) * 100 : 0;
  const featuredPercent = data.totalProducts > 0 ? Math.round((data.featuredCount / data.totalProducts) * 100) : 0;
  const todayLabel = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div
      ref={pageParent}
      style={{
        margin: "-24px",
        padding: "30px 34px 56px",
        background: COLORS.canvas,
        minHeight: "calc(100vh - 76px)",
        fontFamily: SANS,
        fontSize: 14,
        lineHeight: 1.45,
        color: COLORS.text,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 26, flexWrap: "wrap" }}>
        <div>
          <p style={eyebrowStyle}>{`Envanter özeti · ${todayLabel}`}</p>
          <h1 style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, letterSpacing: "-0.035em", margin: "6px 0 0", lineHeight: 1, color: COLORS.ink }}>
            İstatistikler
          </h1>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.02em",
            color: COLORS.muted,
            border: `1px solid ${COLORS.line}`,
            background: COLORS.card,
            borderRadius: 999,
            padding: "7px 13px",
          }}
        >
          {data.totalProducts} ürün izleniyor
        </span>
      </div>

      <div ref={gridParent} style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
        <section
          style={{
            gridColumn: "span 12",
            background: COLORS.ink,
            color: "#F2F3EE",
            borderRadius: 14,
            padding: "28px 30px",
            display: "grid",
            gridTemplateColumns: isNarrow ? "1fr" : "1.35fr 1fr",
            gap: isNarrow ? 26 : 40,
            ...reveal(mounted, 0.02),
          }}
        >
          <div>
            <p style={{ ...eyebrowStyle, color: "rgba(242,243,238,.45)" }}>Depodaki toplam değer</p>
            <p style={{ fontFamily: MONO, fontSize: 62, fontWeight: 500, letterSpacing: "-0.045em", margin: "10px 0 22px", lineHeight: 1 }}>
              {formatMoney(totalInventoryTL)}
            </p>
            <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", gap: 2 }} aria-label="Maliyet ve potansiyel kâr dağılımı">
              <span
                style={{
                  display: "block",
                  height: "100%",
                  borderRadius: 3,
                  background: "#F2F3EE",
                  width: mounted ? `${costPercent}%` : "0%",
                  transition: "width 1s cubic-bezier(.2,.7,.2,1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "100%",
                  borderRadius: 3,
                  background: COLORS.lime,
                  width: mounted ? `${marginPercent}%` : "0%",
                  transition: "width 1s cubic-bezier(.2,.7,.2,1)",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={swatch("#F2F3EE")} />
                  Maliyet değeri
                </span>
                <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "-0.02em" }}>{formatMoney(totalCostTL)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={swatch(COLORS.lime)} />
                  Potansiyel kâr
                </span>
                <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "-0.02em" }}>{formatMoney(potentialProfitTL)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)" }}>Marj</span>
                <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "-0.02em" }}>{formatPercent1(marginPercent)}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "rgba(242,243,238,.14)",
              borderRadius: 12,
              overflow: "hidden",
              alignSelf: "center",
            }}
          >
            <div style={{ background: COLORS.ink2, padding: "16px 18px" }}>
              <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "-0.035em", display: "block", lineHeight: 1.1 }}>
                {data.totalProducts}
              </span>
              <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)", marginTop: 4, display: "block" }}>Toplam ürün</span>
            </div>
            <div style={{ background: COLORS.ink2, padding: "16px 18px" }}>
              <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "-0.035em", display: "block", lineHeight: 1.1 }}>
                {data.byCategory.length}
              </span>
              <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)", marginTop: 4, display: "block" }}>Kategori</span>
            </div>
            <div style={{ background: COLORS.ink2, padding: "16px 18px" }}>
              <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "-0.035em", display: "block", lineHeight: 1.1, color: COLORS.amber }}>
                {riskyCount}
              </span>
              <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)", marginTop: 4, display: "block" }}>Stoku riskli ürün</span>
            </div>
            <div style={{ background: COLORS.ink2, padding: "16px 18px" }}>
              <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "-0.035em", display: "block", lineHeight: 1.1 }}>
                +{data.recentlyAddedCount}
              </span>
              <span style={{ fontSize: 11.5, color: "rgba(242,243,238,.5)", marginTop: 4, display: "block" }}>Son 30 günde eklenen</span>
            </div>
          </div>
        </section>

        <section style={{ gridColumn: "span 12", ...cardStyle, ...reveal(mounted, 0.08) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Stok sağlığı</h2>
              <p style={cardSubtitleStyle}>Her kare bir ürün. Satırlar kategorileri gösterir.</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["saglikli", "kritik", "tukenen"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onMouseEnter={() => setMatrixFilter(key)}
                  onMouseLeave={() => setMatrixFilter(null)}
                  onFocus={() => setMatrixFilter(key)}
                  onBlur={() => setMatrixFilter(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1px solid ${COLORS.line}`,
                    background: "transparent",
                    borderRadius: 999,
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontFamily: SANS,
                    fontSize: 12,
                    color: COLORS.text,
                  }}
                >
                  <span style={swatch(key === "saglikli" ? COLORS.tealSoft : key === "kritik" ? COLORS.amber : COLORS.rust, 8)} />
                  {key === "saglikli" ? "Sağlıklı" : key === "kritik" ? "Kritik" : "Tükenen"}
                  <b style={{ fontFamily: MONO, fontWeight: 500, fontSize: 12 }}>
                    {key === "saglikli" ? data.healthyStockCount : key === "kritik" ? data.lowStockCount : data.outOfStockCount}
                  </b>
                </button>
              ))}
            </div>
          </div>
          <div ref={matrixParent} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {data.byCategory.map((category) => (
              <HealthMatrixRow key={category.categoryId} category={category} maxCount={maxCategoryCount} filter={matrixFilter} />
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px solid ${COLORS.lineSoft}`,
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              fontSize: 12,
              color: COLORS.muted,
              flexWrap: "wrap",
            }}
          >
            <span>
              Ürünlerin <b style={{ color: COLORS.text, fontFamily: MONO, fontWeight: 500 }}>{formatPercent0(riskyPercent)}</b>'u yeniden sipariş
              eşiğinin altında.
            </span>
            <span>
              En riskli kategori:{" "}
              <b style={{ color: COLORS.text, fontFamily: MONO, fontWeight: 500 }}>{riskiestCategory?.categoryName ?? "Yok"}</b>
              {riskiestCategory ? ` · ${riskiestCategory.lowStockCount + riskiestCategory.outOfStockCount} ürün` : ""}
            </span>
          </div>
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 7", ...cardStyle, ...reveal(mounted, 0.14) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Kategoriye göre değer</h2>
              <p style={cardSubtitleStyle}>Kategoriler stok değerine göre sıralı.</p>
            </div>
            <span style={eyebrowStyle}>{formatMoney(totalInventoryTL)}</span>
          </div>
          <CategoryValueChart categories={categoryChartData} total={totalInventoryTL} mounted={mounted} />
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 5", ...cardStyle, ...reveal(mounted, 0.2) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Tedarikçiler</h2>
              <p style={cardSubtitleStyle}>Ürün sayısına göre</p>
            </div>
            <span style={eyebrowStyle}>{supplierChartData.length} firma</span>
          </div>
          <SupplierDonut suppliers={supplierChartData} mounted={mounted} />
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 6", ...cardStyle, ...reveal(mounted, 0.26) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>En çok ürüne sahip markalar</h2>
              <p style={cardSubtitleStyle}>
                İlk {brandChartData.length} marka toplamın {formatPercent0(brandCoveragePercent)}'unu oluşturuyor
              </p>
            </div>
          </div>
          <BrandBarChart brands={brandChartData} mounted={mounted} />
        </section>

        <section
          style={{
            gridColumn: isNarrow ? "span 12" : "span 6",
            ...cardStyle,
            display: "flex",
            flexDirection: "column",
            ...reveal(mounted, 0.32),
          }}
        >
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Katalog durumu</h2>
              <p style={cardSubtitleStyle}>Yayın durumuna göre ürünler</p>
            </div>
          </div>
          <div style={{ display: "flex", height: 10, gap: 2, marginBottom: 14 }}>
            {STATUS_ORDER.map((meta) => {
              const count = data.byStatus.find((s) => s.status === meta.status)?.count ?? 0;
              return <span key={meta.status} style={{ borderRadius: 3, background: meta.color, flex: count || 0.0001 }} />;
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {STATUS_ORDER.map((meta) => {
              const count = data.byStatus.find((s) => s.status === meta.status)?.count ?? 0;
              return (
                <div key={meta.status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 9, color: COLORS.muted }}>
                    <span style={swatch(meta.color)} />
                    {meta.label}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 13 }}>{count}</span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: "auto",
              paddingTop: 20,
              borderTop: `1px solid ${COLORS.lineSoft}`,
            }}
          >
            <div>
              <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "-0.035em", display: "block", lineHeight: 1 }}>
                %{featuredPercent}
              </span>
              <span style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 5, display: "block" }}>
                Öne çıkan ürün oranı · {data.featuredCount} ürün
              </span>
            </div>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "-0.035em", display: "block", lineHeight: 1 }}>
                {data.recentlyAddedCount}
              </span>
              <span style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 5, display: "block" }}>Son 30 günde eklenen ürün</span>
            </div>
          </div>
        </section>
      </div>

      <p style={{ marginTop: 26, fontFamily: MONO, fontSize: 10.5, color: COLORS.muted, letterSpacing: "0.02em" }}>
        Değerler API'den anlık hesaplanmıştır.
      </p>
    </div>
  );
};

export default Statistics;

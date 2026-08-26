import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Empty } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  getProductById,
  getProductLogs,
  getProductStockHistory,
  deleteProduct,
  type ProductDetail,
  type ActivityLog,
  type StockHistoryPoint,
} from "../../services/products";
import ProductDetailLoading from "./loading";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditProductDialog from "./EditProductDialog";
import StockEntryDialog from "./StockEntryDialog";
import { useProductEvents } from "../../hooks/useProductEvents";

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
};

const SANS = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace";

const UNIT_LABELS: Record<number, string> = {
  1: "Adet",
  2: "Kg",
  3: "Lt",
  4: "Paket",
};

const STATUS_META: Record<number, { text: string; teal: boolean }> = {
  1: { text: "Aktif", teal: true },
  2: { text: "Pasif", teal: false },
  3: { text: "Üretimi durduruldu", teal: false },
};

const formatUnitPrice = (kurus: number) =>
  "₺" + (kurus / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatMoney = (kurus: number) => "₺" + Math.round(kurus / 100).toLocaleString("tr-TR");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

const formatLogDate = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });

const niceCountCeil = (value: number) => {
  if (value <= 5) return 5;
  if (value <= 30) return Math.ceil(value / 5) * 5;
  if (value <= 100) return Math.ceil(value / 10) * 10;
  return Math.ceil(value / 50) * 50;
};

const HISTORY_LABEL_STEP = 3;

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
  display: "flex" as const,
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

const specLabelStyle = { fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 3 };
const specValueStyle = { fontSize: 13.5, fontWeight: 500, color: COLORS.text };
const specValueMonoStyle = { fontFamily: MONO, fontWeight: 400, fontSize: 13, letterSpacing: "-0.01em", color: COLORS.text };

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

import type { StockTrendChartProps } from "../../types/productDetail";

const StockTrendChart = ({ history, minStock }: StockTrendChartProps) => {
  if (history.length === 0) {
    return null;
  }

  const W = 700;
  const H = 300;
  const padL = 34;
  const padR = 12;
  const top = 16;
  const base = 246;
  const values = history.map((point) => point.stock);
  const yMax = niceCountCeil(Math.max(...values, minStock) * 1.15);
  const x = (i: number) => padL + (i * (W - padL - padR)) / Math.max(history.length - 1, 1);
  const y = (v: number) => base - (v / yMax) * (base - top);
  const ticks = [0, yMax / 3, (yMax * 2) / 3, yMax];
  const linePath = values.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const areaPath = `${linePath} L${x(history.length - 1)} ${base} L${padL} ${base} Z`;
  const lastIndex = history.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }} role="img" aria-label="Son haftaların stok seyri">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={y(t)} x2={W - padR} y2={y(t)} stroke={i === 0 ? COLORS.line : COLORS.lineSoft} strokeWidth={1} />
          <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" style={{ fontFamily: MONO, fontSize: 10, fill: COLORS.muted, letterSpacing: "0.03em" }}>
            {Math.round(t)}
          </text>
        </g>
      ))}
      <path d={areaPath} fill="rgba(16,99,92,0.12)" />
      <path d={linePath} fill="none" stroke={COLORS.teal} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <line x1={padL} y1={y(minStock)} x2={W - padR} y2={y(minStock)} stroke={COLORS.rust} strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={W - padR} y={y(minStock) - 7} textAnchor="end" style={{ fontFamily: MONO, fontSize: 10, fill: COLORS.rust }}>
        {`Kritik eşik · ${minStock}`}
      </text>
      {history.map((point, i) => {
        const last = i === lastIndex;
        const showLabel = last || i === 0 || (lastIndex - i) % HISTORY_LABEL_STEP === 0;
        return (
          <g key={point.weekEnding}>
            <circle
              cx={x(i)}
              cy={y(point.stock)}
              r={last ? 5 : 3}
              fill={last ? COLORS.teal : COLORS.card}
              stroke={COLORS.teal}
              strokeWidth={2}
            >
              <title>{`${formatLogDate(point.weekEnding)} · ${point.stock} adet`}</title>
            </circle>
            {showLabel && (
              <text
                x={x(i)}
                y={base + 20}
                textAnchor={last ? "end" : "middle"}
                style={{ fontFamily: MONO, fontSize: 10, fill: COLORS.muted, letterSpacing: "0.03em" }}
              >
                {last ? "Bu hafta" : formatLogDate(point.weekEnding)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const LOG_VALUE_COLOR: Record<string, string> = {
  up: COLORS.teal,
  down: COLORS.amber,
  neutral: COLORS.text,
};

const formatLogValue = (log: ActivityLog) => {
  if (log.quantityDelta !== null) {
    const sign = log.quantityDelta > 0 ? "+" : "";
    const tone = log.quantityDelta > 0 ? "up" : log.quantityDelta < 0 ? "down" : "neutral";
    return { text: `${sign}${log.quantityDelta}`, tone };
  }

  if (log.amountKurus !== null) {
    return { text: formatUnitPrice(log.amountKurus), tone: "neutral" };
  }

  return { text: "—", tone: "neutral" };
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gridParent] = useAutoAnimate({ duration: 350 });
  const [logsParent] = useAutoAnimate({ duration: 250 });
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== "undefined" && window.innerWidth < 1180);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  const loadLogs = useCallback(async (productId: number) => {
    const result = await getProductLogs(productId, 8);
    if (result.res) {
      setLogs(result.data);
    }
  }, []);

  const loadStockHistory = useCallback(async (productId: number) => {
    const result = await getProductStockHistory(productId, 12);
    if (result.res) {
      setStockHistory(result.data);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);

      const result = await getProductById(Number(id));

      if (!result.res) {
        setLoading(false);
        if (result.status === 404) {
          setNotFound(true);
        } else {
          toast.error(result.message);
        }
        return;
      }

      setProduct(result.data);
      await Promise.all([loadLogs(result.data.id), loadStockHistory(result.data.id)]);
      setLoading(false);
    };

    load();
  }, [id, loadLogs, loadStockHistory]);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1180);
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useProductEvents((event) => {
    if (!product || event.productId !== product.id) return;

    if (event.type === "product.deleted") {
      toast.info("Bu ürün başka bir cihazdan silindi.");
      navigate("/urunler", { replace: true });
      return;
    }

    if (event.product) {
      setProduct((prev) => (prev ? { ...prev, ...event.product } : prev));
    }

    loadLogs(product.id);
    loadStockHistory(product.id);
  });

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => setMounted(true), 140);
    return () => clearTimeout(timeout);
  }, [loading]);

  const handleDelete = async () => {
    if (!product) return;

    setDeleting(true);
    const result = await deleteProduct(product.id);
    setDeleting(false);
    setDeleteDialogOpen(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Ürün silindi.");
    navigate("/urunler");
  };

  if (loading) {
    return <ProductDetailLoading />;
  }

  if (notFound || !product) {
    return (
      <div style={{ margin: "-24px", padding: "30px 34px 56px", background: COLORS.canvas, minHeight: "calc(100vh - 76px)", fontFamily: SANS }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/urunler")}
          style={{ marginBottom: 20, fontSize: 14, fontWeight: 600, color: COLORS.text }}
        >
          Ürünlere dön
        </Button>
        <div style={{ ...cardStyle, textAlign: "center", padding: 60 }}>
          <Empty description="Ürün bulunamadı" />
        </div>
      </div>
    );
  }

  const statusMeta = STATUS_META[product.status];
  const unitLabel = UNIT_LABELS[product.unit] ?? String(product.unit);
  const margin = product.price - product.costPrice;
  const marginPercent = product.price > 0 ? Math.round((margin / product.price) * 100) : 0;
  const costPercent = product.price > 0 ? (product.costPrice / product.price) * 100 : 0;
  const marginBarPercent = 100 - costPercent;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStock;
  const pillText = isOutOfStock
    ? "Stok tükendi"
    : isLowStock
    ? "Kritik eşiğin altında"
    : `Eşiğin ${product.stock - product.minStock} adet üzerinde`;
  const pillColors = isOutOfStock
    ? { bg: "rgba(198,63,38,0.12)", fg: COLORS.rust }
    : isLowStock
    ? { bg: "rgba(225,150,43,0.14)", fg: COLORS.amber }
    : { bg: COLORS.tealSoft, fg: COLORS.tealDark };
  const gaugeMax = niceCountCeil(Math.max(product.stock * 1.15, product.minStock * 3, 10));
  const gaugeFillPercent = Math.min((product.stock / gaugeMax) * 100, 100);
  const thresholdPercent = Math.min((product.minStock / gaugeMax) * 100, 100);
  const totalMarginKurus = margin * product.stock;

  return (
    <div
      style={{
        margin: "-24px",
        padding: isMobile ? "22px 16px 44px" : "30px 34px 56px",
        background: COLORS.canvas,
        minHeight: "calc(100vh - 76px)",
        fontFamily: SANS,
        fontSize: 14,
        lineHeight: 1.45,
        color: COLORS.text,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: isMobile ? 12 : 24, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: isMobile ? "1 1 100%" : undefined }}>
          <button
            type="button"
            onClick={() => navigate("/urunler")}
            aria-label="Ürünlere dön"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${COLORS.line}`,
              background: COLORS.card,
              color: COLORS.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flex: "0 0 auto",
            }}
          >
            <ArrowLeftOutlined />
          </button>
          <nav
            aria-label="Konum"
            style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", color: COLORS.muted, minWidth: 0, overflow: "hidden" }}
          >
            <a
              href="/urunler"
              onClick={(event) => {
                event.preventDefault();
                navigate("/urunler");
              }}
              style={{ color: COLORS.muted, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Ürünler
            </a>
            <span style={{ opacity: 0.45, flex: "0 0 auto" }}>/</span>
            <span style={{ whiteSpace: "nowrap" }}>{product.categoryName}</span>
            <span style={{ opacity: 0.45, flex: "0 0 auto" }}>/</span>
            <b style={{ color: COLORS.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.sku}</b>
          </nav>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: isMobile ? "1 1 100%" : undefined }}>
          <Button
            size={isMobile ? "middle" : "large"}
            icon={<PlusOutlined />}
            onClick={() => setStockDialogOpen(true)}
            style={{ background: COLORS.ink, borderColor: COLORS.ink, color: "#FFFFFF" }}
          >
            Stok girişi
          </Button>
          <Button size={isMobile ? "middle" : "large"} icon={<EditOutlined />} onClick={() => setEditDialogOpen(true)}>
            Düzenle
          </Button>
          <Button
            size={isMobile ? "middle" : "large"}
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => setDeleteDialogOpen(true)}
            style={{ color: COLORS.rust }}
          >
            Sil
          </Button>
        </div>
      </div>

      <div ref={gridParent} style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: isMobile ? 12 : 16 }}>
        <section
          style={{
            gridColumn: "span 12",
            background: COLORS.ink,
            color: "#F2F3EE",
            borderRadius: 14,
            padding: isMobile ? "20px 16px" : "26px 30px",
            display: "grid",
            gridTemplateColumns: isNarrow ? "1fr" : "1.25fr 1fr",
            gap: isNarrow ? 28 : 44,
            alignItems: "center",
            ...reveal(mounted, 0.02),
          }}
        >
          <div style={{ display: "flex", gap: isMobile ? 14 : 22, alignItems: isMobile ? "flex-start" : "center" }}>
            <div
              style={{
                width: isMobile ? 72 : 112,
                height: isMobile ? 72 : 112,
                flex: isMobile ? "0 0 72px" : "0 0 112px",
                borderRadius: 12,
                background: "#F2F3EE",
                overflow: "hidden",
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: isMobile ? 8 : 11 }}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(242,243,238,0.22)",
                    color: "rgba(242,243,238,0.72)",
                  }}
                >
                  {product.categoryName}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: statusMeta?.teal ? "1px solid rgba(191,231,222,0.35)" : "1px solid rgba(242,243,238,0.22)",
                    color: statusMeta?.teal ? "#BFE7DE" : "rgba(242,243,238,0.72)",
                  }}
                >
                  {statusMeta?.text ?? "—"}
                </span>
                {product.isFeatured && (
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: COLORS.lime,
                      color: COLORS.ink,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <StarFilled style={{ fontSize: 9 }} />
                    Öne çıkan
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontSize: isMobile ? 22 : 32,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  margin: "0 0 8px",
                  lineHeight: 1.1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                }}
              >
                {product.name}
              </h1>
              <p style={{ fontFamily: MONO, fontSize: isMobile ? 11 : 12, color: "rgba(242,243,238,0.5)", letterSpacing: "0.03em", margin: 0, wordBreak: "break-all" }}>
                {`${product.sku} · ${product.brandName} · ${unitLabel}`}
              </p>
            </div>
          </div>

          <div>
            <p style={{ ...eyebrowStyle, color: "rgba(242,243,238,0.45)" }}>Birim ekonomisi</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "10px 0 12px", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: MONO, fontSize: isMobile ? 28 : 38, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {formatUnitPrice(product.price)}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: COLORS.lime }}>{`%${marginPercent} marj`}</span>
            </div>
            <div style={{ display: "flex", height: 11, gap: 2 }} aria-label="Maliyet ve kâr dağılımı">
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
                  width: mounted ? `${marginBarPercent}%` : "0%",
                  transition: "width 1s cubic-bezier(.2,.7,.2,1)",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 26, marginTop: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11.5, color: "rgba(242,243,238,0.5)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={swatch("#F2F3EE")} />
                  Maliyet
                </span>
                <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "-0.02em" }}>{formatUnitPrice(product.costPrice)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11.5, color: "rgba(242,243,238,0.5)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={swatch(COLORS.lime)} />
                  Birim kâr
                </span>
                <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "-0.02em" }}>{formatUnitPrice(margin)}</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 7", ...cardStyle, display: "flex", flexDirection: "column", ...reveal(mounted, 0.08) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Stok durumu</h2>
              <p style={cardSubtitleStyle}>Kritik eşiğe göre mevcut adet</p>
            </div>
            <span style={eyebrowStyle}>Depo 01</span>
          </div>

          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", gap: isMobile ? 10 : 16, marginBottom: 22, flexWrap: "wrap" }}>
            <span style={{ fontFamily: MONO, fontSize: isMobile ? 38 : 52, letterSpacing: "-0.045em", lineHeight: 0.9 }}>{product.stock}</span>
            <span style={{ fontSize: 13, color: COLORS.muted, paddingBottom: isMobile ? 0 : 5 }}>{unitLabel.toLowerCase()}</span>
            <span
              style={{
                marginLeft: isMobile ? 0 : "auto",
                fontFamily: MONO,
                fontSize: 11,
                padding: "6px 12px",
                borderRadius: 999,
                background: pillColors.bg,
                color: pillColors.fg,
              }}
            >
              {pillText}
            </span>
          </div>

          <div style={{ position: "relative", height: 14, borderRadius: 7, background: "rgba(14,17,22,0.06)", marginBottom: 8 }}>
            <span
              style={{
                display: "block",
                height: "100%",
                borderRadius: 7,
                background: COLORS.teal,
                width: mounted ? `${gaugeFillPercent}%` : "0%",
                transition: "width 1s cubic-bezier(.2,.7,.2,1)",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: -7,
                bottom: -7,
                width: 2,
                background: COLORS.rust,
                borderRadius: 2,
                left: `${thresholdPercent}%`,
              }}
            />
            <span
              style={{
                position: "absolute",
                top: 20,
                transform: "translateX(-50%)",
                fontFamily: MONO,
                fontSize: 10,
                color: COLORS.rust,
                whiteSpace: "nowrap",
                left: `${thresholdPercent}%`,
              }}
            >
              {`Kritik eşik · ${product.minStock}`}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 10.5, color: COLORS.muted, marginTop: 28 }}>
            <span>0</span>
            <span>{`Gösterge ölçeği · ${gaugeMax} ${unitLabel.toLowerCase()}`}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: COLORS.lineSoft,
              borderRadius: 12,
              overflow: "hidden",
              marginTop: "auto",
              paddingTop: 22,
            }}
          >
            <div style={{ background: COLORS.card, padding: "15px 4px 4px" }}>
              <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "-0.03em", display: "block", lineHeight: 1 }}>
                {formatMoney(product.costPrice * product.stock)}
              </span>
              <span style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 5, display: "block" }}>Stokun maliyeti</span>
            </div>
            <div style={{ background: COLORS.card, padding: "15px 4px 4px" }}>
              <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "-0.03em", display: "block", lineHeight: 1 }}>
                {formatMoney(product.price * product.stock)}
              </span>
              <span style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 5, display: "block" }}>Satış değeri</span>
            </div>
            <div style={{ background: COLORS.card, padding: "15px 4px 4px" }}>
              <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "-0.03em", display: "block", lineHeight: 1, color: COLORS.teal }}>
                {formatMoney(totalMarginKurus)}
              </span>
              <span style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 5, display: "block" }}>Potansiyel kâr</span>
            </div>
          </div>
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 5", ...cardStyle, ...reveal(mounted, 0.14) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Ürün künyesi</h2>
              <p style={cardSubtitleStyle}>Katalog kayıt bilgileri</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "13px 0", borderBottom: `1px solid ${COLORS.lineSoft}` }}>
              <span style={specLabelStyle}>SKU</span>
              <span style={specValueMonoStyle}>{product.sku}</span>
            </div>
            <div style={{ padding: "13px 0 13px 18px", borderBottom: `1px solid ${COLORS.lineSoft}` }}>
              <span style={specLabelStyle}>Barkod</span>
              <span style={specValueMonoStyle}>{product.barcode || "—"}</span>
            </div>
            <div style={{ padding: "13px 0", borderBottom: `1px solid ${COLORS.lineSoft}` }}>
              <span style={specLabelStyle}>Marka</span>
              <span style={specValueStyle}>{product.brandName}</span>
            </div>
            <div style={{ padding: "13px 0 13px 18px", borderBottom: `1px solid ${COLORS.lineSoft}` }}>
              <span style={specLabelStyle}>Kategori</span>
              <span style={specValueStyle}>{product.categoryName}</span>
            </div>
            <div style={{ padding: "13px 0 0" }}>
              <span style={specLabelStyle}>Tedarikçi</span>
              <span style={specValueStyle}>{product.supplierName}</span>
            </div>
            <div style={{ padding: "13px 0 0 18px" }}>
              <span style={specLabelStyle}>Birim</span>
              <span style={specValueStyle}>{unitLabel}</span>
            </div>
          </div>
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 7", ...cardStyle, ...reveal(mounted, 0.2) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Stok seyri</h2>
              <p style={cardSubtitleStyle}>Son 12 hafta · haftalık kapanış adedi</p>
            </div>
          </div>
          <StockTrendChart history={stockHistory} minStock={product.minStock} />
        </section>

        <section style={{ gridColumn: isNarrow ? "span 12" : "span 5", ...cardStyle, display: "flex", flexDirection: "column", ...reveal(mounted, 0.26) }}>
          <div style={cardHeadStyle}>
            <div>
              <h2 style={cardTitleStyle}>Açıklama</h2>
              <p style={cardSubtitleStyle}>Katalogda görünen metin</p>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "#3A3F45" }}>
            {product.description || "Bu ürün için açıklama girilmemiş."}
          </p>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${COLORS.lineSoft}` }}>
            <p style={{ ...eyebrowStyle, margin: "0 0 12px" }}>Son hareketler</p>
            {logs.length === 0 ? (
              <p style={{ margin: 0, fontSize: 12.5, color: COLORS.muted }}>Henüz bir hareket kaydı yok.</p>
            ) : (
              <ul ref={logsParent} style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {logs.map((log) => {
                  const value = formatLogValue(log);
                  return (
                    <li key={log.id} style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 12.5 }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: COLORS.muted, width: 46, flex: "0 0 46px" }}>
                        {formatLogDate(log.createdAt)}
                      </span>
                      <span style={{ flex: 1, color: "#3A3F45" }}>{log.description}</span>
                      <span style={{ fontFamily: MONO, fontSize: 12, color: LOG_VALUE_COLOR[value.tone] }}>{value.text}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 18, borderTop: `1px solid ${COLORS.lineSoft}`, display: "flex", gap: 26, flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: 11, color: COLORS.muted, display: "block" }}>Oluşturulma</span>
              <span style={{ fontFamily: MONO, fontSize: 12 }}>{formatDate(product.createdAt)}</span>
            </div>
            <div>
              <span style={{ fontSize: 11, color: COLORS.muted, display: "block" }}>Son güncelleme</span>
              <span style={{ fontFamily: MONO, fontSize: 12 }}>{formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </section>
      </div>

      <p style={{ marginTop: 26, fontFamily: MONO, fontSize: 10.5, color: COLORS.muted, letterSpacing: "0.02em" }}>
        Fiyat, stok, künye ve stok seyri bilgileri mevcut kayıttan alınmıştır
      </p>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Ürünü sil"
        description={`"${product.name}" adlı ürünü silmek istediğine emin misin? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="Vazgeç"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <EditProductDialog
        open={editDialogOpen}
        product={product}
        onClose={() => setEditDialogOpen(false)}
        onUpdated={(updated) => {
          setProduct(updated);
          setEditDialogOpen(false);
          loadLogs(updated.id);
          loadStockHistory(updated.id);
        }}
      />

      <StockEntryDialog
        open={stockDialogOpen}
        productId={product.id}
        productName={product.name}
        onClose={() => setStockDialogOpen(false)}
        onAdded={async () => {
          setStockDialogOpen(false);
          const result = await getProductById(product.id);
          if (result.res) {
            setProduct(result.data);
          }
          loadLogs(product.id);
          loadStockHistory(product.id);
        }}
      />
    </div>
  );
};

export default ProductDetailPage;

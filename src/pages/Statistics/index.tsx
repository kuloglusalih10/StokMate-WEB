import { useEffect, useState, type ReactNode } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ShoppingOutlined,
  WalletOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  StarFilled,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { getProductStatsBreakdown, type ProductStatsBreakdown } from "../../services/products";
import { BRAND_COLORS } from "../../constants/colors";
import StatisticsLoading from "./loading";

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const STATUS_META: Record<number, { text: string; color: string }> = {
  1: { text: "Aktif", color: "#52C41A" },
  2: { text: "Pasif", color: "#8C8C8C" },
  3: { text: "Üretim Durduruldu", color: "#F5222D" },
};

const STOCK_HEALTH_COLORS = {
  healthy: "#52C41A",
  low: BRAND_COLORS.accent,
  out: "#F5222D",
};

const CATEGORY_FALLBACK_COLORS = [
  BRAND_COLORS.secondary,
  BRAND_COLORS.accent,
  "#52C41A",
  "#1677FF",
  "#9254DE",
  "#13C2C2",
];

const formatCurrency = (kurus: number) =>
  (kurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });

const Dot = ({ color }: { color: string }) => (
  <span
    style={{
      display: "inline-block",
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: color || "#D9D9D9",
      marginRight: 8,
      flex: "0 0 auto",
    }}
  />
);

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
};

const StatCard = ({ icon, label, value, sub, iconColor, iconBg }: StatCardProps) => (
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
      <div style={{ fontSize: 14, fontWeight: 600, color: "#8C8C8C", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: BRAND_COLORS.secondary, lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "#ADADAD", marginTop: 4 }}>{sub}</div>}
    </div>
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: iconBg,
        color: iconColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        flex: "0 0 auto",
      }}
    >
      {icon}
    </div>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={cardStyle}>
    <div style={{ fontSize: 17, fontWeight: 700, color: BRAND_COLORS.secondary, marginBottom: 20 }}>
      {title}
    </div>
    {children}
  </div>
);

const Statistics = () => {
  const [data, setData] = useState<ProductStatsBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !data) {
    return <StatisticsLoading />;
  }

  const potentialProfit = data.totalInventoryValue - data.totalCostValue;
  const featuredPercent =
    data.totalProducts > 0 ? Math.round((data.featuredCount / data.totalProducts) * 100) : 0;

  const statusData = data.byStatus.map((item) => ({
    name: STATUS_META[item.status]?.text ?? String(item.status),
    value: item.count,
    color: STATUS_META[item.status]?.color ?? "#D9D9D9",
  }));

  const stockHealthData = [
    { name: "Sağlıklı", value: data.healthyStockCount, color: STOCK_HEALTH_COLORS.healthy },
    { name: "Kritik", value: data.lowStockCount, color: STOCK_HEALTH_COLORS.low },
    { name: "Tükenen", value: data.outOfStockCount, color: STOCK_HEALTH_COLORS.out },
  ];

  const categoryData = data.byCategory.map((item, index) => ({
    ...item,
    color: item.categoryColor || CATEGORY_FALLBACK_COLORS[index % CATEGORY_FALLBACK_COLORS.length],
  }));

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 800, color: BRAND_COLORS.secondary }}>
        İstatistikler
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <StatCard
          icon={<ShoppingOutlined />}
          label="Toplam Ürün"
          value={data.totalProducts.toLocaleString("tr-TR")}
          iconColor={BRAND_COLORS.secondary}
          iconBg="rgba(215, 254, 71, 0.35)"
        />
        <StatCard
          icon={<WalletOutlined />}
          label="Toplam Stok Değeri"
          value={formatCurrency(data.totalInventoryValue)}
          iconColor={BRAND_COLORS.secondary}
          iconBg="rgba(14, 15, 12, 0.06)"
        />
        <StatCard
          icon={<DollarCircleOutlined />}
          label="Toplam Maliyet Değeri"
          value={formatCurrency(data.totalCostValue)}
          iconColor={BRAND_COLORS.accent}
          iconBg="rgba(255, 90, 31, 0.12)"
        />
        <StatCard
          icon={<RiseOutlined />}
          label="Potansiyel Kâr"
          value={formatCurrency(potentialProfit)}
          iconColor="#52C41A"
          iconBg="rgba(82, 196, 26, 0.12)"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <ChartCard title="Kategori Dağılımı">
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ width: 180, height: 180, flex: "0 0 auto" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="productCount"
                    nameKey="categoryName"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ürün`, "Adet"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 10 }}>
              {categoryData.map((item) => (
                <div
                  key={item.categoryId}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                >
                  <span style={{ display: "flex", alignItems: "center", fontSize: 14, color: BRAND_COLORS.secondary }}>
                    <Dot color={item.color} />
                    {item.categoryName}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: BRAND_COLORS.secondary }}>
                    {item.productCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Kategoriye Göre Stok Değeri">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(Number(value))}
                fontSize={12}
                stroke="#ADADAD"
              />
              <YAxis type="category" dataKey="categoryName" width={100} fontSize={13} stroke="#8C8C8C" />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="stockValue" radius={[0, 8, 8, 0]}>
                {categoryData.map((entry) => (
                  <Cell key={entry.categoryId} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="En Çok Ürüne Sahip Markalar">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.byBrand} margin={{ left: -12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="brandName" fontSize={12} stroke="#8C8C8C" />
              <YAxis allowDecimals={false} fontSize={12} stroke="#ADADAD" />
              <Tooltip formatter={(value) => [`${value} ürün`, "Adet"]} />
              <Bar dataKey="productCount" fill={BRAND_COLORS.secondary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tedarikçi Dağılımı">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.bySupplier} margin={{ left: -12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="supplierName" fontSize={12} stroke="#8C8C8C" />
              <YAxis allowDecimals={false} fontSize={12} stroke="#ADADAD" />
              <Tooltip formatter={(value) => [`${value} ürün`, "Adet"]} />
              <Bar dataKey="productCount" fill={BRAND_COLORS.accent} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Durum Dağılımı">
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ width: 180, height: 180, flex: "0 0 auto" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ürün`, "Adet"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 10 }}>
              {statusData.map((item) => (
                <div
                  key={item.name}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                >
                  <span style={{ display: "flex", alignItems: "center", fontSize: 14, color: BRAND_COLORS.secondary }}>
                    <Dot color={item.color} />
                    {item.name}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: BRAND_COLORS.secondary }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Stok Sağlığı">
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ width: 180, height: 180, flex: "0 0 auto" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockHealthData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {stockHealthData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ürün`, "Adet"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 10 }}>
              {stockHealthData.map((item) => (
                <div
                  key={item.name}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                >
                  <span style={{ display: "flex", alignItems: "center", fontSize: 14, color: BRAND_COLORS.secondary }}>
                    <Dot color={item.color} />
                    {item.name}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: BRAND_COLORS.secondary }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        <StatCard
          icon={<StarFilled />}
          label="Öne Çıkan Ürün Oranı"
          value={`%${featuredPercent}`}
          sub={`${data.featuredCount} ürün öne çıkarıldı`}
          iconColor={BRAND_COLORS.secondary}
          iconBg="rgba(215, 254, 71, 0.35)"
        />
        <StatCard
          icon={<ClockCircleOutlined />}
          label="Son 30 Günde Eklenen"
          value={data.recentlyAddedCount.toLocaleString("tr-TR")}
          sub="Yeni eklenen ürün sayısı"
          iconColor="#1677FF"
          iconBg="rgba(22, 119, 255, 0.1)"
        />
      </div>
    </div>
  );
};

export default Statistics;

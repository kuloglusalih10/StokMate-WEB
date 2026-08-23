import {
  ShoppingOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { ProductStats } from "../../../services/products";
import { BRAND_COLORS } from "../../../constants/colors";
import { StatsCardsSkeleton } from "../loading";

type StatsCardsProps = {
  stats: ProductStats | null;
  loading: boolean;
};

type CardConfig = {
  key: string;
  label: string;
  value: (stats: ProductStats) => string;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
};

const formatCurrency = (kurus: number) =>
  (kurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });

const CARDS: CardConfig[] = [
  {
    key: "total",
    label: "Toplam Ürün",
    value: (stats) => stats.total.toLocaleString("tr-TR"),
    icon: <ShoppingOutlined />,
    iconColor: BRAND_COLORS.secondary,
    iconBg: "rgba(215, 254, 71, 0.35)",
  },
  {
    key: "lowStock",
    label: "Kritik Stok",
    value: (stats) => stats.lowStock.toLocaleString("tr-TR"),
    icon: <WarningOutlined />,
    iconColor: BRAND_COLORS.accent,
    iconBg: "rgba(255, 90, 31, 0.12)",
  },
  {
    key: "outOfStock",
    label: "Stokta Yok",
    value: (stats) => stats.outOfStock.toLocaleString("tr-TR"),
    icon: <CloseCircleOutlined />,
    iconColor: "#F5222D",
    iconBg: "rgba(245, 34, 45, 0.1)",
  },
  {
    key: "totalInventoryValue",
    label: "Toplam Stok Değeri",
    value: (stats) => formatCurrency(stats.totalInventoryValue),
    icon: <WalletOutlined />,
    iconColor: BRAND_COLORS.secondary,
    iconBg: "rgba(14, 15, 12, 0.06)",
  },
];

const StatsCards = ({ stats, loading }: StatsCardsProps) => {
  if (loading || !stats) {
    return <StatsCardsSkeleton />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 28,
      }}
    >
      {CARDS.map((card) => (
        <div
          key={card.key}
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
            <div style={{ fontSize: 14, fontWeight: 600, color: "#8C8C8C", marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: BRAND_COLORS.secondary, lineHeight: 1.1 }}>
              {card.value(stats)}
            </div>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: card.iconBg,
              color: card.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flex: "0 0 auto",
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

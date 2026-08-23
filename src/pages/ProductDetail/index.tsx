import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Tag, Image, Empty, Space } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  StarFilled,
  NumberOutlined,
  BarcodeOutlined,
  ShopOutlined,
  TruckOutlined,
  AppstoreOutlined,
  DollarCircleOutlined,
  WalletOutlined,
  RiseOutlined,
  InboxOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { getProductById, deleteProduct, type ProductDetail } from "../../services/products";
import { BRAND_COLORS } from "../../constants/colors";
import ProductDetailLoading from "./loading";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditProductDialog from "./EditProductDialog";

const STATUS_META: Record<number, { text: string; color: string; icon: ReactNode }> = {
  1: { text: "Aktif", color: "success", icon: <CheckCircleOutlined /> },
  2: { text: "Pasif", color: "default", icon: <CloseCircleOutlined /> },
  3: { text: "Üretim Durduruldu", color: "error", icon: <ExclamationCircleOutlined /> },
};

const UNIT_LABELS: Record<number, string> = {
  1: "Adet",
  2: "Kg",
  3: "Lt",
  4: "Paket",
};

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const formatPrice = (kurus: number) =>
  (kurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const MetaRow = ({
  icon,
  label,
  value,
  last,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 0",
      borderBottom: last ? "none" : "1px solid #F5F5F5",
    }}
  >
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: "rgba(14, 15, 12, 0.05)",
        color: BRAND_COLORS.secondary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 17,
        flex: "0 0 auto",
      }}
    >
      {icon}
    </span>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 12.5, color: "#ADADAD", lineHeight: 1.4 }}>{label}</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: BRAND_COLORS.secondary,
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
}) => (
  <div
    style={{
      ...cardStyle,
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    }}
  >
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#8C8C8C", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: BRAND_COLORS.secondary, lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "#ADADAD", marginTop: 4 }}>{sub}</div>}
    </div>
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: iconBg,
        color: iconColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        flex: "0 0 auto",
      }}
    >
      {icon}
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);

      const result = await getProductById(Number(id));

      setLoading(false);

      if (!result.res) {
        if (result.status === 404) {
          setNotFound(true);
        } else {
          toast.error(result.message);
        }
        return;
      }

      setProduct(result.data);
    };

    load();
  }, [id]);

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
      <div>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/urunler")}
          style={{ marginBottom: 20, fontSize: 14, fontWeight: 600 }}
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
  const isLowStock = product.stock > 0 && product.stock <= product.minStock;
  const isOutOfStock = product.stock === 0;
  const stockColor = isOutOfStock ? "#F5222D" : isLowStock ? BRAND_COLORS.accent : BRAND_COLORS.secondary;
  const stockBg = isOutOfStock
    ? "rgba(245, 34, 45, 0.1)"
    : isLowStock
    ? "rgba(255, 90, 31, 0.12)"
    : "rgba(14, 15, 12, 0.05)";

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/urunler")}
          style={{ fontSize: 14, fontWeight: 600 }}
        >
          Ürünlere dön
        </Button>
        <Space size={12}>
          <Button size="large" icon={<EditOutlined />} onClick={() => setEditDialogOpen(true)}>
            Düzenle
          </Button>
          <Button
            size="large"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Sil
          </Button>
        </Space>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 24, marginBottom: 20 }}>
        <div
          style={{
            ...cardStyle,
            flex: "0 1 320px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            width="100%"
            style={{
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: 16,
              border: `3px solid ${product.categoryColor ? `${product.categoryColor}33` : "#F0F0F0"}`,
            }}
          />
          <div style={{ marginTop: 24 }}>
            <MetaRow icon={<NumberOutlined />} label="SKU" value={product.sku} />
            <MetaRow icon={<BarcodeOutlined />} label="Barkod" value={product.barcode || "—"} />
            <MetaRow icon={<ShopOutlined />} label="Marka" value={product.brandName} />
            <MetaRow icon={<TruckOutlined />} label="Tedarikçi" value={product.supplierName} />
            <MetaRow icon={<AppstoreOutlined />} label="Birim" value={unitLabel} last />
          </div>
        </div>

        <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <Tag
                icon={<TagsOutlined />}
                color={product.categoryColor || undefined}
                style={{ borderRadius: 999, padding: "4px 12px", fontSize: 13 }}
              >
                {product.categoryName}
              </Tag>
              {statusMeta && (
                <Tag
                  icon={statusMeta.icon}
                  color={statusMeta.color}
                  style={{ borderRadius: 999, padding: "4px 12px", fontSize: 13 }}
                >
                  {statusMeta.text}
                </Tag>
              )}
              {product.isFeatured && (
                <Tag
                  icon={<StarFilled />}
                  style={{
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 13,
                    background: BRAND_COLORS.primary,
                    color: BRAND_COLORS.secondary,
                    border: "none",
                  }}
                >
                  Öne Çıkan
                </Tag>
              )}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
                color: BRAND_COLORS.secondary,
                letterSpacing: "-0.02em",
              }}
            >
              {product.name}
            </h1>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard
              icon={<DollarCircleOutlined />}
              label="Satış Fiyatı"
              value={formatPrice(product.price)}
              iconColor={BRAND_COLORS.secondary}
              iconBg="rgba(215, 254, 71, 0.35)"
            />
            <StatCard
              icon={<WalletOutlined />}
              label="Maliyet"
              value={formatPrice(product.costPrice)}
              iconColor={BRAND_COLORS.secondary}
              iconBg="rgba(14, 15, 12, 0.06)"
            />
            <StatCard
              icon={<RiseOutlined />}
              label="Kâr Marjı"
              value={`%${marginPercent}`}
              sub={formatPrice(margin)}
              iconColor={BRAND_COLORS.accent}
              iconBg="rgba(255, 90, 31, 0.12)"
            />
            <StatCard
              icon={<InboxOutlined />}
              label="Stok"
              value={String(product.stock)}
              sub={`Kritik eşik: ${product.minStock}`}
              iconColor={stockColor}
              iconBg={stockBg}
            />
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(14, 15, 12, 0.05)",
                  color: BRAND_COLORS.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                <FileTextOutlined />
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>Açıklama</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "#5C5C5C" }}>
              {product.description || "Bu ürün için açıklama girilmemiş."}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                fontSize: 13,
                color: "#ADADAD",
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid #F5F5F5",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined /> Oluşturulma: {formatDate(product.createdAt)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined /> Son güncelleme: {formatDate(product.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

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
        }}
      />
    </div>
  );
};

export default ProductDetailPage;

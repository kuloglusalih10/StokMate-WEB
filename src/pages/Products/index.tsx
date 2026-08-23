import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Table, Input, Select, Tag, Avatar, Button, ConfigProvider } from "antd";
import type { TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getProducts,
  getProductStatsBreakdown,
  type Product,
  type ProductStatsBreakdown,
  type ProductListParams,
} from "../../services/products";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { toast } from "react-toastify";
import { ProductsTableSkeleton } from "./loading";
import NewProductDialog from "./NewProductDialog";

const { Search } = Input;

type SortKey = NonNullable<ProductListParams["sort"]>;
type ChipKey = "all" | "low" | "out" | "featured" | "pasif";

const COLORS = {
  ink: "#0E1116",
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
  pasif: "#9AA0A6",
};

const SANS = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace";

const STATUS_META: Record<number, { text: string; bg: string; fg: string }> = {
  1: { text: "Aktif", bg: COLORS.tealSoft, fg: COLORS.tealDark },
  2: { text: "Pasif", bg: "rgba(14,17,22,0.06)", fg: COLORS.muted },
  3: { text: "Üretimi durduruldu", bg: "rgba(198,63,38,0.12)", fg: COLORS.rust },
};

const SORT_KEY_MAP: Record<string, SortKey> = {
  name: "name",
  price: "price",
  stock: "stock",
  categoryName: "category",
  brandName: "brand",
  status: "status",
};

const CHIPS: { key: ChipKey; label: string; dot?: string; count: (stats: ProductStatsBreakdown) => number }[] = [
  { key: "all", label: "Tüm ürünler", count: (stats) => stats.totalProducts },
  { key: "low", label: "Kritik stok", dot: COLORS.amber, count: (stats) => stats.lowStockCount },
  { key: "out", label: "Stokta yok", dot: COLORS.rust, count: (stats) => stats.outOfStockCount },
  { key: "featured", label: "Öne çıkan", dot: COLORS.lime, count: (stats) => stats.featuredCount },
  {
    key: "pasif",
    label: "Pasif",
    dot: COLORS.pasif,
    count: (stats) => stats.byStatus.find((item) => item.status === 2)?.count ?? 0,
  },
];

const formatPrice = (kurus: number) =>
  (kurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

const formatMoney = (kurus: number) => "₺" + Math.round(kurus / 100).toLocaleString("tr-TR");

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
};

const dividerStyle = {
  width: 1,
  alignSelf: "stretch" as const,
  background: COLORS.lineSoft,
  flex: "0 0 auto",
};

const featuredBadgeStyle = {
  fontFamily: MONO,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  padding: "3px 8px",
  borderRadius: 999,
  background: COLORS.lime,
  color: COLORS.ink,
  flex: "0 0 auto",
};

const CategoryDot = ({ color }: { color: string }) => (
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

const Products = () => {
  const navigate = useNavigate();
  const [pageParent] = useAutoAnimate({ duration: 350 });
  const [chipsParent] = useAutoAnimate({ duration: 250 });
  const [tableParent] = useAutoAnimate({ duration: 300 });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<ProductStatsBreakdown | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [brandId, setBrandId] = useState<number | undefined>(undefined);
  const [activeChip, setActiveChip] = useState<ChipKey>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<SortKey | undefined>(undefined);
  const [sortDir, setSortDir] = useState<ProductListParams["dir"]>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);

  const getSortOrder = (key: SortKey): "ascend" | "descend" | null => {
    if (sortField !== key) return null;
    if (sortDir === "asc") return "ascend";
    if (sortDir === "desc") return "descend";
    return null;
  };

  useEffect(() => {
    const loadFilters = async () => {
      const [categoriesResult, brandsResult] = await Promise.all([
        getCategories(),
        getBrands(),
      ]);

      if (categoriesResult.res) {
        setCategories(categoriesResult.data);
      }

      if (brandsResult.res) {
        setBrands(brandsResult.data);
      }
    };

    const loadStats = async () => {
      const result = await getProductStatsBreakdown();

      if (result.res) {
        setStats(result.data);
      }
    };

    loadFilters();
    loadStats();
  }, [refreshKey]);

  useEffect(() => {
    const chipParams: Pick<ProductListParams, "stockStatus" | "featured" | "status"> =
      activeChip === "low"
        ? { stockStatus: "low" }
        : activeChip === "out"
        ? { stockStatus: "out" }
        : activeChip === "featured"
        ? { featured: true }
        : activeChip === "pasif"
        ? { status: 2 }
        : {};

    const loadProducts = async () => {
      setLoading(true);
      const result = await getProducts({
        q: search || undefined,
        categoryId,
        brandId,
        page,
        pageSize,
        sort: sortField,
        dir: sortDir,
        ...chipParams,
      });
      setLoading(false);
      setHasLoadedOnce(true);

      if (!result.res) {
        toast.error(result.message);
        return;
      }

      setProducts(result.data.items);
      setTotal(result.data.total);
    };

    loadProducts();
  }, [search, categoryId, brandId, activeChip, page, pageSize, sortField, sortDir, refreshKey]);

  const handleChipClick = (key: ChipKey) => {
    setActiveChip(key);
    setPage(1);
  };

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Ürün",
      dataIndex: "name",
      key: "name",
      width: 320,
      sorter: true,
      sortOrder: getSortOrder("name"),
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar src={record.imageUrl} shape="square" size={52} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: COLORS.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {record.name}
              </span>
              {record.isFeatured && <span style={featuredBadgeStyle}>Öne çıkan</span>}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>{record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 160,
      sorter: true,
      sortOrder: getSortOrder("category"),
      render: (categoryName: string, record) => (
        <Tag
          color={record.categoryColor || undefined}
          style={{ fontSize: 14, padding: "4px 12px", borderRadius: 999 }}
        >
          {categoryName}
        </Tag>
      ),
    },
    {
      title: "Marka",
      dataIndex: "brandName",
      key: "brandName",
      width: 140,
      sorter: true,
      sortOrder: getSortOrder("brand"),
      render: (brandName: string) => <span style={{ fontSize: 15 }}>{brandName}</span>,
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      width: 130,
      sorter: true,
      sortOrder: getSortOrder("price"),
      render: (price: number) => (
        <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{formatPrice(price)}</span>
      ),
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
      width: 110,
      sorter: true,
      sortOrder: getSortOrder("stock"),
      render: (stock: number, record) => (
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: stock === 0 ? COLORS.rust : stock <= record.minStock ? COLORS.amber : COLORS.text,
          }}
        >
          {stock}
        </span>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 170,
      sorter: true,
      sortOrder: getSortOrder("status"),
      render: (status: number) => {
        const meta = STATUS_META[status];
        return (
          <Tag style={{ fontSize: 13, fontWeight: 600, padding: "4px 12px", background: meta?.bg, color: meta?.fg, border: "none" }}>
            {meta?.text ?? status}
          </Tag>
        );
      },
    },
  ];

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
          <p style={eyebrowStyle}>Katalog · Depo 01</p>
          <h1 style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, letterSpacing: "-0.035em", margin: "6px 0 0", lineHeight: 1, color: COLORS.ink }}>
            Ürünler
          </h1>
        </div>
        <Button
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setNewProductDialogOpen(true)}
          style={{ background: COLORS.teal, borderColor: COLORS.teal, color: "#FFFFFF" }}
        >
          Yeni ürün ekle
        </Button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Input: { activeBorderColor: "transparent", activeShadow: "none" },
            Select: { activeBorderColor: "transparent", activeOutlineColor: "transparent" },
          },
        }}
      >
        <div style={{ ...cardStyle, padding: "6px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <Search
            placeholder="Ürün adı, SKU veya barkod ara"
            allowClear
            size="large"
            variant="borderless"
            onSearch={(value) => {
              setPage(1);
              setSearch(value);
            }}
            style={{ flex: "1 1 260px", minWidth: 200 }}
          />
          <span style={dividerStyle} />
          <Select
            placeholder="Tüm kategoriler"
            allowClear
            size="large"
            variant="borderless"
            value={categoryId}
            onChange={(value) => {
              setPage(1);
              setCategoryId(value);
            }}
            options={categories.map((category) => ({
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <CategoryDot color={category.color} />
                  {category.name}
                </span>
              ),
              value: category.id,
            }))}
            style={{ minWidth: 170 }}
          />
          <span style={dividerStyle} />
          <Select
            placeholder="Tüm markalar"
            allowClear
            size="large"
            variant="borderless"
            value={brandId}
            onChange={(value) => {
              setPage(1);
              setBrandId(value);
            }}
            options={brands.map((brand) => ({ label: brand.name, value: brand.id }))}
            style={{ minWidth: 160 }}
          />
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={dividerStyle} />
            <div style={{ textAlign: "right", padding: "4px 10px 4px 0" }}>
              <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1, color: COLORS.text }}>
                {stats ? formatMoney(stats.totalInventoryValue) : "—"}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Toplam stok değeri</div>
            </div>
          </div>
        </div>
      </ConfigProvider>

      <div ref={chipsParent} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {CHIPS.map((chip) => {
          const active = activeChip === chip.key;
          const count = stats ? chip.count(stats) : null;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => handleChipClick(chip.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: active ? `1px solid ${COLORS.ink}` : `1px solid ${COLORS.line}`,
                background: active ? COLORS.ink : COLORS.card,
                color: active ? "#F2F3EE" : COLORS.text,
                borderRadius: 999,
                padding: "9px 16px",
                cursor: "pointer",
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {chip.dot && (
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: chip.dot, flex: "0 0 auto" }} />
              )}
              {chip.label}
              <b style={{ fontFamily: MONO, fontWeight: 500, fontSize: 12.5, opacity: active ? 0.85 : 0.6 }}>
                {count ?? "—"}
              </b>
            </button>
          );
        })}
      </div>

      <div ref={tableParent} style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        {!hasLoadedOnce ? (
          <ProductsTableSkeleton />
        ) : (
          <Table<Product>
            rowKey="id"
            columns={columns}
            dataSource={products}
            loading={loading}
            tableLayout="fixed"
            showSorterTooltip={false}
            scroll={{ x: 1030 }}
            style={{ fontSize: 15 }}
            onRow={(record) => ({
              onClick: () => navigate(`/urunler/${record.id}`),
              style: { cursor: "pointer" },
            })}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
            }}
            onChange={(paginationConfig, _filters, sorter) => {
              const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
              const order = activeSorter?.order;
              const field = activeSorter?.field as string | undefined;
              const mappedField = field ? SORT_KEY_MAP[field] : undefined;

              const nextSortField = order ? mappedField : undefined;
              const nextSortDir = order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined;
              const sortChanged = nextSortField !== sortField || nextSortDir !== sortDir;

              setSortField(nextSortField);
              setSortDir(nextSortDir);

              if (sortChanged) {
                setPage(1);
              } else if (paginationConfig.current) {
                setPage(paginationConfig.current);
              }

              if (paginationConfig.pageSize) {
                setPageSize(paginationConfig.pageSize);
              }
            }}
          />
        )}
      </div>

      <NewProductDialog
        open={newProductDialogOpen}
        onClose={() => setNewProductDialogOpen(false)}
        onCreated={() => {
          setNewProductDialogOpen(false);
          setPage(1);
          setRefreshKey((key) => key + 1);
        }}
      />
    </div>
  );
};

export default Products;

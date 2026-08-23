import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Select, Tag, Avatar, Button } from "antd";
import type { TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getProducts,
  getProductStats,
  type Product,
  type ProductStats,
  type ProductListParams,
} from "../../services/products";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { toast } from "react-toastify";
import { BRAND_COLORS } from "../../constants/colors";
import StatsCards from "./components/StatsCards";
import { ProductsTableSkeleton } from "./loading";
import NewProductDialog from "./NewProductDialog";

const { Search } = Input;

type SortKey = NonNullable<ProductListParams["sort"]>;

const STATUS_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: "Aktif", color: "success" },
  2: { text: "Pasif", color: "default" },
  3: { text: "Üretim Durduruldu", color: "error" },
};

const SORT_KEY_MAP: Record<string, SortKey> = {
  name: "name",
  price: "price",
  stock: "stock",
  categoryName: "category",
  brandName: "brand",
  status: "status",
};

const formatPrice = (kurus: number) =>
  (kurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [brandId, setBrandId] = useState<number | undefined>(undefined);
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
      setStatsLoading(true);
      const result = await getProductStats();
      setStatsLoading(false);

      if (result.res) {
        setStats(result.data);
      }
    };

    loadFilters();
    loadStats();
  }, [refreshKey]);

  useEffect(() => {
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
  }, [search, categoryId, brandId, page, pageSize, sortField, sortDir, refreshKey]);

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Ürün",
      dataIndex: "name",
      key: "name",
      width: 300,
      sorter: true,
      sortOrder: getSortOrder("name"),
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar src={record.imageUrl} shape="square" size={52} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: BRAND_COLORS.secondary }}>
              {record.name}
            </div>
            <div style={{ fontSize: 14, color: "#8C8C8C" }}>{record.sku}</div>
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
        <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>
          {formatPrice(price)}
        </span>
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
            color: stock <= record.minStock ? BRAND_COLORS.accent : BRAND_COLORS.secondary,
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
        const meta = STATUS_LABELS[status];
        return (
          <Tag color={meta?.color} style={{ fontSize: 14, padding: "4px 12px" }}>
            {meta?.text ?? status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: BRAND_COLORS.secondary }}>
          Ürünler
        </h2>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setNewProductDialogOpen(true)}
        >
          Yeni Ürün Ekle
        </Button>
      </div>
      <StatsCards stats={stats} loading={statsLoading} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Search
          placeholder="Ürün, SKU veya barkod ara"
          allowClear
          size="large"
          onSearch={(value) => {
            setPage(1);
            setSearch(value);
          }}
          style={{ maxWidth: 360, flex: "1 1 260px", fontSize: 15 }}
        />
        <Select
          placeholder="Kategori"
          allowClear
          size="large"
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
          style={{ minWidth: 200, fontSize: 15 }}
        />
        <Select
          placeholder="Marka"
          allowClear
          size="large"
          value={brandId}
          onChange={(value) => {
            setPage(1);
            setBrandId(value);
          }}
          options={brands.map((brand) => ({ label: brand.name, value: brand.id }))}
          style={{ minWidth: 200, fontSize: 15 }}
        />
      </div>
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
          scroll={{ x: 1010 }}
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

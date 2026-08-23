import { useEffect, useState, type ReactNode } from "react";
import { Tabs, Button, Empty, ConfigProvider } from "antd";
import type { TabsProps } from "antd";
import { PlusOutlined, EditOutlined, ShopOutlined, TruckOutlined } from "@ant-design/icons";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { getSuppliers, type Supplier } from "../../services/suppliers";
import { BRAND_COLORS } from "../../constants/colors";
import SettingsLoading from "./loading";
import CategoryFormModal from "./CategoryFormModal";
import BrandFormModal from "./BrandFormModal";
import SupplierFormModal from "./SupplierFormModal";

const cardStyle = {
  background: BRAND_COLORS.white,
  border: "1px solid #F0F0F0",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 4px 20px rgba(14, 15, 12, 0.05)",
};

const IconBadge = ({ icon }: { icon: ReactNode }) => (
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
);

const CategoryIcon = ({ color }: { color: string }) => (
  <span
    style={{
      width: 40,
      height: 40,
      borderRadius: 12,
      background: color ? `${color}22` : "rgba(14, 15, 12, 0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
    }}
  >
    <span style={{ width: 14, height: 14, borderRadius: "50%", background: color || "#D9D9D9" }} />
  </span>
);

const Row = ({
  icon,
  title,
  subtitle,
  onEdit,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onEdit: () => void;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 4px",
      borderBottom: "1px solid #F5F5F5",
      gap: 12,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
      {icon}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: BRAND_COLORS.secondary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 13, color: "#8C8C8C", marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
    <Button size="middle" icon={<EditOutlined />} onClick={onEdit} style={{ flex: "0 0 auto" }}>
      Düzenle
    </Button>
  </div>
);

const ListHeader = ({ count, label, onAdd }: { count: number; label: string; onAdd: () => void }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
    <div style={{ fontSize: 14, color: "#8C8C8C" }}>
      {count} {label}
    </div>
    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
      Yeni Ekle
    </Button>
  </div>
);

const Settings = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const [categoriesResult, brandsResult, suppliersResult] = await Promise.all([
        getCategories(),
        getBrands(),
        getSuppliers(),
      ]);
      setLoading(false);

      if (categoriesResult.res) setCategories(categoriesResult.data);
      if (brandsResult.res) setBrands(brandsResult.data);
      if (suppliersResult.res) setSuppliers(suppliersResult.data);
    };

    loadAll();
  }, []);

  if (loading) {
    return <SettingsLoading />;
  }

  const items: TabsProps["items"] = [
    {
      key: "categories",
      label: "Kategoriler",
      children: (
        <div style={cardStyle}>
          <ListHeader
            count={categories.length}
            label="kategori"
            onAdd={() => {
              setEditingCategory(null);
              setCategoryModalOpen(true);
            }}
          />
          {categories.length === 0 ? (
            <Empty description="Henüz kategori yok" />
          ) : (
            categories.map((category) => (
              <Row
                key={category.id}
                icon={<CategoryIcon color={category.color} />}
                title={category.name}
                subtitle={category.slug}
                onEdit={() => {
                  setEditingCategory(category);
                  setCategoryModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      ),
    },
    {
      key: "brands",
      label: "Markalar",
      children: (
        <div style={cardStyle}>
          <ListHeader
            count={brands.length}
            label="marka"
            onAdd={() => {
              setEditingBrand(null);
              setBrandModalOpen(true);
            }}
          />
          {brands.length === 0 ? (
            <Empty description="Henüz marka yok" />
          ) : (
            brands.map((brand) => (
              <Row
                key={brand.id}
                icon={<IconBadge icon={<ShopOutlined />} />}
                title={brand.name}
                onEdit={() => {
                  setEditingBrand(brand);
                  setBrandModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      ),
    },
    {
      key: "suppliers",
      label: "Tedarikçiler",
      children: (
        <div style={cardStyle}>
          <ListHeader
            count={suppliers.length}
            label="tedarikçi"
            onAdd={() => {
              setEditingSupplier(null);
              setSupplierModalOpen(true);
            }}
          />
          {suppliers.length === 0 ? (
            <Empty description="Henüz tedarikçi yok" />
          ) : (
            suppliers.map((supplier) => (
              <Row
                key={supplier.id}
                icon={<IconBadge icon={<TruckOutlined />} />}
                title={supplier.name}
                subtitle={[supplier.contactName, supplier.city].filter(Boolean).join(" · ") || undefined}
                onEdit={() => {
                  setEditingSupplier(supplier);
                  setSupplierModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 800, color: BRAND_COLORS.secondary }}>
        Ayarlar
      </h2>

      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              inkBarColor: BRAND_COLORS.secondary,
              itemSelectedColor: "#3A3A3A",
            },
          },
        }}
      >
        <Tabs defaultActiveKey="categories" items={items} size="large" />
      </ConfigProvider>

      <CategoryFormModal
        open={categoryModalOpen}
        category={editingCategory}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={(category) => {
          setCategoryModalOpen(false);
          setCategories((prev) =>
            prev.some((c) => c.id === category.id)
              ? prev.map((c) => (c.id === category.id ? category : c))
              : [...prev, category]
          );
        }}
      />

      <BrandFormModal
        open={brandModalOpen}
        brand={editingBrand}
        onClose={() => setBrandModalOpen(false)}
        onSaved={(brand) => {
          setBrandModalOpen(false);
          setBrands((prev) =>
            prev.some((b) => b.id === brand.id) ? prev.map((b) => (b.id === brand.id ? brand : b)) : [...prev, brand]
          );
        }}
      />

      <SupplierFormModal
        open={supplierModalOpen}
        supplier={editingSupplier}
        onClose={() => setSupplierModalOpen(false)}
        onSaved={(supplier) => {
          setSupplierModalOpen(false);
          setSuppliers((prev) =>
            prev.some((s) => s.id === supplier.id)
              ? prev.map((s) => (s.id === supplier.id ? supplier : s))
              : [...prev, supplier]
          );
        }}
      />
    </div>
  );
};

export default Settings;

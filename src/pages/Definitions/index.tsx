import { useEffect, useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input, Tooltip, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { getSuppliers, type Supplier } from "../../services/suppliers";
import DefinitionsLoading from "./loading";
import CategoryFormModal from "./CategoryFormModal";
import BrandFormModal from "./BrandFormModal";
import SupplierFormModal from "./SupplierFormModal";

type TabKey = "categories" | "brands" | "suppliers";

const COLORS = {
  ink: "#0E1116",
  canvas: "#E9EAE4",
  card: "#FFFFFF",
  line: "rgba(14,17,22,0.10)",
  lineSoft: "rgba(14,17,22,0.06)",
  text: "#0E1116",
  muted: "#6C7178",
  teal: "#10635C",
  teal2: "#3E8C82",
};

const SANS = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace";

const eyebrowStyle = {
  fontFamily: MONO,
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: COLORS.muted,
};

const panelStyle = {
  background: COLORS.card,
  border: `1px solid ${COLORS.lineSoft}`,
  borderRadius: 14,
  overflow: "hidden" as const,
};

const boldMono = { fontFamily: MONO, fontWeight: 500, color: COLORS.text };

const ghostBtnStyle = {
  border: `1px solid ${COLORS.line}`,
  background: COLORS.card,
  color: COLORS.text,
  borderRadius: 8,
  padding: "6px 11px",
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer" as const,
};

const quietBtnStyle = {
  border: "1px solid transparent",
  background: "transparent",
  color: "rgba(14,17,22,0.28)",
  borderRadius: 8,
  padding: "6px 11px",
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 500,
  cursor: "not-allowed" as const,
};

const formatTl = (kurus: number) => "₺" + Math.round(kurus / 100).toLocaleString("tr-TR");

const initials = (name: string) =>
  name
    .replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g, "")
    .slice(0, 2)
    .toLocaleUpperCase("tr-TR");

const norm = (value: string) => value.toLocaleLowerCase("tr-TR");

const TAB_META: Record<TabKey, { title: string; subtitle: string; addLabel: string; placeholder: string }> = {
  categories: {
    title: "Kategoriler",
    subtitle: "Renk, ürün listelerinde ve grafiklerde kullanılır",
    addLabel: "Yeni kategori",
    placeholder: "Kategorilerde ara",
  },
  brands: {
    title: "Markalar",
    subtitle: "Ürün kartlarında seçilebilen marka listesi",
    addLabel: "Yeni marka",
    placeholder: "Markalarda ara",
  },
  suppliers: {
    title: "Tedarikçiler",
    subtitle: "Sipariş ve maliyet takibinin bağlı olduğu firmalar",
    addLabel: "Yeni tedarikçi",
    placeholder: "Tedarikçilerde ara",
  },
};

const EmptyState = () => (
  <div style={{ padding: "44px 20px", textAlign: "center", color: COLORS.muted, fontSize: 13 }}>
    <b style={{ display: "block", color: COLORS.text, fontSize: 15, marginBottom: 6 }}>Eşleşen kayıt yok</b>
    Farklı bir arama dene ya da yeni bir tanım ekle.
  </div>
);

const Definitions = () => {
  const [pageParent] = useAutoAnimate({ duration: 350 });
  const [tabsParent] = useAutoAnimate({ duration: 250 });
  const [listParent] = useAutoAnimate({ duration: 300 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("categories");
  const [search, setSearch] = useState("");

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

  const query = norm(search.trim());

  const filteredCategories = useMemo(
    () => categories.filter((c) => norm(c.name).includes(query) || c.slug.includes(query)),
    [categories, query]
  );
  const filteredBrands = useMemo(() => brands.filter((b) => norm(b.name).includes(query)), [brands, query]);
  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter(
        (s) => norm(s.name).includes(query) || norm(s.contactName).includes(query) || norm(s.city).includes(query)
      ),
    [suppliers, query]
  );

  if (loading) {
    return <DefinitionsLoading />;
  }

  const categoryValues = categories.map((c) => c.stockValueKurus);
  const maxCategoryValue = Math.max(1, ...categoryValues, 0);
  const totalCategoryProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
  const totalCategoryValue = categories.reduce((sum, c) => sum + c.stockValueKurus, 0);
  const avgProductsPerCategory = categories.length ? Math.round(totalCategoryProducts / categories.length) : 0;

  const brandCounts = brands.map((b) => b.productCount);
  const peakBrandCount = brandCounts.length ? Math.max(...brandCounts) : 0;
  const maxBrandCount = Math.max(1, peakBrandCount);
  const topBrands = brands.filter((b) => peakBrandCount > 0 && b.productCount === peakBrandCount);
  const topBrandNames = topBrands.length ? topBrands.map((b) => b.name).join(" ve ") : "—";
  const totalBrandProducts = brands.reduce((sum, b) => sum + b.productCount, 0);

  const citySet = new Set(suppliers.map((s) => s.city.trim()).filter(Boolean));
  const totalSupplierValue = suppliers.reduce((sum, s) => sum + s.stockValueKurus, 0);

  const meta = TAB_META[tab];

  const handleAddClick = () => {
    if (tab === "categories") {
      setEditingCategory(null);
      setCategoryModalOpen(true);
    } else if (tab === "brands") {
      setEditingBrand(null);
      setBrandModalOpen(true);
    } else {
      setEditingSupplier(null);
      setSupplierModalOpen(true);
    }
  };

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
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 22, flexWrap: "wrap" }}>
        <div>
          <p style={eyebrowStyle}>Katalog altyapısı</p>
          <h1 style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, letterSpacing: "-0.035em", margin: "6px 0 6px", lineHeight: 1, color: COLORS.ink }}>
            Tanımlar
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.muted, maxWidth: "56ch" }}>
            Ürün kartlarında seçilen kategori, marka ve tedarikçi listeleri. Buradaki bir kaydı değiştirmek, o kaydı kullanan tüm ürünleri etkiler.
          </p>
        </div>
        <Button size="large" onClick={handleAddClick} style={{ background: COLORS.teal, borderColor: COLORS.teal, color: "#FFFFFF" }}>
          {meta.addLabel}
        </Button>
      </div>

      <div ref={tabsParent} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {(
          [
            { key: "categories" as const, label: "Kategoriler", count: categories.length },
            { key: "brands" as const, label: "Markalar", count: brands.length },
            { key: "suppliers" as const, label: "Tedarikçiler", count: suppliers.length },
          ]
        ).map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setTab(item.key);
                setSearch("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                border: active ? `1px solid ${COLORS.ink}` : `1px solid ${COLORS.line}`,
                background: active ? COLORS.ink : COLORS.card,
                color: active ? "#F2F3EE" : COLORS.text,
                borderRadius: 999,
                padding: "9px 16px",
                cursor: "pointer",
                fontFamily: SANS,
                fontSize: 13.5,
              }}
            >
              {item.label}
              <b style={{ fontFamily: MONO, fontWeight: 500, fontSize: 12, color: active ? "rgba(242,243,238,0.6)" : COLORS.muted }}>
                {item.count}
              </b>
            </button>
          );
        })}
      </div>

      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${COLORS.line}`, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: COLORS.text }}>{meta.title}</h2>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.muted }}>{meta.subtitle}</p>
          </div>
          <Input
            prefix={<SearchOutlined style={{ color: COLORS.muted, fontSize: 13 }} />}
            placeholder={meta.placeholder}
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ marginLeft: "auto", minWidth: 230, borderRadius: 10, borderColor: COLORS.line, background: "#FCFCFB" }}
          />
        </div>

        <div
          ref={listParent}
          style={tab === "suppliers" ? { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, padding: "18px 20px" } : undefined}
        >
          {tab === "categories" &&
            (filteredCategories.length === 0 ? (
              <EmptyState />
            ) : (
              filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 118px 190px 168px",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 20px",
                    borderBottom: index === filteredCategories.length - 1 ? "none" : `1px solid ${COLORS.lineSoft}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 9, flex: "0 0 34px", display: "flex", alignItems: "center", justifyContent: "center", background: `${category.color}1F` }}>
                      <span style={{ width: 12, height: 12, borderRadius: 4, display: "block", background: category.color }} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{category.name}</span>
                      <span style={{ display: "block", fontFamily: MONO, fontSize: 11, color: COLORS.muted, letterSpacing: "0.02em" }}>{category.slug}</span>
                    </span>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 13 }}>
                    {category.productCount}
                    <small style={{ color: COLORS.muted, fontSize: 11, marginLeft: 5 }}>ürün</small>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(14,17,22,0.07)", overflow: "hidden" }}>
                      <span style={{ display: "block", height: "100%", borderRadius: 3, width: `${(category.stockValueKurus / maxCategoryValue) * 100}%`, background: category.color }} />
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: "#3A3F45", minWidth: 74, textAlign: "right" }}>{formatTl(category.stockValueKurus)}</span>
                  </span>
                  <span style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      style={ghostBtnStyle}
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryModalOpen(true);
                      }}
                    >
                      Düzenle
                    </button>
                    <Tooltip title="Önce ürünleri başka kategoriye taşı">
                      <button type="button" style={quietBtnStyle} disabled>
                        Sil
                      </button>
                    </Tooltip>
                  </span>
                </div>
              ))
            ))}

          {tab === "brands" &&
            (filteredBrands.length === 0 ? (
              <EmptyState />
            ) : (
              filteredBrands.map((brand, index) => (
                <div
                  key={brand.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 260px 168px",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 20px",
                    borderBottom: index === filteredBrands.length - 1 ? "none" : `1px solid ${COLORS.lineSoft}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 9, flex: "0 0 34px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 11, color: "#fff", background: COLORS.ink }}>
                      {initials(brand.name)}
                    </span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{brand.name}</span>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(14,17,22,0.07)", overflow: "hidden" }}>
                      <span style={{ display: "block", height: "100%", borderRadius: 3, width: `${(brand.productCount / maxBrandCount) * 100}%`, background: COLORS.teal2 }} />
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: "#3A3F45", minWidth: 74, textAlign: "right" }}>{brand.productCount} ürün</span>
                  </span>
                  <span style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      style={ghostBtnStyle}
                      onClick={() => {
                        setEditingBrand(brand);
                        setBrandModalOpen(true);
                      }}
                    >
                      Düzenle
                    </button>
                    <Tooltip title="Önce ürünleri başka markaya taşı">
                      <button type="button" style={quietBtnStyle} disabled>
                        Sil
                      </button>
                    </Tooltip>
                  </span>
                </div>
              ))
            ))}

          {tab === "suppliers" &&
            (filteredSuppliers.length === 0 ? (
              <EmptyState />
            ) : (
              filteredSuppliers.map((supplier) => (
                <div key={supplier.id} style={{ border: `1px solid ${COLORS.lineSoft}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#FCFCFB" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{supplier.name}</span>
                      {supplier.city && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.muted, border: `1px solid ${COLORS.line}`, borderRadius: 999, padding: "3px 9px" }}>
                          {supplier.city}
                        </span>
                      )}
                    </div>
                    {supplier.contactName && <div style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 4 }}>{supplier.contactName}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 18, paddingTop: 12, borderTop: `1px solid ${COLORS.lineSoft}`, marginTop: "auto", alignItems: "center" }}>
                    <span>
                      <span style={{ display: "block", fontFamily: MONO, fontSize: 15, letterSpacing: "-0.02em", lineHeight: 1 }}>{supplier.productCount}</span>
                      <span style={{ display: "block", fontSize: 11, color: COLORS.muted, marginTop: 3 }}>ürün</span>
                    </span>
                    <span>
                      <span style={{ display: "block", fontFamily: MONO, fontSize: 15, letterSpacing: "-0.02em", lineHeight: 1 }}>{formatTl(supplier.stockValueKurus)}</span>
                      <span style={{ display: "block", fontSize: 11, color: COLORS.muted, marginTop: 3 }}>stok değeri</span>
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <button
                        type="button"
                        style={ghostBtnStyle}
                        onClick={() => {
                          setEditingSupplier(supplier);
                          setSupplierModalOpen(true);
                        }}
                      >
                        Düzenle
                      </button>
                    </span>
                  </div>
                </div>
              ))
            ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "13px 20px", borderTop: `1px solid ${COLORS.line}`, fontSize: 12, color: COLORS.muted, flexWrap: "wrap" }}>
          {tab === "categories" && (
            <>
              <span>
                <b style={boldMono}>{filteredCategories.length}</b> kategori · her biri ortalama <b style={boldMono}>{avgProductsPerCategory}</b> ürün
              </span>
              <span>
                Toplam stok değeri <b style={boldMono}>{formatTl(totalCategoryValue)}</b>
              </span>
            </>
          )}
          {tab === "brands" && (
            <>
              <span>
                <b style={boldMono}>{filteredBrands.length}</b> marka · en geniş portföy <b style={boldMono}>{topBrandNames}</b>
              </span>
              <span>
                Toplam ürün sayısı <b style={boldMono}>{totalBrandProducts}</b>
              </span>
            </>
          )}
          {tab === "suppliers" && (
            <>
              <span>
                <b style={boldMono}>{filteredSuppliers.length}</b> tedarikçi · <b style={boldMono}>{citySet.size}</b> şehir
              </span>
              <span>
                Toplam stok değeri <b style={boldMono}>{formatTl(totalSupplierValue)}</b>
              </span>
            </>
          )}
        </div>
      </div>

      <p style={{ marginTop: 22, fontFamily: MONO, fontSize: 10.5, color: COLORS.muted }}>
        Bir tanım silinmeden önce, onu kullanan ürünlerin başka bir tanıma taşınması gerekir
      </p>

      <CategoryFormModal
        open={categoryModalOpen}
        category={editingCategory}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={(category) => {
          setCategoryModalOpen(false);
          setCategories((prev) =>
            prev.some((c) => c.id === category.id) ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category]
          );
        }}
      />

      <BrandFormModal
        open={brandModalOpen}
        brand={editingBrand}
        onClose={() => setBrandModalOpen(false)}
        onSaved={(brand) => {
          setBrandModalOpen(false);
          setBrands((prev) => (prev.some((b) => b.id === brand.id) ? prev.map((b) => (b.id === brand.id ? brand : b)) : [...prev, brand]));
        }}
      />

      <SupplierFormModal
        open={supplierModalOpen}
        supplier={editingSupplier}
        onClose={() => setSupplierModalOpen(false)}
        onSaved={(supplier) => {
          setSupplierModalOpen(false);
          setSuppliers((prev) =>
            prev.some((s) => s.id === supplier.id) ? prev.map((s) => (s.id === supplier.id ? supplier : s)) : [...prev, supplier]
          );
        }}
      />
    </div>
  );
};

export default Definitions;

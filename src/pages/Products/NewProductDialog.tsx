import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { createProduct, type Product } from "../../services/products";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { getSuppliers, type Supplier } from "../../services/suppliers";
import CreatableSelect from "../../components/CreatableSelect";
import QuickCreateCategoryModal from "./QuickCreateCategoryModal";
import QuickCreateBrandModal from "./QuickCreateBrandModal";
import QuickCreateSupplierModal from "./QuickCreateSupplierModal";
import {
  DIALOG_MONO,
  DIALOG_THEME,
  DialogCloseIcon,
  DialogFooter,
  DialogSection,
  DialogSwitchRow,
  DialogTitle,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_UNIT_OPTIONS,
  SegmentedPills,
  UnitEconomicsPanel,
  dialogChromeStyles,
  dialogHintStyle,
  dialogTwoColStyle,
  formatDecimalDisplay,
  parseDecimalDisplay,
} from "../../components/dialogTheme";

const INITIAL_VALUES = {
  unit: 1,
  status: 1,
  isFeatured: false,
  price: 0,
  costPrice: 0,
  stock: 0,
  minStock: 0,
};

type NewProductFormValues = {
  name: string;
  sku: string;
  barcode?: string;
  categoryId: number;
  brandId: number;
  supplierId: number;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: number;
  status: number;
  description?: string;
  isFeatured: boolean;
};

type NewProductDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (created: Product) => void;
};

const NewProductDialog = ({ open, onClose, onCreated }: NewProductDialogProps) => {
  const [form] = Form.useForm<NewProductFormValues>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);

  const priceValue = Form.useWatch("price", form);
  const costPriceValue = Form.useWatch("costPrice", form);
  const minStockValue = Form.useWatch("minStock", form);

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    const loadOptions = async () => {
      setOptionsLoading(true);
      const [categoriesResult, brandsResult, suppliersResult] = await Promise.all([
        getCategories(),
        getBrands(),
        getSuppliers(),
      ]);
      setOptionsLoading(false);

      if (categoriesResult.res) setCategories(categoriesResult.data);
      if (brandsResult.res) setBrands(brandsResult.data);
      if (suppliersResult.res) setSuppliers(suppliersResult.data);
    };

    loadOptions();
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await createProduct({
      name: values.name,
      sku: values.sku,
      barcode: values.barcode || "",
      categoryId: values.categoryId,
      brandId: values.brandId,
      supplierId: values.supplierId,
      price: Math.round(values.price * 100),
      costPrice: Math.round(values.costPrice * 100),
      stock: values.stock,
      minStock: values.minStock,
      unit: values.unit,
      status: values.status,
      description: values.description || "",
      isFeatured: values.isFeatured ?? false,
    });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Ürün eklendi.");
    onCreated(result.data);
  };

  const price = priceValue ?? 0;
  const cost = costPriceValue ?? 0;

  const thresholdHint = minStockValue
    ? `Stok ${minStockValue} adedin altına düşünce ürün kritik listesine girer.`
    : "Eşik girmezsen ürün kritik stok uyarılarına dahil edilmez.";

  return (
    <ConfigProvider theme={DIALOG_THEME}>
      <Modal
        open={open}
        onCancel={onClose}
        maskClosable={!saving}
        closable={!saving}
        width={720}
        centered
        styles={dialogChromeStyles()}
        closeIcon={<DialogCloseIcon />}
        title={<DialogTitle title="Yeni ürün ekle" subtitle="Katalog kaydı oluştur. Stok girişini sonradan da yapabilirsin." />}
        footer={<DialogFooter onCancel={onClose} onSubmit={handleSubmit} saving={saving} submitText="Ürünü ekle" />}
      >
        <Form form={form} layout="vertical" disabled={saving} requiredMark={false} initialValues={INITIAL_VALUES}>
          <DialogSection eyebrow="Kimlik">
            <Form.Item
              name="name"
              label="Ürün adı"
              rules={[
                { required: true, message: "Ürün adı zorunlu." },
                { whitespace: true, message: "Ürün adı boşluk olamaz." },
              ]}
              style={{ marginBottom: 14 }}
            >
              <Input size="large" placeholder="Örn. Coca-Cola 1,5 L Pet" />
            </Form.Item>
            <div style={dialogTwoColStyle}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[
                  { required: true, message: "SKU zorunlu." },
                  { whitespace: true, message: "SKU boşluk olamaz." },
                ]}
              >
                <Input size="large" placeholder="ICE-1010" style={{ fontFamily: DIALOG_MONO }} />
              </Form.Item>
              <Form.Item name="barcode" label="Barkod">
                <Input size="large" placeholder="13 haneli EAN" style={{ fontFamily: DIALOG_MONO }} />
              </Form.Item>
            </div>
          </DialogSection>

          <DialogSection eyebrow="Sınıflandırma">
            <div style={{ ...dialogTwoColStyle, marginBottom: 14 }}>
              <Form.Item name="categoryId" label="Kategori" rules={[{ required: true, message: "Kategori zorunlu." }]}>
                <CreatableSelect
                  placeholder="Kategori seç"
                  addButtonText="Yeni kategori ekle"
                  loading={optionsLoading}
                  onAddClick={() => setCategoryModalOpen(true)}
                  options={categories.map((category) => ({ label: category.name, value: category.id }))}
                />
              </Form.Item>
              <Form.Item name="brandId" label="Marka" rules={[{ required: true, message: "Marka zorunlu." }]}>
                <CreatableSelect
                  placeholder="Marka seç"
                  addButtonText="Yeni marka ekle"
                  loading={optionsLoading}
                  onAddClick={() => setBrandModalOpen(true)}
                  options={brands.map((brand) => ({ label: brand.name, value: brand.id }))}
                />
              </Form.Item>
            </div>
            <div style={dialogTwoColStyle}>
              <Form.Item name="supplierId" label="Tedarikçi" rules={[{ required: true, message: "Tedarikçi zorunlu." }]}>
                <CreatableSelect
                  placeholder="Tedarikçi seç"
                  addButtonText="Yeni tedarikçi ekle"
                  loading={optionsLoading}
                  onAddClick={() => setSupplierModalOpen(true)}
                  options={suppliers.map((supplier) => ({ label: supplier.name, value: supplier.id }))}
                />
              </Form.Item>
              <Form.Item name="unit" label="Birim" rules={[{ required: true, message: "Birim zorunlu." }]}>
                <Select size="large" options={PRODUCT_UNIT_OPTIONS} />
              </Form.Item>
            </div>
          </DialogSection>

          <DialogSection eyebrow="Fiyatlandırma">
            <div style={dialogTwoColStyle}>
              <Form.Item
                name="price"
                label="Satış fiyatı"
                rules={[
                  { required: true, message: "Satış fiyatı zorunlu." },
                  { type: "number", min: 0, message: "Satış fiyatı negatif olamaz." },
                ]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="₺"
                  style={{ width: "100%" }}
                  formatter={formatDecimalDisplay}
                  parser={parseDecimalDisplay}
                />
              </Form.Item>
              <Form.Item
                name="costPrice"
                label="Alış maliyeti"
                rules={[
                  { required: true, message: "Maliyet zorunlu." },
                  { type: "number", min: 0, message: "Maliyet negatif olamaz." },
                ]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="₺"
                  style={{ width: "100%" }}
                  formatter={formatDecimalDisplay}
                  parser={parseDecimalDisplay}
                />
              </Form.Item>
            </div>
            <UnitEconomicsPanel price={price} cost={cost} />
          </DialogSection>

          <DialogSection eyebrow="Stok">
            <div style={dialogTwoColStyle}>
              <Form.Item
                name="stock"
                label="Başlangıç stoğu"
                rules={[
                  { required: true, message: "Stok zorunlu." },
                  { type: "number", min: 0, message: "Stok negatif olamaz." },
                ]}
              >
                <InputNumber size="large" min={0} style={{ width: "100%", fontFamily: DIALOG_MONO }} />
              </Form.Item>
              <Form.Item
                name="minStock"
                label="Kritik stok eşiği"
                rules={[
                  { required: true, message: "Kritik stok eşiği zorunlu." },
                  { type: "number", min: 0, message: "Kritik stok eşiği negatif olamaz." },
                ]}
                extra={<p style={dialogHintStyle}>{thresholdHint}</p>}
              >
                <InputNumber size="large" min={0} style={{ width: "100%", fontFamily: DIALOG_MONO }} />
              </Form.Item>
            </div>
          </DialogSection>

          <DialogSection eyebrow="Yayın" last>
            <Form.Item name="status" label="Durum" rules={[{ required: true, message: "Durum zorunlu." }]} style={{ marginBottom: 16 }}>
              <SegmentedPills options={PRODUCT_STATUS_OPTIONS} />
            </Form.Item>
            <Form.Item name="description" label="Açıklama" style={{ marginBottom: 16 }}>
              <Input.TextArea rows={3} placeholder="Rafta nerede durduğu, ambalaj notu, kampanya bilgisi…" />
            </Form.Item>
            <DialogSwitchRow>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Öne çıkan ürün</div>
                <div style={{ fontSize: 11.5, color: "#6C7178", marginTop: 2 }}>
                  Listelerin en üstünde ve panelde vitrinde görünür.
                </div>
              </div>
              <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                <Switch style={{ marginLeft: "auto" }} />
              </Form.Item>
            </DialogSwitchRow>
          </DialogSection>
        </Form>
      </Modal>

      <QuickCreateCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreated={(category) => {
          setCategories((prev) => [...prev, category]);
          form.setFieldValue("categoryId", category.id);
          setCategoryModalOpen(false);
        }}
      />

      <QuickCreateBrandModal
        open={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        onCreated={(brand) => {
          setBrands((prev) => [...prev, brand]);
          form.setFieldValue("brandId", brand.id);
          setBrandModalOpen(false);
        }}
      />

      <QuickCreateSupplierModal
        open={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        onCreated={(supplier) => {
          setSuppliers((prev) => [...prev, supplier]);
          form.setFieldValue("supplierId", supplier.id);
          setSupplierModalOpen(false);
        }}
      />
    </ConfigProvider>
  );
};

export default NewProductDialog;

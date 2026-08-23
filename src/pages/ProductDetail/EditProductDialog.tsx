import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { getProductById, updateProduct, type ProductDetail } from "../../services/products";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { getSuppliers, type Supplier } from "../../services/suppliers";
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

type EditProductFormValues = {
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

type EditProductDialogProps = {
  open: boolean;
  product: ProductDetail;
  onClose: () => void;
  onUpdated: (updated: ProductDetail) => void;
};

const EditProductDialog = ({ open, product, onClose, onUpdated }: EditProductDialogProps) => {
  const [form] = Form.useForm<EditProductFormValues>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const priceValue = Form.useWatch("price", form);
  const costPriceValue = Form.useWatch("costPrice", form);
  const minStockValue = Form.useWatch("minStock", form);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      categoryId: product.categoryId,
      brandId: product.brandId,
      supplierId: product.supplierId,
      price: product.price / 100,
      costPrice: product.costPrice / 100,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      status: product.status,
      description: product.description,
      isFeatured: product.isFeatured,
    });

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
  }, [open, product, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await updateProduct(product.id, {
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

    if (!result.res) {
      setSaving(false);
      toast.error(result.message);
      return;
    }

    const detailResult = await getProductById(product.id);
    setSaving(false);

    if (!detailResult.res) {
      toast.error(detailResult.message);
      return;
    }

    toast.success("Ürün güncellendi.");
    onUpdated(detailResult.data);
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
        title={<DialogTitle title="Ürünü düzenle" subtitle={`"${product.name}" için katalog kaydını güncelle.`} />}
        footer={<DialogFooter onCancel={onClose} onSubmit={handleSubmit} saving={saving} submitText="Kaydet" />}
      >
        <Form form={form} layout="vertical" disabled={saving} requiredMark={false}>
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
              <Input size="large" />
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
                <Input size="large" style={{ fontFamily: DIALOG_MONO }} />
              </Form.Item>
              <Form.Item name="barcode" label="Barkod">
                <Input size="large" style={{ fontFamily: DIALOG_MONO }} />
              </Form.Item>
            </div>
          </DialogSection>

          <DialogSection eyebrow="Sınıflandırma">
            <div style={{ ...dialogTwoColStyle, marginBottom: 14 }}>
              <Form.Item name="categoryId" label="Kategori" rules={[{ required: true, message: "Kategori zorunlu." }]}>
                <Select
                  size="large"
                  loading={optionsLoading}
                  options={categories.map((category) => ({ label: category.name, value: category.id }))}
                />
              </Form.Item>
              <Form.Item name="brandId" label="Marka" rules={[{ required: true, message: "Marka zorunlu." }]}>
                <Select
                  size="large"
                  loading={optionsLoading}
                  options={brands.map((brand) => ({ label: brand.name, value: brand.id }))}
                />
              </Form.Item>
            </div>
            <div style={dialogTwoColStyle}>
              <Form.Item name="supplierId" label="Tedarikçi" rules={[{ required: true, message: "Tedarikçi zorunlu." }]}>
                <Select
                  size="large"
                  loading={optionsLoading}
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
                label="Stok"
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
              <Input.TextArea rows={3} />
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
    </ConfigProvider>
  );
};

export default EditProductDialog;

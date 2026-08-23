import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getProductById, updateProduct, type ProductDetail } from "../../services/products";
import { getCategories, type Category } from "../../services/categories";
import { getBrands, type Brand } from "../../services/brands";
import { getSuppliers, type Supplier } from "../../services/suppliers";
import { BRAND_COLORS } from "../../constants/colors";

const UNIT_OPTIONS = [
  { value: 1, label: "Adet" },
  { value: 2, label: "Kg" },
  { value: 3, label: "Lt" },
  { value: 4, label: "Paket" },
];

const STATUS_OPTIONS = [
  { value: 1, label: "Aktif" },
  { value: 2, label: "Pasif" },
  { value: 3, label: "Üretim Durduruldu" },
];

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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      maskClosable={!saving}
      closable={!saving}
      width={680}
      centered
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "rgba(215, 254, 71, 0.35)",
              color: BRAND_COLORS.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flex: "0 0 auto",
            }}
          >
            <EditOutlined />
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>Ürünü düzenle</span>
        </div>
      }
      footer={[
        <Button key="cancel" size="large" disabled={saving} onClick={onClose}>
          Vazgeç
        </Button>,
        <Button key="submit" type="primary" size="large" loading={saving} onClick={handleSubmit}>
          Kaydet
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false} style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Form.Item
            name="name"
            label="Ürün adı"
            rules={[{ required: true, message: "Ürün adı zorunlu." }]}
            style={{ gridColumn: "1 / -1" }}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: "SKU zorunlu." }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="barcode" label="Barkod">
            <Input size="large" />
          </Form.Item>

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

          <Form.Item
            name="supplierId"
            label="Tedarikçi"
            rules={[{ required: true, message: "Tedarikçi zorunlu." }]}
            style={{ gridColumn: "1 / -1" }}
          >
            <Select
              size="large"
              loading={optionsLoading}
              options={suppliers.map((supplier) => ({ label: supplier.name, value: supplier.id }))}
            />
          </Form.Item>

          <Form.Item name="price" label="Satış fiyatı (₺)" rules={[{ required: true, message: "Satış fiyatı zorunlu." }]}>
            <InputNumber size="large" min={0} step={0.01} precision={2} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="costPrice" label="Maliyet (₺)" rules={[{ required: true, message: "Maliyet zorunlu." }]}>
            <InputNumber size="large" min={0} step={0.01} precision={2} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="stock" label="Stok" rules={[{ required: true, message: "Stok zorunlu." }]}>
            <InputNumber size="large" min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="minStock"
            label="Kritik stok eşiği"
            rules={[{ required: true, message: "Kritik stok eşiği zorunlu." }]}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="unit" label="Birim" rules={[{ required: true, message: "Birim zorunlu." }]}>
            <Select size="large" options={UNIT_OPTIONS} />
          </Form.Item>

          <Form.Item name="status" label="Durum" rules={[{ required: true, message: "Durum zorunlu." }]}>
            <Select size="large" options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item name="description" label="Açıklama" style={{ gridColumn: "1 / -1" }}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="isFeatured" label="Öne çıkan ürün" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProductDialog;

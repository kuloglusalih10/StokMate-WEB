import { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { createBrand, updateBrand, type Brand } from "../../services/brands";
import { BRAND_COLORS } from "../../constants/colors";

type BrandFormValues = {
  name: string;
};

type BrandFormModalProps = {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSaved: (brand: Brand) => void;
};

const BrandFormModal = ({ open, brand, onClose, onSaved }: BrandFormModalProps) => {
  const [form] = Form.useForm<BrandFormValues>();
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(brand);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({ name: brand?.name ?? "" });
  }, [open, brand, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = brand
      ? await updateBrand(brand.id, { name: values.name })
      : await createBrand({ name: values.name });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Marka güncellendi." : "Marka eklendi.");
    onSaved(result.data);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      maskClosable={!saving}
      closable={!saving}
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
            <ShopOutlined />
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>
            {isEdit ? "Markayı düzenle" : "Yeni marka ekle"}
          </span>
        </div>
      }
      footer={[
        <Button key="cancel" size="large" disabled={saving} onClick={onClose}>
          Vazgeç
        </Button>,
        <Button key="submit" type="primary" size="large" loading={saving} onClick={handleSubmit}>
          {isEdit ? "Kaydet" : "Ekle"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false} style={{ marginTop: 12 }}>
        <Form.Item
          name="name"
          label="Marka adı"
          rules={[
            { required: true, message: "Marka adı zorunlu." },
            { whitespace: true, message: "Marka adı boşluk olamaz." },
          ]}
        >
          <Input size="large" autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandFormModal;

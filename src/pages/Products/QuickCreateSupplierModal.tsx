import { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { TruckOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { createSupplier, type Supplier } from "../../services/suppliers";
import { BRAND_COLORS } from "../../constants/colors";

type QuickCreateSupplierFormValues = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
};

type QuickCreateSupplierModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (supplier: Supplier) => void;
};

const QuickCreateSupplierModal = ({ open, onClose, onCreated }: QuickCreateSupplierModalProps) => {
  const [form] = Form.useForm<QuickCreateSupplierFormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await createSupplier({
      name: values.name,
      contactName: values.contactName || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      city: values.city || undefined,
    });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Tedarikçi eklendi.");
    onCreated(result.data);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      maskClosable={!saving}
      closable={!saving}
      centered
      width={560}
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
            <TruckOutlined />
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>Yeni tedarikçi ekle</span>
        </div>
      }
      footer={[
        <Button key="cancel" size="large" disabled={saving} onClick={onClose}>
          Vazgeç
        </Button>,
        <Button key="submit" type="primary" size="large" loading={saving} onClick={handleSubmit}>
          Ekle
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false} style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Form.Item
            name="name"
            label="Tedarikçi adı"
            rules={[
              { required: true, message: "Tedarikçi adı zorunlu." },
              { whitespace: true, message: "Tedarikçi adı boşluk olamaz." },
            ]}
            style={{ gridColumn: "1 / -1" }}
          >
            <Input size="large" autoFocus />
          </Form.Item>

          <Form.Item name="contactName" label="Yetkili kişi">
            <Input size="large" />
          </Form.Item>

          <Form.Item name="phone" label="Telefon">
            <Input size="large" />
          </Form.Item>

          <Form.Item name="email" label="E-posta" rules={[{ type: "email", message: "Geçerli bir e-posta gir." }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="city" label="Şehir">
            <Input size="large" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default QuickCreateSupplierModal;

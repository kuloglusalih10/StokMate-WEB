import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { createSupplier, type Supplier } from "../../services/suppliers";
import AppDialog from "../../components/AppDialog";
import { DialogSection, dialogTwoColStyle } from "../../components/dialogTheme";
import type { QuickCreateSupplierFormValues, QuickCreateSupplierModalProps } from "../../types/products";

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
    <AppDialog
      open={open}
      onClose={onClose}
      title="Yeni tedarikçi ekle"
      width={560}
      maxHeight="80vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText="Ekle"
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false}>
        <DialogSection last>
          <Form.Item
            name="name"
            label="Tedarikçi adı"
            rules={[
              { required: true, message: "Tedarikçi adı zorunlu." },
              { whitespace: true, message: "Tedarikçi adı boşluk olamaz." },
            ]}
            style={{ marginBottom: 14 }}
          >
            <Input size="large" autoFocus />
          </Form.Item>
          <div style={{ ...dialogTwoColStyle, marginBottom: 14 }}>
            <Form.Item name="contactName" label="Yetkili kişi">
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon"
              rules={[
                {
                  pattern: /^0[0-9]{10}$/,
                  message: "Geçerli bir telefon numarası gir (05XX XXX XXXX).",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="05XX XXX XXXX"
                maxLength={11}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^0-9]/g, "");
                }}
              />
            </Form.Item>
          </div>
          <div style={dialogTwoColStyle}>
            <Form.Item
              name="email"
              label="E-posta"
              rules={[{ type: "email", message: "Geçerli bir e-posta adresi gir." }]}
            >
              <Input size="large" placeholder="ornek@firma.com" />
            </Form.Item>
            <Form.Item name="city" label="Şehir" style={{ marginBottom: 0 }}>
              <Input size="large" />
            </Form.Item>
          </div>
        </DialogSection>
      </Form>
    </AppDialog>
  );
};

export default QuickCreateSupplierModal;

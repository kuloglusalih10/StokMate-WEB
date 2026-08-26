import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { createSupplier, updateSupplier, type Supplier } from "../../services/suppliers";
import AppDialog from "../../components/AppDialog";
import { DialogSection, dialogTwoColStyle } from "../../components/dialogTheme";
import type { SupplierFormValues, SupplierFormModalProps } from "../../types/definitions";

const SupplierFormModal = ({ open, supplier, onClose, onSaved }: SupplierFormModalProps) => {
  const [form] = Form.useForm<SupplierFormValues>();
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(supplier);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      name: supplier?.name ?? "",
      contactName: supplier?.contactName ?? "",
      phone: supplier?.phone ?? "",
      email: supplier?.email ?? "",
      city: supplier?.city ?? "",
    });
  }, [open, supplier, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      contactName: values.contactName || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      city: values.city || undefined,
    };

    setSaving(true);
    const result = supplier ? await updateSupplier(supplier.id, payload) : await createSupplier(payload);
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Tedarikçi güncellendi." : "Tedarikçi eklendi.");
    onSaved(result.data);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Tedarikçiyi düzenle" : "Yeni tedarikçi ekle"}
      width={560}
      maxHeight="80vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText={isEdit ? "Kaydet" : "Ekle"}
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

export default SupplierFormModal;

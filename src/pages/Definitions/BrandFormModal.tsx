import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { createBrand, updateBrand } from "../../services/brands";
import AppDialog from "../../components/AppDialog";
import type { BrandFormValues, BrandFormModalProps } from "../../types/definitions";

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
    const result = brand ? await updateBrand(brand.id, { name: values.name }) : await createBrand({ name: values.name });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Marka güncellendi." : "Marka eklendi.");
    onSaved(result.data);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Markayı düzenle" : "Yeni marka ekle"}
      maxHeight="70vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText={isEdit ? "Kaydet" : "Ekle"}
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false}>
        <Form.Item
          name="name"
          label="Marka adı"
          rules={[
            { required: true, message: "Marka adı zorunlu." },
            { whitespace: true, message: "Marka adı boşluk olamaz." },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" autoFocus />
        </Form.Item>
      </Form>
    </AppDialog>
  );
};

export default BrandFormModal;

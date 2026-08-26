import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { createBrand } from "../../services/brands";
import AppDialog from "../../components/AppDialog";
import type { QuickCreateBrandFormValues, QuickCreateBrandModalProps } from "../../types/products";

const QuickCreateBrandModal = ({ open, onClose, onCreated }: QuickCreateBrandModalProps) => {
  const [form] = Form.useForm<QuickCreateBrandFormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await createBrand({ name: values.name });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Marka eklendi.");
    onCreated(result.data);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Yeni marka ekle"
      maxHeight="70vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText="Ekle"
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

export default QuickCreateBrandModal;

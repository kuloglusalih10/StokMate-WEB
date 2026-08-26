import { useEffect, useState } from "react";
import { Form, Input, ColorPicker } from "antd";
import { toast } from "react-toastify";
import { createCategory, type Category } from "../../services/categories";
import AppDialog from "../../components/AppDialog";
import { DIALOG_COLORS } from "../../components/dialogTheme";
import type { QuickCreateCategoryFormValues, QuickCreateCategoryModalProps } from "../../types/products";

const QuickCreateCategoryModal = ({ open, onClose, onCreated }: QuickCreateCategoryModalProps) => {
  const [form] = Form.useForm<QuickCreateCategoryFormValues>();
  const [color, setColor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setColor(null);
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await createCategory({ name: values.name, color: color ?? undefined });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Kategori eklendi.");
    onCreated(result.data);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Yeni kategori ekle"
      maxHeight="70vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText="Ekle"
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false}>
        <Form.Item
          name="name"
          label="Kategori adı"
          rules={[
            { required: true, message: "Kategori adı zorunlu." },
            { whitespace: true, message: "Kategori adı boşluk olamaz." },
          ]}
        >
          <Input size="large" autoFocus />
        </Form.Item>

        <Form.Item label="Renk" style={{ marginBottom: 0 }}>
          <ColorPicker value={color} onChange={(value) => setColor(value.toHexString())} format="hex" disabledAlpha size="large" />
          <div style={{ fontSize: 12.5, color: DIALOG_COLORS.muted, marginTop: 10 }}>Renk seçmezsen otomatik bir renk atanır.</div>
        </Form.Item>
      </Form>
    </AppDialog>
  );
};

export default QuickCreateCategoryModal;

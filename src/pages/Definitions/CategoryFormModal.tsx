import { useEffect, useState } from "react";
import { Form, Input, ColorPicker } from "antd";
import { toast } from "react-toastify";
import { createCategory, updateCategory } from "../../services/categories";
import AppDialog from "../../components/AppDialog";
import { DIALOG_COLORS } from "../../components/dialogTheme";
import type { CategoryFormValues, CategoryFormModalProps } from "../../types/definitions";

const CategoryFormModal = ({ open, category, onClose, onSaved }: CategoryFormModalProps) => {
  const [form] = Form.useForm<CategoryFormValues>();
  const [color, setColor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(category);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({ name: category?.name ?? "" });
    setColor(category?.color ?? null);
  }, [open, category, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = category
      ? await updateCategory(category.id, { name: values.name, color: color ?? category.color })
      : await createCategory({ name: values.name, color: color ?? undefined });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Kategori güncellendi." : "Kategori eklendi.");
    onSaved(result.data);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Kategoriyi düzenle" : "Yeni kategori ekle"}
      maxHeight="70vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText={isEdit ? "Kaydet" : "Ekle"}
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
          <div style={{ fontSize: 12.5, color: DIALOG_COLORS.muted, marginTop: 10 }}>
            {isEdit ? "Kategorinin rengini değiştirmek için istediğin bir renk seç." : "Renk seçmezsen otomatik bir renk atanır."}
          </div>
        </Form.Item>
      </Form>
    </AppDialog>
  );
};

export default CategoryFormModal;

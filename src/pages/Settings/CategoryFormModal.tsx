import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, ColorPicker } from "antd";
import { TagsOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { createCategory, updateCategory, type Category } from "../../services/categories";
import { BRAND_COLORS } from "../../constants/colors";

type CategoryFormValues = {
  name: string;
};

type CategoryFormModalProps = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: (category: Category) => void;
};

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
            <TagsOutlined />
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>
            {isEdit ? "Kategoriyi düzenle" : "Yeni kategori ekle"}
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
          label="Kategori adı"
          rules={[
            { required: true, message: "Kategori adı zorunlu." },
            { whitespace: true, message: "Kategori adı boşluk olamaz." },
          ]}
        >
          <Input size="large" autoFocus />
        </Form.Item>

        <Form.Item label="Renk">
          <ColorPicker
            value={color}
            onChange={(value) => setColor(value.toHexString())}
            format="hex"
            disabledAlpha
            size="large"
          />
          <div style={{ fontSize: 12.5, color: "#ADADAD", marginTop: 10 }}>
            {isEdit ? "Kategorinin rengini değiştirmek için istediğin bir renk seç." : "Renk seçmezsen otomatik bir renk atanır."}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;

import { useEffect, useState } from "react";
import { Modal, Form, Input, ColorPicker, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { createCategory, updateCategory, type Category } from "../../services/categories";
import { DIALOG_COLORS, DIALOG_THEME, DialogCloseIcon, DialogFooter, DialogTitle, dialogChromeStyles } from "../../components/dialogTheme";

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
    <ConfigProvider theme={DIALOG_THEME}>
      <Modal
        open={open}
        onCancel={onClose}
        maskClosable={!saving}
        closable={!saving}
        centered
        styles={dialogChromeStyles("70vh")}
        closeIcon={<DialogCloseIcon />}
        title={<DialogTitle title={isEdit ? "Kategoriyi düzenle" : "Yeni kategori ekle"} />}
        footer={<DialogFooter onCancel={onClose} onSubmit={handleSubmit} saving={saving} submitText={isEdit ? "Kaydet" : "Ekle"} />}
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
      </Modal>
    </ConfigProvider>
  );
};

export default CategoryFormModal;

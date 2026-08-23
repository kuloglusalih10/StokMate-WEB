import { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { TagsOutlined, CheckOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { createCategory, type Category } from "../../services/categories";
import { BRAND_COLORS } from "../../constants/colors";

const COLOR_PALETTE = [
  "#2F80ED",
  "#F2994A",
  "#C08A3E",
  "#56CCF2",
  "#EB5757",
  "#27AE60",
  "#9B51E0",
  "#64748B",
  "#F2C94C",
  "#219653",
];

type QuickCreateCategoryFormValues = {
  name: string;
};

type QuickCreateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (category: Category) => void;
};

const QuickCreateCategoryModal = ({ open, onClose, onCreated }: QuickCreateCategoryModalProps) => {
  const [form] = Form.useForm<QuickCreateCategoryFormValues>();
  const [color, setColor] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setColor(undefined);
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await createCategory({ name: values.name, color });
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Kategori eklendi.");
    onCreated(result.data);
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
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>Yeni kategori ekle</span>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {COLOR_PALETTE.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => setColor(swatch === color ? undefined : swatch)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: swatch,
                  border: swatch === color ? `2px solid ${BRAND_COLORS.secondary}` : "2px solid transparent",
                  outline: swatch === color ? `2px solid ${swatch}` : "none",
                  outlineOffset: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {swatch === color && <CheckOutlined style={{ color: "#FFFFFF", fontSize: 14 }} />}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: "#ADADAD", marginTop: 10 }}>
            Renk seçmezsen otomatik bir renk atanır.
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuickCreateCategoryModal;

import { useEffect, useState } from "react";
import { Modal, Form, Input, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { createBrand, updateBrand, type Brand } from "../../services/brands";
import { DIALOG_THEME, DialogCloseIcon, DialogFooter, DialogTitle, dialogChromeStyles } from "../../components/dialogTheme";

type BrandFormValues = {
  name: string;
};

type BrandFormModalProps = {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSaved: (brand: Brand) => void;
};

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
    <ConfigProvider theme={DIALOG_THEME}>
      <Modal
        open={open}
        onCancel={onClose}
        maskClosable={!saving}
        closable={!saving}
        centered
        styles={dialogChromeStyles("70vh")}
        closeIcon={<DialogCloseIcon />}
        title={<DialogTitle title={isEdit ? "Markayı düzenle" : "Yeni marka ekle"} />}
        footer={<DialogFooter onCancel={onClose} onSubmit={handleSubmit} saving={saving} submitText={isEdit ? "Kaydet" : "Ekle"} />}
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
      </Modal>
    </ConfigProvider>
  );
};

export default BrandFormModal;

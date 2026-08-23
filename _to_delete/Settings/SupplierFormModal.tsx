import { useEffect, useState } from "react";
import { Modal, Form, Input, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { createSupplier, updateSupplier, type Supplier } from "../../services/suppliers";
import { DIALOG_THEME, DialogCloseIcon, DialogFooter, DialogSection, DialogTitle, dialogChromeStyles, dialogTwoColStyle } from "../../components/dialogTheme";

type SupplierFormValues = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
};

type SupplierFormModalProps = {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSaved: (supplier: Supplier) => void;
};

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
    <ConfigProvider theme={DIALOG_THEME}>
      <Modal
        open={open}
        onCancel={onClose}
        maskClosable={!saving}
        closable={!saving}
        width={560}
        centered
        styles={dialogChromeStyles("80vh")}
        closeIcon={<DialogCloseIcon />}
        title={<DialogTitle title={isEdit ? "Tedarikçiyi düzenle" : "Yeni tedarikçi ekle"} />}
        footer={<DialogFooter onCancel={onClose} onSubmit={handleSubmit} saving={saving} submitText={isEdit ? "Kaydet" : "Ekle"} />}
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
              <Form.Item name="phone" label="Telefon">
                <Input size="large" />
              </Form.Item>
            </div>
            <div style={dialogTwoColStyle}>
              <Form.Item name="email" label="E-posta" rules={[{ type: "email", message: "Geçerli bir e-posta gir." }]}>
                <Input size="large" />
              </Form.Item>
              <Form.Item name="city" label="Şehir" style={{ marginBottom: 0 }}>
                <Input size="large" />
              </Form.Item>
            </div>
          </DialogSection>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default SupplierFormModal;

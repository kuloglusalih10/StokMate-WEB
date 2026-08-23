import { useEffect, useState } from "react";
import { Form, InputNumber } from "antd";
import { toast } from "react-toastify";
import { addProductStockEntry } from "../../services/products";
import AppDialog from "../../components/AppDialog";
import { DIALOG_COLORS } from "../../components/dialogTheme";
import type { StockEntryFormValues, StockEntryDialogProps } from "../../types/productDetail";

const StockEntryDialog = ({ open, productId, productName, onClose, onAdded }: StockEntryDialogProps) => {
  const [form] = Form.useForm<StockEntryFormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    setSaving(true);
    const result = await addProductStockEntry(productId, values.quantity);
    setSaving(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    toast.success("Stok girişi kaydedildi.");
    onAdded();
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Stok girişi"
      subtitle={`"${productName}" için depoya eklenecek miktarı gir.`}
      width={420}
      maxHeight="70vh"
      saving={saving}
      onSubmit={handleSubmit}
      submitText="Girişi kaydet"
      requiredNote={false}
    >
      <Form form={form} layout="vertical" disabled={saving} requiredMark={false}>
        <Form.Item
          name="quantity"
          label="Eklenecek miktar"
          rules={[
            { required: true, message: "Miktar zorunlu." },
            { type: "number", min: 1, message: "Miktar sıfırdan büyük olmalı." },
          ]}
          extra={<p style={{ margin: "6px 0 0", fontSize: 11.5, color: DIALOG_COLORS.muted }}>Bu miktar mevcut stoğa eklenir.</p>}
        >
          <InputNumber size="large" min={1} style={{ width: "100%" }} autoFocus />
        </Form.Item>
      </Form>
    </AppDialog>
  );
};

export default StockEntryDialog;

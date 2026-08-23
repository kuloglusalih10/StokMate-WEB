import { Button } from "antd";
import AppDialog from "../AppDialog";
import { DIALOG_COLORS } from "../dialogTheme";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <AppDialog
    open={open}
    onClose={onCancel}
    title={title}
    maxHeight="70vh"
    saving={loading}
    footer={
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
        <Button size="large" disabled={loading} onClick={onCancel}>
          {cancelText}
        </Button>
        <Button size="large" danger={danger} loading={loading} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    }
  >
    {description && (
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: DIALOG_COLORS.muted }}>{description}</p>
    )}
  </AppDialog>
);

export default ConfirmDialog;

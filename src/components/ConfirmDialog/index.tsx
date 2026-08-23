import { Modal, ConfigProvider } from "antd";
import { DIALOG_COLORS, DIALOG_THEME, DialogCloseIcon, DialogTitle, dialogChromeStyles } from "../dialogTheme";

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
  <ConfigProvider theme={DIALOG_THEME}>
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{ danger, loading, size: "large" }}
      cancelButtonProps={{ size: "large", disabled: loading }}
      maskClosable={!loading}
      closable={!loading}
      centered
      styles={dialogChromeStyles("70vh")}
      closeIcon={<DialogCloseIcon />}
      title={<DialogTitle title={title} />}
    >
      {description && (
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: DIALOG_COLORS.muted }}>{description}</p>
      )}
    </Modal>
  </ConfigProvider>
);

export default ConfirmDialog;

import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BRAND_COLORS } from "../../constants/colors";

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
    title={
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: danger ? "rgba(245, 34, 45, 0.1)" : "rgba(215, 254, 71, 0.35)",
            color: danger ? "#F5222D" : BRAND_COLORS.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flex: "0 0 auto",
          }}
        >
          <ExclamationCircleFilled />
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, color: BRAND_COLORS.secondary }}>{title}</span>
      </div>
    }
  >
    {description && (
      <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.7, color: "#5C5C5C" }}>{description}</p>
    )}
  </Modal>
);

export default ConfirmDialog;

import type { ReactNode } from "react";
import { Modal, ConfigProvider } from "antd";
import {
  DIALOG_THEME,
  DialogCloseIcon,
  DialogFooter,
  DialogTitle,
  dialogChromeStyles,
} from "../dialogTheme";

type AppDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number;
  maxHeight?: string;
  saving?: boolean;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  requiredNote?: boolean;
  footer?: ReactNode;
  children: ReactNode;
};

const AppDialog = ({
  open,
  onClose,
  title,
  subtitle,
  width,
  maxHeight,
  saving = false,
  onSubmit,
  submitText,
  cancelText,
  requiredNote,
  footer,
  children,
}: AppDialogProps) => {
  const resolvedFooter =
    footer !== undefined
      ? footer
      : onSubmit
      ? (
          <DialogFooter
            onCancel={onClose}
            onSubmit={onSubmit}
            saving={saving}
            submitText={submitText}
            cancelText={cancelText}
            requiredNote={requiredNote}
          />
        )
      : undefined;

  return (
    <ConfigProvider theme={DIALOG_THEME}>
      <Modal
        open={open}
        onCancel={onClose}
        maskClosable={!saving}
        closable={!saving}
        width={width}
        centered
        zIndex={1100}
        styles={dialogChromeStyles(maxHeight)}
        closeIcon={<DialogCloseIcon />}
        title={<DialogTitle title={title} subtitle={subtitle} />}
        footer={resolvedFooter}
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
};

export default AppDialog;

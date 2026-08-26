import type { CSSProperties, ReactNode } from "react";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export const DIALOG_COLORS = {
  ink: "#0E1116",
  card: "#FFFFFF",
  line: "rgba(14,17,22,0.10)",
  lineSoft: "rgba(14,17,22,0.06)",
  text: "#0E1116",
  muted: "#6C7178",
  teal: "#10635C",
  tealSoft: "#D7E5E2",
  lime: "#C6F24E",
  rust: "#C63F26",
};

export const DIALOG_SANS = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif";
export const DIALOG_MONO = "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace";

export const DIALOG_THEME = {
  token: {
    fontFamily: DIALOG_SANS,
    colorPrimary: DIALOG_COLORS.ink,
    colorTextLightSolid: DIALOG_COLORS.card,
    colorText: DIALOG_COLORS.text,
    colorTextSecondary: DIALOG_COLORS.muted,
    colorBorder: DIALOG_COLORS.line,
    colorBgContainer: "#FCFCFB",
    borderRadius: 10,
    borderRadiusLG: 18,
  },
  components: {
    Input: {
      activeBorderColor: DIALOG_COLORS.ink,
      hoverBorderColor: "rgba(14,17,22,0.3)",
      activeShadow: "0 0 0 3px rgba(14,17,22,0.10)",
      inputFontSizeLG: 13.5,
      paddingBlockLG: 10,
      paddingInlineLG: 12,
    },
    InputNumber: {
      activeBorderColor: DIALOG_COLORS.ink,
      hoverBorderColor: "rgba(14,17,22,0.3)",
      activeShadow: "0 0 0 3px rgba(14,17,22,0.10)",
      inputFontSizeLG: 13.5,
      paddingBlockLG: 10,
      paddingInlineLG: 12,
    },
    Select: {
      optionSelectedBg: "rgba(14,17,22,0.06)",
    },
    Switch: {
      colorPrimary: DIALOG_COLORS.ink,
    },
    Form: {
      itemMarginBottom: 0,
      labelFontSize: 12.5,
      labelColor: DIALOG_COLORS.text,
    },
    Modal: {
      borderRadiusLG: 18,
    },
  },
};

export const dialogEyebrowStyle: CSSProperties = {
  fontFamily: DIALOG_MONO,
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: DIALOG_COLORS.muted,
  display: "block",
  marginBottom: 14,
};

export const dialogSectionStyle: CSSProperties = {
  padding: "20px 0",
  borderBottom: `1px solid ${DIALOG_COLORS.lineSoft}`,
};

export const dialogLastSectionStyle: CSSProperties = {
  padding: "20px 0 4px",
};

export const dialogTwoColStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

export const dialogHintStyle: CSSProperties = {
  fontSize: 11.5,
  color: DIALOG_COLORS.muted,
  margin: "6px 0 0",
};

export const dialogChromeStyles = (maxHeight = "82vh") => ({
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    maxHeight,
    padding: 0,
    overflow: "hidden" as const,
  },
  header: {
    flex: "0 0 auto",
    margin: 0,
    padding: "20px 26px 18px",
    borderBottom: `1px solid ${DIALOG_COLORS.lineSoft}`,
  },
  body: {
    flex: "1 1 auto",
    overflowY: "auto" as const,
    padding: "20px 26px",
  },
  footer: {
    flex: "0 0 auto",
    margin: 0,
    padding: "15px 26px",
    borderTop: `1px solid ${DIALOG_COLORS.line}`,
    background: "#FBFBF9",
  },
});

export const DialogCloseIcon = () => (
  <span
    style={{
      width: 32,
      height: 32,
      borderRadius: 9,
      border: `1px solid ${DIALOG_COLORS.line}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: DIALOG_COLORS.muted,
    }}
  >
    <CloseOutlined style={{ fontSize: 13 }} />
  </span>
);

type DialogTitleProps = {
  title: string;
  subtitle?: string;
};

export const DialogTitle = ({ title, subtitle }: DialogTitleProps) => (
  <div>
    <span style={{ display: "block", fontSize: 19, fontWeight: 700, letterSpacing: "-0.025em", color: DIALOG_COLORS.text }}>
      {title}
    </span>
    {subtitle && (
      <span style={{ display: "block", fontSize: 12.5, color: DIALOG_COLORS.muted, fontWeight: 400, marginTop: 3 }}>
        {subtitle}
      </span>
    )}
  </div>
);

type DialogFooterProps = {
  onCancel: () => void;
  onSubmit: () => void;
  saving?: boolean;
  cancelText?: string;
  submitText?: string;
  requiredNote?: boolean;
};

export const DialogFooter = ({
  onCancel,
  onSubmit,
  saving = false,
  cancelText = "Vazgeç",
  submitText = "Kaydet",
  requiredNote = true,
}: DialogFooterProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    {requiredNote ? (
      <span style={{ fontSize: 11.5, color: DIALOG_COLORS.muted }}>
        <span style={{ color: DIALOG_COLORS.ink }}>*</span> zorunlu alanlar
      </span>
    ) : (
      <span />
    )}
    <div style={{ marginLeft: "auto", display: "flex", gap: 9 }}>
      <Button size="large" disabled={saving} onClick={onCancel}>
        {cancelText}
      </Button>
      <Button type="primary" size="large" loading={saving} onClick={onSubmit}>
        {submitText}
      </Button>
    </div>
  </div>
);

type DialogSectionProps = {
  eyebrow?: string;
  last?: boolean;
  children: ReactNode;
};

export const DialogSection = ({ eyebrow, last, children }: DialogSectionProps) => (
  <div style={last ? dialogLastSectionStyle : dialogSectionStyle}>
    {eyebrow && <span style={dialogEyebrowStyle}>{eyebrow}</span>}
    {children}
  </div>
);

export type SegmentedOption = {
  value: number;
  label: string;
};

type SegmentedPillsProps = {
  value?: number;
  onChange?: (value: number) => void;
  options: SegmentedOption[];
};

export const SegmentedPills = ({ value, onChange, options }: SegmentedPillsProps) => (
  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
    {options.map((option) => {
      const active = value === option.value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange?.(option.value)}
          style={{
            border: `1px solid ${active ? DIALOG_COLORS.ink : DIALOG_COLORS.line}`,
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 12.5,
            fontFamily: DIALOG_SANS,
            cursor: "pointer",
            background: active ? DIALOG_COLORS.ink : "transparent",
            color: active ? "#F2F3EE" : DIALOG_COLORS.text,
            transition: "all 0.16s ease",
          }}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export const PRODUCT_UNIT_OPTIONS = [
  { value: 1, label: "Adet" },
  { value: 2, label: "Kg" },
  { value: 3, label: "Lt" },
  { value: 4, label: "Paket" },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 1, label: "Aktif" },
  { value: 2, label: "Pasif" },
  { value: 3, label: "Üretimi durduruldu" },
];

export const formatDecimalDisplay = (value?: number | string) => {
  if (value === undefined || value === null || value === "") return "";
  const str = String(value);
  const [intPart, decPart] = str.split(".");
  const negative = intPart.startsWith("-");
  const digits = negative ? intPart.slice(1) : intPart;
  const withThousands = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const signed = negative ? `-${withThousands}` : withThousands;
  return decPart !== undefined ? `${signed},${decPart}` : signed;
};

export const parseDecimalDisplay = (displayValue?: string) => {
  if (!displayValue) return "";
  return displayValue.replace(/\./g, "").replace(",", ".");
};

export const formatTl = (n: number) =>
  `₺${n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type UnitEconomicsPanelProps = {
  price: number;
  cost: number;
};

export const UnitEconomicsPanel = ({ price, cost }: UnitEconomicsPanelProps) => {
  const profit = price - cost;
  const marginPct = price > 0 ? (profit / price) * 100 : 0;
  const costWidthPct = price > 0 ? Math.max(Math.min((cost / price) * 100, 100), 0) : 100;
  const profitWidthPct = 100 - costWidthPct;
  const marginLabel =
    price === 0 ? "Fiyat bekleniyor" : profit < 0 ? "Maliyet satışı aşıyor" : `%${marginPct.toFixed(1).replace(".", ",")} marj`;
  const marginColor = price === 0 ? "rgba(242,243,238,0.6)" : profit < 0 ? DIALOG_COLORS.rust : DIALOG_COLORS.lime;

  return (
    <div style={{ marginTop: 16, background: DIALOG_COLORS.ink, color: "#F2F3EE", borderRadius: 12, padding: "15px 17px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 11 }}>
        <span
          style={{
            fontFamily: DIALOG_MONO,
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(242,243,238,0.45)",
          }}
        >
          Birim ekonomisi
        </span>
        <span style={{ fontFamily: DIALOG_MONO, fontSize: 14, color: marginColor }}>{marginLabel}</span>
      </div>
      <div style={{ display: "flex", height: 9, gap: 2 }}>
        <span style={{ display: "block", borderRadius: 3, background: "#F2F3EE", width: `${costWidthPct}%`, transition: "width 0.3s ease" }} />
        <span style={{ display: "block", borderRadius: 3, background: DIALOG_COLORS.lime, width: `${profitWidthPct}%`, transition: "width 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 11, fontSize: 11.5, color: "rgba(242,243,238,0.55)" }}>
        <span>
          Maliyet
          <b style={{ fontFamily: DIALOG_MONO, fontWeight: 500, fontSize: 13, color: "#F2F3EE", display: "block", marginTop: 2 }}>
            {formatTl(cost)}
          </b>
        </span>
        <span>
          Birim kâr
          <b style={{ fontFamily: DIALOG_MONO, fontWeight: 500, fontSize: 13, color: "#F2F3EE", display: "block", marginTop: 2 }}>
            {formatTl(profit)}
          </b>
        </span>
      </div>
    </div>
  );
};

type FeaturedSwitchRowProps = {
  children: ReactNode;
};

export const DialogSwitchRow = ({ children }: FeaturedSwitchRowProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      border: `1px solid ${DIALOG_COLORS.line}`,
      borderRadius: 12,
      padding: "13px 15px",
    }}
  >
    {children}
  </div>
);

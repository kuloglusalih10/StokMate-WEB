import type { ThemeConfig } from "antd";
import { BRAND_COLORS } from "./colors";

const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_COLORS.primary,
    colorText: BRAND_COLORS.secondary,
    colorTextBase: BRAND_COLORS.secondary,
    colorTextLightSolid: BRAND_COLORS.white,
    colorLink: BRAND_COLORS.secondary,
    colorLinkHover: BRAND_COLORS.accent,
    colorLinkActive: BRAND_COLORS.accent,
    colorWarning: BRAND_COLORS.accent,
    colorBgBase: BRAND_COLORS.white,
    colorBgContainer: BRAND_COLORS.white,
    colorBgLayout: BRAND_COLORS.white,
    colorBgElevated: BRAND_COLORS.white,
    fontFamily: "Inter, sans-serif",
  },
  components: {
    Input: {
      hoverBorderColor: BRAND_COLORS.secondary,
      activeBorderColor: BRAND_COLORS.secondary,
      activeShadow: "0 0 0 2px rgba(14, 15, 12, 0.12)",
    },
    Select: {
      hoverBorderColor: BRAND_COLORS.secondary,
      activeBorderColor: BRAND_COLORS.secondary,
      activeOutlineColor: "rgba(14, 15, 12, 0.12)",
    },
    InputNumber: {
      hoverBorderColor: BRAND_COLORS.secondary,
      activeBorderColor: BRAND_COLORS.secondary,
      activeShadow: "0 0 0 2px rgba(14, 15, 12, 0.12)",
      handleHoverColor: BRAND_COLORS.secondary,
    },
    Menu: {
      itemHeight: 48,
      fontSize: 16,
      iconSize: 22,
      collapsedIconSize: 24,
      darkItemColor: "rgba(255, 255, 255, 0.75)",
      darkItemHoverColor: BRAND_COLORS.white,
      darkItemHoverBg: "rgba(255, 255, 255, 0.08)",
      darkItemSelectedColor: BRAND_COLORS.secondary,
      darkItemSelectedBg: BRAND_COLORS.primary,
    },
    Pagination: {
      itemActiveBg: BRAND_COLORS.secondary,
      colorPrimary: BRAND_COLORS.white,
      colorPrimaryHover: BRAND_COLORS.white,
    },
    Button: {
      defaultBorderColor: "#D9D9D9",
      defaultHoverColor: BRAND_COLORS.secondary,
      defaultHoverBorderColor: "#D9D9D9",
      defaultHoverBg: BRAND_COLORS.white,
      defaultActiveColor: BRAND_COLORS.secondary,
      defaultActiveBorderColor: "#D9D9D9",
      defaultActiveBg: BRAND_COLORS.white,
      colorError: "#CF1322",
      colorErrorHover: "#A8071A",
      colorErrorActive: "#820014",
      dangerColor: BRAND_COLORS.white,
    },
  },
};

export default antdTheme;

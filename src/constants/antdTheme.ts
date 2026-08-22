import type { ThemeConfig } from "antd";
import { BRAND_COLORS } from "./colors";

const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_COLORS.primary,
    colorText: BRAND_COLORS.secondary,
    colorTextBase: BRAND_COLORS.secondary,
    colorTextLightSolid: BRAND_COLORS.secondary,
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
<<<<<<< Updated upstream
=======
  components: {
    Input: {
      hoverBorderColor: BRAND_COLORS.secondary,
    },
  },
>>>>>>> Stashed changes
};

export default antdTheme;

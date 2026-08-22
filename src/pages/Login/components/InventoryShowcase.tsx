import { BRAND_COLORS } from "../../../constants/colors";
import logoLockup from "../../../assets/stokmate-lockup-duo-notagline.svg";

const CategoryRow = ({
  color,
  label,
  width,
}: {
  color: string;
  label: string;
  width: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        flex: "0 0 auto",
      }}
    />
    <span style={{ fontSize: 11, color: "#171717", width: 58, flex: "0 0 auto" }}>
      {label}
    </span>
    <div
      style={{
        flex: 1,
        height: 5,
        background: "#EBEBEB",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div style={{ width, height: "100%", background: color }} />
    </div>
  </div>
);

const LegendRow = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        flex: "0 0 auto",
      }}
    />
    <span style={{ fontSize: 10, color: "#5C5C5C" }}>{label}</span>
  </div>
);

const PhoneDashboard = () => (
  <div
    style={{
      position: "absolute",
      left: 127,
      top: 60,
      width: 210,
      height: 430,
      borderRadius: 34,
      background: "#1C1D19",
      border: "6px solid #1C1D19",
      boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
      transform: "rotate(-4deg)",
      zIndex: 2,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
        borderRadius: 28,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "18px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: BRAND_COLORS.secondary }}>
          Envanter
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z"
            stroke="#5C5C5C"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21A2 2 0 0 1 10.27 21"
            stroke="#5C5C5C"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <div
          style={{
            background: "#F7F7F7",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: BRAND_COLORS.secondary,
          }}
        >
          247 Ürün
        </div>
        <div
          style={{
            background: "rgba(255,90,31,0.12)",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: BRAND_COLORS.accent,
          }}
        >
          12 Kritik
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#A3A3A3", letterSpacing: "0.04em" }}>
          KATEGORİ DAĞILIMI
        </span>
        <CategoryRow color={BRAND_COLORS.primary} label="Elektronik" width="76%" />
        <CategoryRow color={BRAND_COLORS.accent} label="Gıda" width="48%" />
        <CategoryRow color={BRAND_COLORS.secondary} label="Giyim" width="42%" />
      </div>

      <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #EBEBEB" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#A3A3A3", letterSpacing: "0.04em" }}>
          STOK HAREKETİ
        </span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 46, marginTop: 10 }}>
          {[40, 65, 50, 85, 100].map((height, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${height}%`,
                background: index === 4 ? BRAND_COLORS.primary : "#EBEBEB",
                borderRadius: "3px 3px 0 0",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TotalProductsCard = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 6,
      width: 168,
      background: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      transform: "rotate(-7deg)",
      zIndex: 3,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <span style={{ fontSize: 10, fontWeight: 700, color: "#A3A3A3", letterSpacing: "0.04em" }}>
      TOPLAM ÜRÜN
    </span>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 28, fontWeight: 800, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>
        247
      </span>
      <span style={{ fontSize: 12, color: "#5C5C5C" }}>aktif</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: BRAND_COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 16L11 9L15 13L20 6"
            stroke={BRAND_COLORS.secondary}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 6H20V12"
            stroke={BRAND_COLORS.secondary}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#171717" }}>+18 bu ay</span>
    </div>
  </div>
);

const LowStockCard = () => (
  <div
    style={{
      position: "absolute",
      left: 312,
      top: 230,
      width: 196,
      background: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      transform: "rotate(6deg)",
      zIndex: 3,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L22 20H2L12 3Z" stroke={BRAND_COLORS.accent} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 10V14" stroke={BRAND_COLORS.accent} strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.9" fill={BRAND_COLORS.accent} />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLORS.secondary }}>Düşük Stok</span>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ fontSize: 24, fontWeight: 800, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>
        12
      </span>
      <span style={{ fontSize: 12, color: "#5C5C5C" }}>ürün</span>
    </div>
    <div
      style={{
        alignSelf: "flex-start",
        background: "rgba(255,90,31,0.12)",
        color: BRAND_COLORS.accent,
        fontSize: 10,
        fontWeight: 700,
        padding: "4px 9px",
        borderRadius: 999,
      }}
    >
      Kritik seviye
    </div>
  </div>
);

const CategoryDonutCard = () => (
  <div
    style={{
      position: "absolute",
      left: 78,
      top: 400,
      width: 220,
      background: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      transform: "rotate(-3deg)",
      zIndex: 4,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <svg width="66" height="66" viewBox="0 0 80 80">
      <g transform="rotate(-90 40 40)">
        <circle cx="40" cy="40" r="30" fill="none" stroke="#F0F0F0" strokeWidth="10" />
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke={BRAND_COLORS.primary}
          strokeWidth="10"
          strokeDasharray="71.6 188.5"
          strokeDashoffset="0"
        />
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke={BRAND_COLORS.accent}
          strokeWidth="10"
          strokeDasharray="45.2 188.5"
          strokeDashoffset="-71.6"
        />
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke={BRAND_COLORS.secondary}
          strokeWidth="10"
          strokeDasharray="39.6 188.5"
          strokeDashoffset="-116.8"
        />
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="#C9C9C9"
          strokeWidth="10"
          strokeDasharray="32.1 188.5"
          strokeDashoffset="-156.4"
        />
      </g>
    </svg>
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: BRAND_COLORS.secondary, marginBottom: 2 }}>
        Kategori Dağılımı
      </span>
      <LegendRow color={BRAND_COLORS.primary} label="Elektronik · 38%" />
      <LegendRow color={BRAND_COLORS.accent} label="Gıda · 24%" />
      <LegendRow color={BRAND_COLORS.secondary} label="Giyim · 21%" />
      <LegendRow color="#C9C9C9" label="Diğer · 17%" />
    </div>
  </div>
);

const FloatingComposition = () => (
  <div style={{ position: "relative", width: 508, height: 520, flex: "0 0 auto" }}>
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ position: "absolute", top: 0, right: 6 }} fill="none">
      <path d="M12 2V22M2 12H22" stroke={BRAND_COLORS.primary} strokeWidth="2" strokeLinecap="round" />
    </svg>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: BRAND_COLORS.accent,
      }}
    />

    <PhoneDashboard />
    <TotalProductsCard />
    <LowStockCard />
    <CategoryDonutCard />
  </div>
);

const InventoryShowcase = () => (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      padding: 56,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      background: BRAND_COLORS.secondary,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -120,
        left: -100,
        width: 420,
        height: 420,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(215,254,71,0.20) 0%, rgba(215,254,71,0) 70%)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -160,
        right: -140,
        width: 520,
        height: 520,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,90,31,0.16) 0%, rgba(255,90,31,0) 70%)",
        pointerEvents: "none",
      }}
    />
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
      <defs>
        <pattern id="dotgrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.06)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotgrid)" />
    </svg>

    <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
      <img src={logoLockup} alt="StokMate" style={{ height: 44, width: "auto", flex: "0 0 auto", alignSelf: "flex-start" }} />

      <div style={{ marginTop: 64, flex: "0 0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 46, lineHeight: 1.12, fontWeight: 800, letterSpacing: "-0.02em" }}>
          <span style={{ color: BRAND_COLORS.primary }}>Stoklarınızı Anlık</span>
          <br />
          <span style={{ color: "#FFFFFF" }}>Kontrol Altında Tutun</span>
        </h1>
        <p
          style={{
            margin: "18px 0 0",
            maxWidth: 420,
            fontSize: 15,
            lineHeight: 1.6,
            fontWeight: 400,
            color: "rgba(255,255,255,0.62)",
          }}
        >
          Ürün, kategori ve tedarikçi verilerinizi tek panelden yönetin; kritik stok
          seviyelerini anında görün.
        </p>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
        <FloatingComposition />
      </div>
    </div>
  </div>
);

export default InventoryShowcase;

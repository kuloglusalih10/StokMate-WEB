import { useEffect, useState } from "react";
import logoLockup from "../../../assets/stokmate-lockup-duo-notagline.svg";

const COLORS = {
  ink: "#0A0B09",
  ink2: "#101210",
  ink3: "#181B17",
  lime: "#CCF54B",
  amber: "#E6952B",
  red: "#CE4630",
  paper: "#FFFFFF",
  paper2: "#ECEBE6",
  mute: "#7C837A",
  line: "rgba(255,255,255,.09)",
};

const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const keyframesStyle = `
@keyframes sm-pulse{0%{box-shadow:0 0 0 0 rgba(204,245,75,.5)}70%{box-shadow:0 0 0 9px rgba(204,245,75,0)}100%{box-shadow:0 0 0 0 rgba(204,245,75,0)}}
@keyframes sm-pop{from{opacity:0;transform:translate(var(--fx,0),var(--fy,26px)) scale(.9)}to{opacity:1;transform:none}}
@keyframes sm-float{0%,100%{transform:rotate(var(--r,0deg)) translateY(0)}50%{transform:rotate(var(--r,0deg)) translateY(-8px)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

const Pop = ({
  children,
  style,
  fx = "0",
  fy = "26px",
  delay = "0s",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  fx?: string;
  fy?: string;
  delay?: string;
}) => (
  <div
    style={{
      position: "absolute",
      animation: `sm-pop .8s cubic-bezier(.2,.85,.25,1) both`,
      animationDelay: delay,
      ...style,
    }}
    // @ts-expect-error CSS custom properties
    // eslint-disable-next-line react/no-unknown-property
    ref={(el) => {
      if (el) {
        el.style.setProperty("--fx", fx);
        el.style.setProperty("--fy", fy);
      }
    }}
  >
    {children}
  </div>
);

const Float = ({
  children,
  r = "0deg",
  d = "9s",
  style,
}: {
  children: React.ReactNode;
  r?: string;
  d?: string;
  style?: React.CSSProperties;
}) => {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (el) {
      el.style.setProperty("--r", r);
      el.style.setProperty("--d", d);
    }
  }, [el, r, d]);
  return (
    <div
      ref={setEl}
      style={{
        animation: `sm-float var(--d,9s) ease-in-out infinite`,
        transform: `rotate(var(--r,0deg))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const LaptopScreen = () => (
  <div
    style={{
      width: 474,
      height: 298,
      borderRadius: 13,
      border: "1px solid rgba(255,255,255,.12)",
      background: COLORS.ink2,
      overflow: "hidden",
      boxShadow: "0 44px 90px rgba(0,0,0,.62)",
    }}
  >
    {/* Chrome bar */}
    <div
      style={{
        height: 28,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 11px",
        background: "#1B1E1A",
        borderBottom: "1px solid rgba(255,255,255,.07)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <i
          key={i}
          style={{
            display: "block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(255,255,255,.18)",
            flex: "none",
          }}
        />
      ))}
      <span
        style={{
          marginLeft: 8,
          flex: 1,
          height: 16,
          borderRadius: 8,
          background: "rgba(255,255,255,.06)",
          fontSize: 8.5,
          color: "#868D83",
          display: "flex",
          alignItems: "center",
          padding: "0 9px",
          letterSpacing: ".02em",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontFamily: MONO,
        }}
      >
        stokmate.app/istatistikler
      </span>
    </div>

    {/* App content */}
    <div style={{ display: "flex", height: 270 }}>
      {/* Sidebar */}
      <div
        style={{
          width: 94,
          flex: "none",
          borderRight: "1px solid rgba(255,255,255,.07)",
          padding: "12px 9px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 9,
            fontSize: 10,
            fontWeight: 700,
            whiteSpace: "nowrap",
            color: "#fff",
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 4,
              background: COLORS.lime,
              flex: "none",
              display: "block",
            }}
          />
          StokMate
        </div>
        {["Ürünler", "İstatistikler", "Tanımlar"].map((n, i) => (
          <div
            key={n}
            style={{
              fontSize: 9,
              color: i === 1 ? COLORS.ink : "#868D83",
              padding: "5px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              background: i === 1 ? COLORS.lime : "transparent",
              fontWeight: i === 1 ? 600 : 400,
            }}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Board */}
      <div style={{ flex: 1, padding: "12px 13px", minWidth: 0 }}>
        <div
          style={{
            fontSize: 7.5,
            letterSpacing: ".12em",
            color: "#767D72",
            whiteSpace: "nowrap",
            fontFamily: MONO,
          }}
        >
          ENVANTER ÖZETİ · 26 AĞUSTOS 2026
        </div>
        <h3
          style={{
            margin: "4px 0 10px",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-.03em",
            color: "#fff",
          }}
        >
          İstatistikler
        </h3>

        {/* Value card */}
        <div
          style={{
            background: "#000",
            borderRadius: 10,
            padding: "11px 12px",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <div
            style={{
              fontSize: 7.5,
              letterSpacing: ".12em",
              color: "#767D72",
              whiteSpace: "nowrap",
              fontFamily: MONO,
            }}
          >
            DEPODAKİ TOPLAM DEĞER
          </div>
          <div
            style={{
              fontSize: 29,
              fontWeight: 700,
              letterSpacing: "-.04em",
              margin: "2px 0 9px",
              lineHeight: 1,
              color: "#fff",
              fontFamily: MONO,
            }}
          >
            ₺544.837
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 3,
              background: "#fff",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "block",
                height: "100%",
                background: COLORS.lime,
                width: "23%",
                marginLeft: "auto",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 15,
              marginTop: 8,
              fontSize: 8,
              color: "#949A90",
              whiteSpace: "nowrap",
              fontFamily: MONO,
            }}
          >
            <span>
              Maliyet
              <b style={{ color: "#fff", fontWeight: 600, display: "block", fontSize: 9.5, marginTop: 2 }}>
                ₺421.805
              </b>
            </span>
            <span>
              Potansiyel
              <b style={{ color: "#fff", fontWeight: 600, display: "block", fontSize: 9.5, marginTop: 2 }}>
                ₺123.032
              </b>
            </span>
            <span>
              Marj
              <b style={{ color: "#fff", fontWeight: 600, display: "block", fontSize: 9.5, marginTop: 2 }}>
                %22,6
              </b>
            </span>
          </div>
        </div>

        {/* Health */}
        <div style={{ marginTop: 11 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 7.5,
              letterSpacing: ".1em",
              color: "#767D72",
              marginBottom: 7,
              fontFamily: MONO,
            }}
          >
            <span>STOK SAĞLIĞI</span>
            <span>80 ÜRÜN</span>
          </div>
          {[
            { label: "İçecek", pattern: ["r", "a", "a", "", "", "", "", "", "", ""] },
            { label: "Kahvaltılık", pattern: ["r", "a", "", "", "", "", "", "", "", ""] },
            { label: "Temizlik", pattern: ["r", "r", "a", "a", "", "", "", "", "", ""] },
            { label: "Kâğıt Ürün.", pattern: ["r", "r", "a", "a", "", "", "", "", "", ""] },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  width: 50,
                  flex: "none",
                  fontSize: 7.5,
                  color: "#767D72",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: MONO,
                }}
              >
                {row.label}
              </span>
              <div style={{ flex: 1, display: "flex", gap: 3 }}>
                {row.pattern.map((t, i) => (
                  <i
                    key={i}
                    style={{
                      display: "block",
                      height: 8,
                      flex: 1,
                      borderRadius: 2,
                      background:
                        t === "r"
                          ? COLORS.red
                          : t === "a"
                            ? COLORS.amber
                            : "rgba(216,231,223,.16)",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PhoneDevice = () => (
  <div
    style={{
      width: 176,
      height: 352,
      borderRadius: 28,
      background: "#1A1C19",
      padding: 6,
      boxShadow: "0 36px 74px rgba(0,0,0,.66), 0 0 0 1px rgba(255,255,255,.08)",
    }}
  >
    <div
      style={{
        height: "100%",
        borderRadius: 23,
        overflow: "hidden",
        background: COLORS.paper2,
        color: COLORS.ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Phone top */}
      <div
        style={{
          background: "#000",
          padding: "11px 11px 11px",
          borderRadius: "0 0 15px 15px",
          flex: "none",
        }}
      >
        <div
          style={{
            width: 50,
            height: 12,
            borderRadius: 7,
            background: "#0C0D0B",
            margin: "-5px auto 9px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 9,
          }}
        >
          <em
            style={{
              display: "block",
              width: 18,
              height: 18,
              borderRadius: 6,
              background: COLORS.lime,
              flex: "none",
            }}
          />
          <b style={{ fontSize: 11, color: "#fff", fontWeight: 700, letterSpacing: "-.01em" }}>
            Stok<span style={{ color: COLORS.lime }}>Mate</span>
          </b>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 7.5,
              color: "#868D83",
              letterSpacing: ".04em",
              whiteSpace: "nowrap",
              fontFamily: MONO,
            }}
          >
            DEPO 01
          </span>
        </div>
        <div
          style={{
            height: 25,
            borderRadius: 9,
            background: "rgba(255,255,255,.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 9px",
            fontSize: 8.5,
            color: "#7B8278",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          Ürün, SKU veya barkod
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
          {[
            { label: "Tüm ürünler 80", on: true },
            { label: "Kritik 14", on: false },
          ].map((c) => (
            <span
              key={c.label}
              style={{
                fontSize: 8.5,
                padding: "4px 9px",
                borderRadius: 20,
                border: c.on ? `1px solid ${COLORS.lime}` : "1px solid rgba(255,255,255,.13)",
                color: c.on ? COLORS.ink : "#9AA096",
                background: c.on ? COLORS.lime : "transparent",
                fontWeight: c.on ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div
        style={{
          padding: 8,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {[
          {
            gradient: "linear-gradient(135deg,#C9D4CB,#8FA396)",
            cat: "İçecek",
            catBg: "#E7EFF6",
            catColor: "#3C5A72",
            name: "Coca-Cola 1 L",
            qty: "240",
            unit: "adet",
            zero: false,
          },
          {
            gradient: "linear-gradient(135deg,#BFD2E0,#6E8CA6)",
            cat: "Kişisel Bakım",
            catBg: "#EFE9F7",
            catColor: "#5B437E",
            name: "Duru Sabun",
            qty: "180",
            unit: "adet",
            zero: false,
          },
          {
            gradient: "linear-gradient(135deg,#E3D9C6,#B9A17C)",
            cat: "Kahvaltılık",
            catBg: "#F7EFE2",
            catColor: "#7A5A2E",
            name: "Pınar Zeytin",
            qty: "66",
            unit: "adet",
            zero: false,
          },
          {
            gradient: "linear-gradient(135deg,#D9D3C6,#9C9384)",
            cat: "Kâğıt Ürünleri",
            catBg: "#EFEFEA",
            catColor: "#5D645B",
            name: "Selpak Mendil",
            qty: "0",
            unit: "yok",
            zero: true,
          },
        ].map((p) => (
          <div
            key={p.name}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 8,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <em
              style={{
                display: "block",
                width: 26,
                height: 26,
                borderRadius: 7,
                flex: "none",
                background: p.gradient,
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <span
                style={{
                  fontSize: 7,
                  padding: "2px 5px",
                  borderRadius: 3,
                  background: p.catBg,
                  color: p.catColor,
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >
                {p.cat}
              </span>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  marginTop: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.name}
              </div>
            </div>
            <div
              style={{
                flex: "none",
                width: 30,
                textAlign: "right",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "-.02em",
                lineHeight: 1.1,
                color: p.zero ? COLORS.red : COLORS.ink,
              }}
            >
              {p.qty}
              <span
                style={{
                  display: "block",
                  fontSize: 7,
                  color: "#8B9187",
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                {p.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CriticalStockCard = () => (
  <Float r="3deg" d="8.5s">
    <div
      style={{
        background: "#fff",
        color: COLORS.ink,
        borderRadius: 14,
        padding: "13px 14px",
        boxShadow: "0 28px 58px rgba(0,0,0,.42), 0 2px 0 rgba(0,0,0,.05)",
        width: 224,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 600 }}>
        <i
          style={{
            display: "block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: COLORS.amber,
            flex: "none",
          }}
        />
        Kritik stok
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "-.04em",
          margin: "7px 0 3px",
          lineHeight: 1,
        }}
      >
        14 <small style={{ fontSize: 11, fontWeight: 500, color: "#8B9187", letterSpacing: 0 }}>ürün</small>
      </div>
      <div
        style={{
          fontSize: 8.5,
          letterSpacing: ".1em",
          color: "#8B9187",
          whiteSpace: "nowrap",
          fontFamily: MONO,
        }}
      >
        EŞİK ALTINDA
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#EEEDE8", overflow: "hidden", marginTop: 9 }}>
        <div style={{ display: "block", height: "100%", width: "35%", background: COLORS.amber }} />
      </div>
    </div>
  </Float>
);

const Last30DaysCard = () => (
  <Float r="4deg" d="10.5s">
    <div
      style={{
        padding: "11px 14px",
        borderRadius: 12,
        background: COLORS.ink3,
        border: "1px solid rgba(255,255,255,.1)",
        color: "#fff",
        boxShadow: "0 24px 44px rgba(0,0,0,.55)",
      }}
    >
      <div
        style={{
          fontSize: 8,
          letterSpacing: ".11em",
          color: "#868D83",
          whiteSpace: "nowrap",
          fontFamily: MONO,
        }}
      >
        SON 30 GÜN
      </div>
      <b style={{ display: "block", fontSize: 17, fontWeight: 700, letterSpacing: "-.03em", marginTop: 4, whiteSpace: "nowrap" }}>
        <span style={{ color: COLORS.lime }}>+4</span> yeni ürün
      </b>
    </div>
  </Float>
);

const StockUpdateCard = () => (
  <Float r="-3deg" d="11.5s">
    <div
      style={{
        background: "#fff",
        color: COLORS.ink,
        borderRadius: 14,
        padding: "13px 14px",
        boxShadow: "0 28px 58px rgba(0,0,0,.42), 0 2px 0 rgba(0,0,0,.05)",
        width: 212,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-.02em" }}>Stok güncelle</div>
      <div
        style={{
          fontSize: 8,
          color: "#8B9187",
          marginTop: 3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily: MONO,
        }}
      >
        Doğadan Filtre Kahve · KAH-1020
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "11px 0 10px" }}>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            background: "#fff",
            border: "1px solid #E3E2DC",
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#5D645B",
          }}
        >
          −
        </span>
        <b
          style={{
            flex: 1,
            height: 32,
            border: `1.5px solid ${COLORS.ink}`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          34
        </b>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            background: "#fff",
            border: "1px solid #E3E2DC",
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#5D645B",
          }}
        >
          +
        </span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {["Sayım", "Giriş", "Fire"].map((tab, i) => (
          <span
            key={tab}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 8.5,
              padding: "6px 0",
              borderRadius: 7,
              background: i === 0 ? COLORS.ink : "#F2F1EC",
              color: i === 0 ? "#fff" : "#5D645B",
              fontWeight: i === 0 ? 600 : 400,
              whiteSpace: "nowrap",
            }}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  </Float>
);

const ProductInfoCard = () => (
  <Float r="-2deg" d="9.5s" style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{
        background: "#fff",
        color: COLORS.ink,
        borderRadius: 14,
        padding: "13px 14px",
        boxShadow: "0 28px 58px rgba(0,0,0,.42), 0 2px 0 rgba(0,0,0,.05)",
        width: 292,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <em
        style={{
          display: "block",
          width: 42,
          height: 42,
          borderRadius: 10,
          flex: "none",
          background: "linear-gradient(135deg,#D8C9A8,#A9865C)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 8,
            padding: "2px 6px",
            borderRadius: 4,
            background: "#F7EFE2",
            color: "#7A5A2E",
            whiteSpace: "nowrap",
          }}
        >
          Kahvaltılık
        </span>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-.02em",
            marginTop: 5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Doğadan Filtre Kahve 250 g
        </div>
        <div
          style={{
            fontSize: 8.5,
            color: "#8B9187",
            marginTop: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: MONO,
          }}
        >
          KAH-1020 · Ege Toptan Ticaret
        </div>
      </div>
      <div style={{ flex: "none", textAlign: "right" }}>
        <b style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1 }}>34</b>
        <span
          style={{
            display: "block",
            fontSize: 8,
            color: "#8B9187",
            marginTop: 2,
            fontFamily: MONO,
          }}
        >
          paket
        </span>
      </div>
    </div>
  </Float>
);

const SupplierDonutCard = () => (
  <Float r="2deg" d="12.5s">
    <div
      style={{
        background: "#fff",
        color: COLORS.ink,
        borderRadius: 14,
        padding: "13px 14px",
        boxShadow: "0 28px 58px rgba(0,0,0,.42), 0 2px 0 rgba(0,0,0,.05)",
        width: 258,
      }}
    >
      <div
        style={{
          fontSize: 8.5,
          letterSpacing: ".1em",
          color: "#8B9187",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 9,
          fontFamily: MONO,
        }}
      >
        TEDARİKÇİ DAĞILIMI · 6 FİRMA
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <svg width="62" height="62" viewBox="0 0 42 42" style={{ flex: "none" }}>
          <circle cx="21" cy="21" r="15.9" fill="none" stroke="#EEEDE8" strokeWidth="7" />
          <circle
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke="#175E56"
            strokeWidth="7"
            strokeDasharray="22.5 77.5"
            strokeDashoffset="25"
          />
          <circle
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke="#2E7D72"
            strokeWidth="7"
            strokeDasharray="21.3 78.7"
            strokeDashoffset="2.5"
          />
          <circle
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke="#5FA79C"
            strokeWidth="7"
            strokeDasharray="17.5 82.5"
            strokeDashoffset="-18.8"
          />
          <circle
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke="#9AC7BF"
            strokeWidth="7"
            strokeDasharray="15 85"
            strokeDashoffset="-36.3"
          />
        </svg>
        <div
          style={{
            fontSize: 8.8,
            color: "#5D645B",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
            minWidth: 0,
            fontFamily: MONO,
          }}
        >
          {[
            { color: "#175E56", label: "Karadeniz Toptan", pct: "%22,5" },
            { color: "#2E7D72", label: "Anadolu Gıda", pct: "%21,3" },
            { color: "#5FA79C", label: "Marmara Lojistik", pct: "%17,5" },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <i
                style={{
                  display: "block",
                  width: 6,
                  height: 6,
                  borderRadius: 2,
                  flex: "none",
                  background: s.color,
                }}
              />
              {s.label}
              <b style={{ marginLeft: "auto", color: COLORS.ink }}>{s.pct}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  </Float>
);

const BadgeChip = () => (
  <Float r="-8deg" d="7.5s">
    <div
      style={{
        padding: "9px 14px",
        borderRadius: 20,
        background: COLORS.lime,
        fontSize: 10,
        fontWeight: 700,
        color: COLORS.ink,
        whiteSpace: "nowrap",
        boxShadow: "0 18px 36px rgba(204,245,75,.24)",
      }}
    >
      Eşiğin üzerinde
    </div>
  </Float>
);

const Scene = () => (
  <div
    style={{
      position: "relative",
      width: "100%",
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        position: "relative",
        flex: "none",
        width: 760,
        height: 560,
        transform: "scale(var(--scene-s, 0.94))",
        transformOrigin: "center center",
      }}
    >
      {/* Laptop */}
      <Pop style={{ left: 8, top: 30, zIndex: 2 }} fx="-24px" fy="28px" delay=".05s">
        <Float r="0deg" d="12s">
          <LaptopScreen />
          <div
            style={{
              width: 524,
              height: 10,
              marginLeft: -25,
              borderRadius: "0 0 10px 10px",
              background: "linear-gradient(#2B2F29,#141613)",
              boxShadow: "0 18px 34px rgba(0,0,0,.55)",
            }}
          >
            <div
              style={{
                width: 66,
                height: 3,
                margin: "0 auto",
                borderRadius: "0 0 3px 3px",
                background: "rgba(255,255,255,.1)",
              }}
            />
          </div>
        </Float>
      </Pop>

      {/* Phone */}
      <Pop style={{ left: 392, top: 148, zIndex: 3 }} fx="30px" fy="32px" delay=".18s">
        <Float r="-2deg" d="9.5s">
          <PhoneDevice />
        </Float>
      </Pop>

      {/* Critical stock card */}
      <Pop style={{ left: 500, top: 18, zIndex: 4 }} fx="-34px" fy="30px" delay=".36s">
        <CriticalStockCard />
      </Pop>

      {/* Last 30 days */}
      <Pop style={{ left: 576, top: 170, zIndex: 5 }} fx="-20px" fy="-24px" delay=".46s">
        <Last30DaysCard />
      </Pop>

      {/* Stock update */}
      <Pop style={{ left: 552, top: 288, zIndex: 5 }} fx="36px" fy="34px" delay=".56s">
        <StockUpdateCard />
      </Pop>

      {/* Product info card */}
      <Pop style={{ left: 26, top: 368, zIndex: 5 }} fx="-30px" fy="36px" delay=".66s">
        <ProductInfoCard />
      </Pop>

      {/* Supplier donut */}
      <Pop style={{ left: 48, top: 452, zIndex: 4 }} fx="0" fy="34px" delay=".74s">
        <SupplierDonutCard />
      </Pop>

      {/* Badge */}
      <Pop style={{ left: 334, top: 482, zIndex: 6 }} fx="-18px" fy="18px" delay=".84s">
        <BadgeChip />
      </Pop>
    </div>
  </div>
);

const InventoryShowcase = () => (
  <aside
    style={{
      position: "relative",
      overflow: "hidden",
      background: COLORS.ink,
      color: "#fff",
      padding: "44px 48px 34px",
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr)",
      gridTemplateRows: "auto auto 1fr auto",
      gap: 24,
      isolation: "isolate",
      width: "100%",
      height: "100%",
      fontFamily: "'Archivo', system-ui, sans-serif",
    }}
  >
    {/* Injected keyframes */}
    <style>{keyframesStyle}</style>

    {/* Dot grid background */}
    <div
      style={{
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -2,
        backgroundImage: "radial-gradient(rgba(255,255,255,.5) 1px,transparent 1px)",
        backgroundSize: "26px 26px",
        opacity: 0.045,
      }}
    />

    {/* Glow effects */}
    <div
      style={{
        position: "absolute",
        zIndex: -1,
        borderRadius: "50%",
        filter: "blur(100px)",
        pointerEvents: "none",
        width: 560,
        height: 440,
        top: -220,
        left: -180,
        background: "rgba(204,245,75,.15)",
      }}
    />
    <div
      style={{
        position: "absolute",
        zIndex: -1,
        borderRadius: "50%",
        filter: "blur(100px)",
        pointerEvents: "none",
        width: 520,
        height: 420,
        bottom: -240,
        right: -180,
        background: "rgba(206,70,48,.15)",
      }}
    />

    {/* Brand */}
    <div>
      <img src={logoLockup} alt="StokMate" style={{ height: 44, width: "auto" }} />
    </div>

    {/* Pitch */}
    <div>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          margin: "0 0 16px",
          fontSize: 10.5,
          letterSpacing: ".16em",
          color: COLORS.mute,
          fontFamily: MONO,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: COLORS.lime,
            flex: "none",
            animation: "sm-pulse 2.4s ease-out infinite",
          }}
        />
        MASAÜSTÜ + SAHA · TEK STOK
      </p>
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(2.2rem, 3.3vw, 3.2rem)",
          fontWeight: 700,
          lineHeight: 0.96,
          letterSpacing: "-.042em",
        }}
      >
        Panelde ne varsa,
        <br />
        <em style={{ fontStyle: "normal", color: COLORS.lime }}>cebinde de var.</em>
      </h1>
      <p
        style={{
          margin: "15px 0 0",
          maxWidth: "44ch",
          fontSize: 14.5,
          lineHeight: 1.6,
          color: "#9AA096",
        }}
      >
        Depoyu bilgisayardan yönet, rafta telefonla say. Sayım, giriş ve fire aynı anda iki ekrana da düşer.
      </p>
    </div>

    {/* Scene */}
    <Scene />

    {/* Footer strip */}
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 18,
        flexWrap: "wrap",
        borderTop: `1px solid ${COLORS.line}`,
        paddingTop: 15,
        fontSize: 10.5,
        letterSpacing: ".1em",
        color: "#5F665C",
        fontFamily: MONO,
      }}
    >
      <span>© 2026 SALİH KULOĞLU</span>
    </footer>
  </aside>
);

export default InventoryShowcase;

import { useState } from "react";
import { Layout, Menu, Button, ConfigProvider } from "antd";
import { InboxOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../services/auth";
import ConfirmDialog from "../../components/ConfirmDialog";
import iconLime from "../../assets/stokmate-icon-lime.svg";
import logoLockup from "../../assets/stokmate-lockup-duo-notagline.svg";
import { BRAND_COLORS } from "../../constants/colors";

const LOGOUT_RED = {
  base: "#F04438",
  hover: "#D92D20",
  active: "#B42318",
};

const { Sider } = Layout;

type SidebarProps = {
  collapsed: boolean;
  broken: boolean;
  onBreakpoint: (broken: boolean) => void;
  onNavigate?: () => void;
};

const Sidebar = ({ collapsed, broken, onBreakpoint, onNavigate }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const showIconOnly = collapsed && !broken;

  const menuItems = [
    {
      key: "/urunler",
      icon: <InboxOutlined />,
      label: "Ürünler",
    },
    {
      key: "/istatistikler",
      icon: <BarChartOutlined />,
      label: "İstatistikler",
    },
    {
      key: "/definitions",
      icon: <SettingOutlined />,
      label: "Tanımlar",
    },
  ];

  const selectedKey =
    menuItems.find(
      (item) => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`)
    )?.key ?? location.pathname;

  const handleLogout = async () => {
    setLoggingOut(true);
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await logout(refreshToken);
    }

    setLoggingOut(false);
    setLogoutDialogOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast.success("Çıkış yapıldı.");
    navigate("/giris");
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth={broken ? 0 : 72}
      trigger={null}
      collapsed={collapsed}
      onBreakpoint={onBreakpoint}
      width={280}
      style={
        broken
          ? {
              position: "fixed",
              insetInlineStart: 0,
              top: 0,
              bottom: 0,
              height: "100vh",
              overflow: "auto",
              zIndex: 1001,
              background: BRAND_COLORS.secondary,
              boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
            }
          : {
              position: "sticky",
              insetInlineStart: 0,
              top: 0,
              height: "100vh",
              overflow: "auto",
              background: BRAND_COLORS.secondary,
            }
      }
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: showIconOnly ? "center" : "flex-start",
            padding: showIconOnly ? "32px 0 0" : "32px 24px 0",
            marginBottom: 16,
          }}
        >
          {showIconOnly || broken ? (
            <img src={iconLime} alt="StokMate" style={{ height: 36, width: "auto" }} />
          ) : (
            <img src={logoLockup} alt="StokMate" style={{ height: 42, width: "auto" }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Menu
            theme="dark"
            mode="inline"
            inlineCollapsed={collapsed && !broken}
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => {
              navigate(key);
              onNavigate?.();
            }}
            style={{
              background: BRAND_COLORS.secondary,
              borderInlineEnd: "none",
            }}
          />
        </div>
        <div style={{ padding: showIconOnly ? "16px 12px 24px" : "16px 24px 24px" }}>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorError: LOGOUT_RED.base,
                  colorErrorHover: LOGOUT_RED.hover,
                  colorErrorActive: LOGOUT_RED.active,
                  dangerColor: BRAND_COLORS.white,
                },
              },
            }}
          >
            {showIconOnly ? (
              <Button
                type="primary"
                danger
                size="large"
                block
                icon={<LogoutOutlined />}
                onClick={() => setLogoutDialogOpen(true)}
                style={{ padding: 0 }}
              />
            ) : (
              <Button
                type="primary"
                danger
                size="large"
                block
                icon={<LogoutOutlined />}
                onClick={() => setLogoutDialogOpen(true)}
              >
                Çıkış Yap
              </Button>
            )}
            <ConfirmDialog
              open={logoutDialogOpen}
              title="Çıkış yap"
              description="Hesabından çıkış yapmak istediğine emin misin?"
              confirmText="Çıkış Yap"
              cancelText="Vazgeç"
              danger
              loading={loggingOut}
              onConfirm={handleLogout}
              onCancel={() => setLogoutDialogOpen(false)}
            />
          </ConfigProvider>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;

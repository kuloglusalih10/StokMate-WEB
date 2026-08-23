import { Layout, Menu } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import iconLime from "../../assets/stokmate-icon-lime.svg";
import logoLockup from "../../assets/stokmate-lockup-duo-notagline.svg";
import { BRAND_COLORS } from "../../constants/colors";

const { Sider } = Layout;

type SidebarProps = {
  collapsed: boolean;
  broken: boolean;
  onBreakpoint: (broken: boolean) => void;
  onNavigate?: () => void;
};

const menuItems = [
  {
    key: "/urunler",
    icon: <ShoppingOutlined style={{ fontSize: 19 }} />,
    label: "Ürünler",
  },
];

const Sidebar = ({ collapsed, broken, onBreakpoint, onNavigate }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth={0}
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "32px 24px 0",
          marginBottom: 16,
        }}
      >
        {broken ? (
          <img src={iconLime} alt="StokMate" style={{ height: 44, width: "auto" }} />
        ) : (
          <img src={logoLockup} alt="StokMate" style={{ height: 42, width: "auto" }} />
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => {
          navigate(key);
          onNavigate?.();
        }}
        style={{
          background: BRAND_COLORS.secondary,
          borderInlineEnd: "none",
          fontSize: 17,
        }}
      />
    </Sider>
  );
};

export default Sidebar;

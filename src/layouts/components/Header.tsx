import { Layout, Button, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../services/auth";
import { BRAND_COLORS } from "../../constants/colors";

const { Header: AntHeader } = Layout;

type HeaderProps = {
  collapsed: boolean;
  onToggle: () => void;
};

type StoredUser = {
  id: number;
  email: string;
  fullName: string;
};

const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

const Header = ({ collapsed, onToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await logout(refreshToken);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast.success("Çıkış yapıldı.");
    navigate("/giris");
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: BRAND_COLORS.white,
        padding: "0 24px",
        height: 76,
        lineHeight: "normal",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #EFEFEF",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{ fontSize: 20 }}
      />
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <Avatar
            size={38}
            icon={<UserOutlined />}
            style={{ background: BRAND_COLORS.primary, color: BRAND_COLORS.secondary }}
          />
          <span style={{ fontSize: 16, fontWeight: 600, color: BRAND_COLORS.secondary }}>
            {user?.fullName ?? "Kullanıcı"}
          </span>
        </div>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;

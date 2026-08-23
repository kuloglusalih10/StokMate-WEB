import { Layout, Button, Avatar } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
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
  const user = getStoredUser();

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
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
    </AntHeader>
  );
};

export default Header;

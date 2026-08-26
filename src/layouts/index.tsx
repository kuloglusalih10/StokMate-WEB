import { useState } from "react";
import { Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/giris" replace />;
  }

  const handleBreakpoint = (isBroken: boolean) => {
    setBroken(isBroken);
    setCollapsed(isBroken);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        broken={broken}
        onBreakpoint={handleBreakpoint}
        onNavigate={() => {
          if (broken) setCollapsed(true);
        }}
      />
      {broken && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(14,15,12,0.45)",
            zIndex: 1000,
          }}
        />
      )}
      <Layout>
        <Header collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        <Content
          style={{
            margin: broken ? "16px 12px" : 24,
            minHeight: "calc(100vh - 124px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

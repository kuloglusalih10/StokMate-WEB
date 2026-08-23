import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import InventoryShowcase from "./components/InventoryShowcase";
import { login } from "../../services/auth";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: LoginFormValues) => {
    setSubmitting(true);

    const result = await login(values);

    setSubmitting(false);

    if (!result.res) {
      toast.error(result.message);
      return;
    }

    localStorage.setItem("token", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(result.data.user));

    toast.success(`Hoş geldiniz, ${result.data.user.fullName}`);
    navigate("/urunler");
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="hidden lg:flex" style={{ width: "48%" }}>
        <InventoryShowcase />
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div style={{ width: 440 }}>
          <h2 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: "#0E0F0C", letterSpacing: "-0.02em" }}>
            Giriş Yap
          </h2>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "#5C5C5C" }}>
            Hesabınıza kayıtlı e-posta adresiniz ve şifrenizle devam edin.
          </p>

          <Form layout="vertical" onFinish={handleFinish} requiredMark={false} style={{ marginTop: 36 }}>
            <Form.Item
              name="email"
              label={<span style={{ fontSize: 14.5 }}>E-posta</span>}
              rules={[
                { required: true, message: "E-posta adresinizi girin." },
                { type: "email", message: "Geçerli bir e-posta adresi girin." },
              ]}
            >
              <Input
                placeholder="ornek@stokmate.com"
                autoComplete="username"
                style={{ height: 52, fontSize: 15, borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontSize: 14.5 }}>Şifre</span>}
              rules={[{ required: true, message: "Şifrenizi girin." }]}
            >
              <Input.Password
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ height: 52, fontSize: 15, borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                style={{ height: 54, fontSize: 16, borderRadius: 8 }}
              >
                Giriş Yap
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 14, textAlign: "center", fontSize: 14, color: "#5C5C5C" }}>
            Hesabınıza erişemiyor musunuz?{" "}
            <a
              href="mailto:StokeMail@info.com"
              style={{ fontWeight: 700, color: "#0E0F0C", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              Bize Ulaşın
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

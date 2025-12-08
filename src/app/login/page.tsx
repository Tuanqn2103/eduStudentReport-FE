"use client";

import { useState } from "react";
import { Form, Input, Button, Tabs, message, Card } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"teacher" | "parent">("teacher");
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const res: any = await authService.login(role, values);

      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("role", role);

      message.success("Đăng nhập thành công!");

      router.push(`/${role}`);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg" title="Đăng nhập hệ thống">
        <Tabs
          defaultActiveKey="teacher"
          onChange={(key) => setRole(key as any)}
          items={[
            { label: "Giáo viên", key: "teacher" },
            { label: "Phụ huynh", key: "parent" },
          ]}
        />

        <Form onFinish={onFinish} layout="vertical" className="mt-4">
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name={role === "parent" ? "pin" : "password"}
            rules={[{ required: true, message: "Vui lòng nhập thông tin!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={role === "parent" ? "Mã PIN" : "Mật khẩu"}
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}

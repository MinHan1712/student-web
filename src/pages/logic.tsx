import React from 'react';
import { Form, Input, Button, Card, message, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import getApi from '../apis/get.api';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const res = await getApi.login(values);
      localStorage.setItem('token', "1234567879");
      message.success('Đăng nhập thành công!');
      navigate('/faculties');
    } catch (error) {
      notification['error']({
        message: "Lỗi",
        description: 'Sai tài khoản hoặc mật khẩu!',
      });
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Đăng nhập hệ thống" style={{ width: 450 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tài khoản" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block onClick={() =>onFinish}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

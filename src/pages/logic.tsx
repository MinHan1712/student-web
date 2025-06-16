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
    <div style={{
      height: '100vh', display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: 'center',
      backgroundImage: `url(${require('../assets/img/bg-login.jpg')})`,  // Đường dẫn đến ảnh
      backgroundSize: 'cover',  // Ảnh phủ toàn bộ div
      backgroundPosition: 'center', // Căn giữa ảnh
      backgroundRepeat: 'no-repeat',
    }}>
      <img
        src={require('../assets/img/logo_login.png')}
        alt="Logo"
        style={{ width: '20%', marginBottom: 20, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <Card
        title={<h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }}>Đăng nhập</h2>}
        style={{ width: 500, opacity: 0.95, fontSize: '18px' }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ fontSize: '18px' }} // font chữ to cho toàn form
        >
          <Form.Item
            name="username"
            label={<span style={{ fontSize: '18px' }}>Tài khoản</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ fontSize: '18px' }} />}
              placeholder="Tài khoản"
              style={{ fontSize: '18px', height: '40px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ fontSize: '18px' }}>Mật khẩu</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ fontSize: '18px' }} />}
              placeholder="Mật khẩu"
              style={{ fontSize: '18px', height: '40px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ fontSize: '18px', height: '45px' }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
};

export default LoginPage;

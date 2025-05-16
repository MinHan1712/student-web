import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import FooterLayout from '../components/layout/Footer';
import HeaderLayout from '../components/layout/Header';
import SideLayout from '../components/layout/Side';
const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Layout>
        <HeaderLayout toggleCollapsed={toggleCollapsed} />
        <Layout>
          <SideLayout collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content>
            <section style={{ backgroundColor: 'rgb(244, 244, 244', padding: '10px', minHeight: '900px' }}>
              <Outlet></Outlet>
            </section>
            <FooterLayout />
          </Content>
        </Layout>

      </Layout>
    </>
  );
};

export default AppLayout;
import { PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Flex, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '2',
        label: 'Khoa',
        // icon: <img alt="icon sider bar" style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
        children: [
            {
                key: '3',
                label: <Link to="./faculties" className='text-decoration-none'>Danh sách khoa</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/nhap-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '4',
                label: <Link to="./teaches" className='text-decoration-none'>Giảng viên</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/xuat-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            }
        ],

    },
    {
        key: '5',
        label: 'Sinh viên',
        children: [
            {
                key: '13',
                label: <Link to="./students" className='text-decoration-none'>Thông tin sinh viên</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/nhap-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
           
        ],
        // icon: <img alt="icon sider bar" src={require('../../assets/img/sp.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
    },
    {
        key: '9',
        label: 'Quản lý học phần',
        // icon: <img alt="icon sider bar" src={require('../../assets/img/kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
        children: [
            {
                key: '10',
                label: <Link to="./course" className='text-decoration-none'>Học phần</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/nhap-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '11',
                label: <Link to="./classes" className='text-decoration-none'>Lớp học phần</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/nhap-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
        ],

    },
    {
        key: '6',
        label: 'Quản lý điểm',
        // icon: <img alt="icon sider bar" src={require('../../assets/img/kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
        children: [
            {
                key: '7',
                label: <Link to="./grade-score-manager" className='text-decoration-none'>Nhập điểm thi</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/xuat-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '8',
                label: <Link to="./course-score-manager" className='text-decoration-none'>Nhập điểm rèn luyện</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/xuat-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            },
            {
                key: '12',
                label: <Link to="./statistic" className='text-decoration-none'>Thống kê</Link>,
                // icon: <img alt="icon sider bar" src={require('../../assets/img/xuat-kho.png')} style={{ width: '25px', height: '25px', marginRight: '5px', opacity: 1 }} />,
            }
        ],

    }
];

const SideLayout = (props: any) => {
    const { Sider } = Layout;

    const siderStyle: React.CSSProperties = {
        flex: '0 0 80px',
        maxWidth: '80px',
        minWidth: '80px',
        width: '80px',
        background: '#fff',
        paddingBottom: '48px'
    };

    const siderStyleContent: React.CSSProperties = {
        flex: '0 0 250px',
        maxWidth: '250px',
        minWidth: '250px',
        width: '250px',
        background: '#fff',
        paddingBottom: '48px'
    };

    return (
        <>
            <Sider
                width={props.collapsed ? 80 : 250}
                style={props.collapsed ? siderStyleContent : siderStyle}
                collapsible
                theme='light'
                onCollapse={(value) => props.setCollapsed(value)}
                collapsed={props.collapsed}
                collapsedWidth='80'>
                <div className="demo-logo-vertical" style={{ padding: '20px 20px 10px' }}>
                    <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            size="large"
                            shape='circle'
                            src={require('../../assets/img/logo.png')} />
                        {
                            props.collapsed ? "" : <div style={{ padding: '5px', fontWeight: '600', lineHeight: '17px' }}>Hải</div>
                        }
                    </div>

                </div>
                <Menu theme="light" mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['1']}
                    items={items} />
            </Sider>
        </>
    )
}

export default SideLayout;
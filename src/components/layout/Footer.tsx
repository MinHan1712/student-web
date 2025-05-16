import { Layout } from 'antd';

const FooterLayout = () => {
  const footerStyle: React.CSSProperties = {
    display: 'flex', height: '50px', width: '100%', justifyContent: 'center',
    background: '#f0f2f5',
    color: 'rgba(0, 0, 0, .65)',
    borderTop: '1px solid #d8dde6'
  };

  const { Footer } = Layout;
  return (
    <>
      <Footer style={footerStyle}>
        <p style={{ textAlign: 'center', flexWrap: 'wrap', margin: '15px', fontSize: '14px' }}>Copyright © 2025 student point, Version 1.1.0</p>
      </Footer>
    </>
  )

}

export default FooterLayout;
import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import {getReportData} from './utils/util';
import { Layout, Menu } from 'antd';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import MessageContent from './components/MessageContent/MessageContent';
const { Footer, Sider } = Layout;

const reportData = getReportData();

const menuItem = [
  {
    key: 'overView',
    label: '迁移概览'
  },
  {
    key: 'projectDirectory',
    label: '工程目录',
    children: [reportData.filesTree],
  },
  {
    key: 'convertRule',
    label: '迁移规则',
    children: []
  },
  {
    key: 'example',
    label: '样例集',
    children: []
  }
]

function App() {
  const navigate = useNavigate();
  const getPage = (item) => {
    const url = item.keyPath[item.keyPath.length - 1];
    console.log(item);
    navigate(`/${url}`);
  }
  useEffect(() => {
    navigate('/overView', {state: {path: 'all'}});
  }, [])
  return (<Layout hasSider>
    <Sider
      width={300}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['overView']} items={menuItem} onClick={getPage} />
    </Sider>
    <Layout
      className="site-layout"
      style={{
        marginLeft: 300,
        height: '100%'
      }}
    >
      <Routes>
        <Route path='/overView' Component={ProjectDetail}></Route>
        <Route path='/projectDirectory' Component={MessageContent}></Route>
      </Routes>
      <Routes>
        <Route path='/overView' Component={MessageContent}></Route>
      </Routes>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Taro Convert Report ©2023 Created by
      </Footer>
    </Layout>
  </Layout>
  );
}

export default App;
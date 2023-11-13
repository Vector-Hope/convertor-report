import React, { useState } from 'react';
import { Breadcrumb, Layout } from 'antd';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import MessageContent from './components/MessageContent/MessageContent';
import MyMenu from './components/Menu/Menu';
import convertLog from './static/convert.png';
import {getReportData} from './utils/util';
import './App.css';

const { Sider } = Layout;

const reportData = getReportData();

function App() {
  let [selectKeys, setSelectKeys] = useState(['overView']);
  let [showBreadcrumb, setShowBreadcrumb] = useState([{title: '转换概览'}]);

  /**
   * @description: menu点击item获得选择的menu keyList
   * @param {Array<string>} menuSelectKeys
   * @param {Array<string>} menuSelectLabels
   * @return {*}
   */
  const getMenuSelectKeys = (menuSelectKeys, menuSelectLabels) => {
    console.log(menuSelectKeys);
    setSelectKeys([...menuSelectKeys]);
    changeShowBreadcrumb(menuSelectKeys, menuSelectLabels);
  }

  /**
   * @description: 点击异常列表时触发的事件
   * @param {Array<string>} chooseKeys
   * @param {Array<string>} chooseLabels
   * @return {*}
   */
  const onChooseTableItem = (chooseKeys, chooseLabels) => {
    setSelectKeys(chooseKeys);
    changeShowBreadcrumb(chooseKeys, chooseLabels);
    
  }
  
  /**
   * @description: 改变面包屑显示内容
   * @param {Array<string>} keys
   * @param {Array<string>} labels
   * @return {*}
   */
  const changeShowBreadcrumb = (keys, labels) => {
    let showBreadcrumb = labels.map((label, index) => {
      return {
        title: label,
        onClick: (e) => {
          // todo 点击面包屑回调
          console.log(keys.splice(0, index))
        }
      }
    });
    setShowBreadcrumb(showBreadcrumb);
  }

  return (
  <Layout className='report-wrapper'>
    <Sider
      className='menu-wrapper'
      width={352}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        background: 'rgba(255, 255, 255, 0.50)',
        boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.01)'
      }}
    >
      <div className='convertor-report-title'>
        <div className='convertor-report-icon'>
          <img src={convertLog} alt='convert report' />
        </div>
        <div className='convertor-report-name'>Convertor Report</div>
      </div>
      <MyMenu menuItems={reportData.filesMenu} selectKeys={selectKeys} getSelectKeys={getMenuSelectKeys} />
    </Sider>
    <Layout
      className='report-layout'
      style={{
        marginLeft: '352px',
        minWidth: '860px',
        minHeight: '100%'
      }}
    >
      <div>
        <div className='breadcrumb-wrapper'>
          <Breadcrumb
            items={showBreadcrumb}
            separator='>'
            style={{
              fontFamily: 'HarmonyOS_Sans_SC',
              fontWeight: 'medium',
              fontSize: '18px'
            }}
          ></Breadcrumb>
        </div>
        {
          selectKeys[0] === 'overView' ?
          <ProjectDetail projectDetail={reportData.projectDetail} /> :
          ''
        }
        <MessageContent messageList={reportData.errMessage} onChooseTableItem={onChooseTableItem} />
      </div>
    </Layout>
  </Layout>
  );
}

export default App;
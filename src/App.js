import React, { useState } from 'react';
import { Breadcrumb, Layout } from 'antd';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import MessageContent from './components/MessageContent/MessageContent';
import Menu from './components/Menu/Menu';
import MessageDetail from './components/MessageDetail/MessageDetail';
import convertLog from './static/convert.png';
import { getReportData } from './utils/util';
import './App.css';

const { Sider } = Layout;

const reportData = getReportData();

function App() {
  let [selectKeys, setSelectKeys] = useState(['overView']);
  let [showBreadcrumb, setShowBreadcrumb] = useState([{ title: '转换概览' }]);
  let [isShowTable, setIsShowTable] = useState(true);
  let [errMsgList, setErrMsgList] = useState([...reportData.errMessage]);
  let [showMsgDetail, setShowMsgDetail] = useState({});
  /**
   * @description: menu点击item获得选择的menu keyList
   * @param {Array<string>} menuSelectKeys
   * @param {Array<string>} menuSelectLabels
   * @return {*}
   */
  const getMenuSelectKeys = (menuSelectKeys, menuSelectLabels) => {
    setSelectKeys([...menuSelectKeys]);
    setIsShowTable(true);
    filtErrMsgList(menuSelectKeys);
    changeShowBreadcrumb(menuSelectKeys, menuSelectLabels);
  };

  /**
   * @description: 点击异常列表时触发的事件
   * @param {Array<string>} chooseKeys
   * @param {Array<string>} chooseLabels
   * @return {*}
   */
  const onChooseTableItem = (chooseMessage) => {
    setSelectKeys(chooseMessage.pathKeys);
    setIsShowTable(false);
    changeShowBreadcrumb([...chooseMessage.pathKeys, 'msgDetail'], [...chooseMessage.pathLabels, '转换详情']);
    setShowMsgDetail(chooseMessage);
  };

  /**
   * @description: 改变面包屑显示内容
   * @param {Array<string>} keys
   * @param {Array<string>} labels
   * @return {*}
   */
  const changeShowBreadcrumb = (keys, labels) => {
    let showBreadcrumb;
    showBreadcrumb = labels.map(createBreadcrumbEvents(keys, labels));
    setShowBreadcrumb(showBreadcrumb);
  };

  /**
   * @description: 创建面包屑点击事件
   * @param {Array<string>} keys
   * @param {Array<string>} labels
   * @return {Function}
   */
  const createBreadcrumbEvents = (keys, labels) => {
    return (label, index) => {
      return {
        title: label,
        onClick: (e) => {
          // todo 点击面包屑回调
          if (keys[index] === 'msgDetail') {
            return;
          }
          const selectKeys = [...keys].splice(0, index + 1);
          const selectLabels = [...labels].splice(0, index + 1);
          console.log(selectKeys);
          setIsShowTable(true);
          setSelectKeys(selectKeys);
          if (keys[0] !== 'overView') {
            filtErrMsgList(selectKeys);
          }
          changeShowBreadcrumb(selectKeys, selectLabels);
        },
      };
    };
  };
  /**
   * @description: 筛选errMsgList当中符合当前路径的子项
   * @param {Array<string>} keys
   * @return {*}
   */
  const filtErrMsgList = (keys) => {
    if (keys[0] === 'overView') {
      setErrMsgList(reportData.errMessage);
      return;
    }
    let newErrMsgList = reportData.errMessage.filter((errMsg) => {
      const errMsgKeys = errMsg.pathKeys;
      const errMsgKeysLen = errMsgKeys.length;
      return keys.every((key, index) => {
        return index < errMsgKeysLen && key === errMsgKeys[index];
      });
    });
    setErrMsgList(newErrMsgList);
  };

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
          boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.01)',
        }}
      >
        <div className='convertor-report-title'>
          <div className='convertor-report-icon'>
            <img src={convertLog} alt='convert report' />
          </div>
          <div className='convertor-report-name'>Convertor Report</div>
        </div>
        <Menu menuItems={reportData.filesMenu} selectKeys={selectKeys} getSelectKeys={getMenuSelectKeys} />
      </Sider>
      <Layout
        className='report-layout'
        style={{
          marginLeft: '352px',
          minWidth: '860px',
          minHeight: '100%',
        }}
      >
        <div>
          <div className='breadcrumb-wrapper'>
            <Breadcrumb
              items={showBreadcrumb}
              separator='>'
              style={{
                fontSize: '18px',
                cursor: 'pointer',
              }}
            ></Breadcrumb>
          </div>
          {selectKeys[0] === 'overView' ? <ProjectDetail projectDetail={reportData.projectDetail} /> : ''}
          {isShowTable ? (
            <MessageContent messageList={errMsgList} onChooseTableItem={onChooseTableItem} />
          ) : (
            <MessageDetail message={showMsgDetail} />
          )}
        </div>
      </Layout>
    </Layout>
  );
}

export default App;

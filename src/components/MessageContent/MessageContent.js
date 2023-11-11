import { Layout, Table } from 'antd';
import { useState } from 'react';
import './MessageContent.css';
const { Content } = Layout;

/**
 * @description: 初始化异常信息列表与table数据
 * @param {Array} messageList
 * @return {Object}
 */
function initMessageList(messageList) {
  const filePathFilters = [];
  const titleFilters = [];
  const resetMessageList = messageList.map((message, index) => {
    const { filePath, title } = message;
    if (!filePathFilters.includes(filePath)) {
      filePathFilters.push(filePath);
    }
    if (!titleFilters.includes(title)) {
      titleFilters.push(title);
    }
    return {
      filePath: filePath,
      title: title,
      messageNum: message.errCodeList.length
    }
  })
  console.log(resetMessageList, filePathFilters);
  const columns = [
    {
      title: '路径',
      dataIndex: 'filePath',
      filters: filePathFilters.map((path) => {
        return {
          text: path,
          value: path
        }
      }),
      onFilter: (value, record) => record.filePath.indexOf(value) === 0,
      width: 450
    },
    {
      title: '概述',
      dataIndex: 'title',
      filters: titleFilters.map((title) => {
        return {
          text: title,
          value: title
        }
      }),
      onFilter: (value, record) => record.title.indexOf(value) === 0,
      width: 650
    },
    {
      title: '数量',
      dataIndex: 'messageNum',
      width: 340
    },
  ];

  return {
    columns,
    data: [...resetMessageList],
  }
}

function MessageContent({messageList}) {
  const [messageTable, setMessageTable] = useState(initMessageList(messageList));

  const chooseMessage = (e) => {
    console.log(e);
  }
  return (
      <Content className='report-message-content'>
        <div className='report-message-card'>
          <div className='report-message-title'>转换异常列表</div>
          <Table
            size='small'
            columns={messageTable.columns}
            dataSource={messageTable.data}
            rowKey={(record, index) => index}
            rowClassName={(record, index) => 'report-message-detail'}
            onRow={(record) => {
              return {
                onClick: (e) => {
                  chooseMessage(record);
                }
              }
            }}
          />
        </div>
      </Content>
  );
}

export default MessageContent;

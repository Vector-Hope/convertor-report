import { Layout, Table } from 'antd';
import { useEffect, useState } from 'react';
import './MessageContent.css';
const { Content } = Layout;

function getColumns(messageList) {
  const filePathFilters = [];
  const titleFilters = [];
  messageList.forEach((message) => {
    const { filePath, title } = message;
    if (!filePathFilters.includes(filePath)) {
      filePathFilters.push(filePath);
    }
    if (!titleFilters.includes(title)) {
      titleFilters.push(title);
    }
  });
  const columns = [
    {
      title: '路径',
      dataIndex: 'filePath',
      filters: filePathFilters.map((path) => {
        return {
          text: path,
          value: path,
        };
      }),
      onFilter: (value, record) => record.filePath.indexOf(value) === 0,
      width: 450,
    },
    {
      title: '概述',
      dataIndex: 'title',
      filters: titleFilters.map((title) => {
        return {
          text: title,
          value: title,
        };
      }),
      onFilter: (value, record) => record.title.indexOf(value) === 0,
      width: 650,
    },
    {
      title: '数量',
      dataIndex: 'messageNum',
      width: 340,
    },
  ];

  return columns;
}

function MessageContent({ messageList, onChooseTableItem }) {
  let [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(getColumns(messageList));
  }, [messageList]);

  return (
    <Content className='report-message-content'>
      <div className='report-message-card'>
        <div className='report-message-title'>转换异常列表</div>
        <Table
          size='small'
          columns={columns}
          dataSource={messageList}
          rowKey={(record, index) => index}
          rowClassName={(record, index) => 'report-message-detail'}
          onRow={(record) => {
            return {
              onClick: (e) => {
                onChooseTableItem(record);
              },
            };
          }}
        />
      </div>
    </Content>
  );
}

export default MessageContent;

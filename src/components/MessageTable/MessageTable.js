import { Layout, Table, Tag } from 'antd';
import './MessageTable.css';
const { Content } = Layout;

const columns = [
  {
    title: '路径',
    dataIndex: 'filePath',
    filters: [],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.path.indexOf(value) === 0,
  },
  {
    title: '概述',
    dataIndex: 'title',
  },
  {
    title: '详情',
    dataIndex: 'message',
  },
  {
    title: '类型',
    dataIndex: 'type',
    filters: [],
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    render: (type) => {
      let color = 'magenta';
      if (type === '转换异常') {
        color = 'red';
      } else if (type === '辅助引导') {
        color = 'orange';
      } else if (type === '未自动开发') {
        color = 'blue';
      }
      return (
        <Tag color={color} key={type}>
          {type}
        </Tag>
      );
    }
  },
];
const data = [
  {
    "filePath": "convert-lab/miniprogram/utils/util.js",
    "message": "formatJson好像是在对Json数据进行格式化，但是这个函数是对Json数据进行清理",
    "title": "函数名字不好听formatJson",
    "location": {
      "loc": 22,
      "row": {
        "start": 17,
        "end": 27
      }
    },
    "type": "转换异常",
    "childReportMsg": []
  },
  {
    "filePath": "convert-lab/miniprogram/packagesAPI/pages/basics/basics/index.js",
    "message": "就是看不懂你这个啥意思CxYh",
    "title": "看不懂你这个啥意思",
    "location": {
      "loc": 40,
      "row": {
        "start": 24,
        "end": 28
      }
    },
    "type": "辅助引导",
    "childReportMsg": []
  },
  {
    "filePath": "convert-lab/miniprogram/canvas/index.wxml",
    "message": "这个是一个变量，转换时无法分辨数据类型，请注意",
    "title": "这是一个变量",
    "location": {
      "loc": 5,
      "row": {
        "start": 28,
        "end": 36
      }
    },
    "type": "未自动开发",
    "childReportMsg": []
  },
];
 for (let i = 0; i < 2; i++) {
  data.push(...data);
 }

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

function MessageTable({path, type, message}) {

  return (
    <Content className='project-detail-content'>
      <Table  rowKey={(record, index) => index} columns={columns} dataSource={data} onChange={onChange} />
    </Content>
  );
}

export default MessageTable;

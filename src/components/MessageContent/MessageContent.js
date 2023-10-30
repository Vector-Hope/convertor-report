import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import './MessageContent.css';
import MessageTable from '../MessageTable/MessageTable';
import MessageType from '../MessageType/MessageType';
const { Content } = Layout;

function MessageContent({message}) {
  let state = useLocation();
  console.log(state);
  return (
    <>
      <Content className='project-detail-content'>
        <MessageType/>
      </Content>
      <Content className='project-detail-content'>
        <MessageTable/>
      </Content>
    </>
  );
}

export default MessageContent;

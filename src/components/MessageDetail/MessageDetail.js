import { Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import CodeCard from '../CodeCard/CodeCard';
import './MessageDetail.css';
const { Content } = Layout;

function MessageDetail({ message }) {
  let [showMsgDetail, setShowMsgDetail] = useState({});
  let [suggestionWidth, setSuggestionWidth] = useState(0);
  useEffect(() => {
    console.log(message);
    if (typeof message === 'object' && Object.keys(message).length > 0) {
      setShowMsgDetail(message);
    } else {
      setShowMsgDetail({});
    }
  }, [message]);

  const showSuggestion = (e) => {
    if (suggestionWidth === 0) {
      setSuggestionWidth(463);
    } else {
      setSuggestionWidth(0);
    }
  };
  return (
    <Content className='report-message-content message-detail-content'>
      <div
        className='report-message-card message-detail-card'
        style={{
          marginRight: suggestionWidth,
        }}
      >
        <div className='message-detail-header'>
          <div className='message-detail-title-wrapper'>
            <div className='message-detail-title'>{showMsgDetail.title}</div>
            <div className='message-detail-path'>{showMsgDetail.filePath}</div>
          </div>
          <span className='show-suggestion-button-wrapper'>
            <Button type='primary' className='show-suggestion-button' onClick={showSuggestion}>
              修改建议
            </Button>
          </span>
        </div>
        {message.errCodeList?.map((errCodeMsg, index) => {
          return <CodeCard errCodeMsg={errCodeMsg} />;
        })}
      </div>
      <div
        className='test-fixed'
        style={{
          width: suggestionWidth,
        }}
      ></div>
    </Content>
  );
}

export default MessageDetail;

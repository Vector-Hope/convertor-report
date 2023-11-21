import { Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import CodeCard from '../CodeCard/CodeCard';
import Suggestion from '../Suggestion/Suggestion';
import closePng from '../../static/close.png';
import suggestions from '../../resource/suggestions.json';
import './MessageDetail.css';
const { Content } = Layout;

function MessageDetail({ message }) {
  let [showMsgDetail, setShowMsgDetail] = useState({});
  let [suggestionWidth, setSuggestionWidth] = useState(0);
  let [suggestion, setSuggestion] = useState({});
  useEffect(() => {
    if (typeof message === 'object' && Object.keys(message).length > 0) {
      setShowMsgDetail(message);
      setSuggestion(suggestions['costomData' || message.msgType]);
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

  const hideSuggestion = (e) => {
    setSuggestionWidth(0);
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
            <div className='message-detail-title'>{suggestion.msgTitle}</div>
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
        className='message-suggestion-wrapper'
        style={{
          right: suggestionWidth - 463,
        }}
      >
        <div className='message-suggestion-name-wrapper'>
          <div className='message-suggestion-icon-wrapper'>
            <div className='message-suggestion-icon'></div>
          </div>
          <div className='message-suggestion-name'>修改建议</div>
          <div className='message-suggestion-close-wrapper' onClick={hideSuggestion}>
            <img className='message-suggestion-close' src={closePng} alt='close' />
          </div>
        </div>
        <Suggestion suggestion={suggestion} />
      </div>
    </Content>
  );
}

export default MessageDetail;

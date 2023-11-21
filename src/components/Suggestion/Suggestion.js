import './Suggestion.css';

function Suggestion({ suggestion }) {
  return (
    <div className='suggestion-wrapper'>
      <div className='suggestion-title-wrapper'>
        <div className='suggestion-title'>{suggestion.suggestionTitle}</div>
        <div className='suggestion-message'>{suggestion.message}</div>
      </div>
      <div className='suggestion-demo-wrapper'>
        <div className='suggestion-demo-title'>微信小程序示例代码</div>
        <div className='suggestion-demo'>{suggestion.wxDemo}</div>
      </div>
      <div className='suggestion-demo-wrapper'>
        <div className='suggestion-demo-title'>taro小程序示例代码</div>
        <div className='suggestion-demo'>{suggestion.taroDemo}</div>
      </div>
    </div>
  );
}

export default Suggestion;

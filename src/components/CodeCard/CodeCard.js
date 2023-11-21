import './CodeCard.css';

function CodeCard({ errCodeMsg }) {
  return (
    <div className='code-card-wrapper'>
      <div className='code-card'>
        <div className='code-card-title title-before-convert'>
          <div className='code-card-path'>{errCodeMsg.codeBeforeConvert.filePath}</div>
          <div className='code-card-location'>
            行{errCodeMsg.codeBeforeConvert.location.start.row} 列{errCodeMsg.codeBeforeConvert.location.start.col}
          </div>
        </div>
        <div className='code-detail'>{errCodeMsg.codeBeforeConvert.code}</div>
      </div>
      <div className='code-card'>
        <div className='code-card-title title-after-convert'>
          <div className='code-card-path'>{errCodeMsg.codeAfterConvert.filePath}</div>
          <div className='code-card-location'>
            行{errCodeMsg.codeAfterConvert.location.start.row} 列{errCodeMsg.codeAfterConvert.location.start.col}
          </div>
        </div>
        <div className='code-detail'>{errCodeMsg.codeAfterConvert.code}</div>
      </div>
    </div>
  );
}

export default CodeCard;

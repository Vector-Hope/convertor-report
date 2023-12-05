import './CodeCard.css';
import twoArrowPng from '../../static/twoArrow.png'

function CodeCard({ errCodeMsg }) {
  return (
    <div className='code-card-wrapper'>
      {
        errCodeMsg.describe ? (
          <div className='code-card-describe-wrapper'>
            <img
              className='describe-arrow'
              src={twoArrowPng}
              alt='describe'
            />
            <div className='code-card-describe'>
              {errCodeMsg.describe}
            </div>
          </div>
        ) : ''
      }
      <div className='code-card-content'>
        <div className={errCodeMsg.codeAfterConvert ? 'code-card ' : 'code-card-only-before'}>
          <div className='code-card-title title-before-convert'>
            <div className='code-card-path'>{errCodeMsg.codeBeforeConvert.filePath}</div>
            <div className='code-card-location'>
              行{errCodeMsg.codeBeforeConvert.location.start.row} 列{errCodeMsg.codeBeforeConvert.location.start.col}
            </div>
          </div>
          <div className='code-detail'>{errCodeMsg.codeBeforeConvert.code}</div>
        </div>
        {
          errCodeMsg.codeAfterConvert ? (
            <div className='code-card'>
              <div className='code-card-title title-after-convert'>
                <div className='code-card-path'>{errCodeMsg.codeAfterConvert.filePath}</div>
                <div className='code-card-location'>
                  行{errCodeMsg.codeAfterConvert.location.start.row} 列{errCodeMsg.codeAfterConvert.location.start.col}
                </div>
              </div>
              <div className='code-detail'>{errCodeMsg.codeAfterConvert.code}</div>
            </div>
          ) : ''
        }
      </div>
    </div>
    
  );
}

export default CodeCard;

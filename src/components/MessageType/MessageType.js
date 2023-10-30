import { Card, Col, Row } from 'antd';
import './MessageType.css';

const chooseMsgType = (type) => {
  return (e) => {
    console.log(type)
  }
}

function MessageType({messageType}) {

  const types = messageType || [
    {
      type: 'all',
      label: '全部',
      num: 10,
    },
    {
      type: 'convertError',
      label: '转换异常',
      num: 4,
    },
    {
      type: 'guard',
      label: '辅助引导',
      num: 3,
    },
    {
      type: 'byYourSelf',
      label: '未自动开发',
      num: 3,
    },
  ]
  return (
      <Row className='type-area' gutter={24}>
        {
          types.map((type, index) => {
            return (
              <Col span={6} key={type.type}>
                <Card className={`${type.type}-card type-card`} hoverable onClick={chooseMsgType(type.type)}>
                  {type.label}: {type.num} 个
                </Card>
              </Col>
            )
          })
        }
      </Row>
  );
}

export default MessageType;

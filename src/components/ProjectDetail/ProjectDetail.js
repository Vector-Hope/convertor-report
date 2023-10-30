import { Layout, Card } from 'antd';
import './ProjectDetail.css';
const { Content } = Layout;

function ProjectDetail({projectDetail}) {
  const details = projectDetail || [
    {
      name: 'projectName',
      label: '项目名称',
      detail: 'convewrt-lab',
    },
    {
      name: 'projectPath',
      label: '项目路径',
      detail: 'D:\\projects\\weapp\\convert-lab',
    },
    {
      name: 'pageNumber',
      label: '页面数',
      detail: 134,
    },
    {
      name: 'fileNumber',
      label: '文件数',
      detail: '536',
    }
  ];

  return (
    <Content className='project-detail-content'>
      <Card title="项目基本信息" bordered={false} className='project-detail-card'>
        {
          details.map((detail, index) => {
            return (
              <p key={detail.name}>{detail.label}: {detail.detail}</p>
            )
          })
        }
      </Card>
    </Content>
  );
}

export default ProjectDetail;

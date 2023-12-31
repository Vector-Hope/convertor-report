import { Layout } from 'antd';
import './ProjectDetail.css';
const { Content } = Layout;

function ProjectDetail({ projectDetail }) {
  return (
    <Content className='report-message-content'>
      <div className='report-message-card project-detail-card'>
        <div className='project-detail-title'>项目基本信息</div>
        <div className='project-detail-wrapper'>
          <div className='project-detail'>
            <div className='project-detail-basic'>
              <div className='project-detail-label'>项目名称</div>
              <div>{projectDetail.projectName}</div>
            </div>
            <div className='project-detail-basic'>
              <div className='project-detail-label'>项目路径</div>
              <div>{projectDetail.projectPath}</div>
            </div>
          </div>
          <div className='project-detail'>
            <div className='project-detail-label'>页面数</div>
            <div className='project-detail-data'>{projectDetail.pagesNum}</div>
          </div>
          <div className='project-detail'>
            <div className='project-detail-label'>文件数</div>
            <div className='project-detail-data'>{projectDetail.filesNum}</div>
          </div>
        </div>
      </div>
    </Content>
  );
}

export default ProjectDetail;

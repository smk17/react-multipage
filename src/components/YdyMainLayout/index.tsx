import React, { Fragment } from 'react';
import { enquireScreen } from 'enquire-js';
import DocumentTitle from 'react-document-title';
import './index.less'
import 'antd/dist/antd.css';
import logo from '@/assets/img/ydy-logo.svg';
import { Layout, Icon, message } from 'antd';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import YdySiderMenu from '@/components/YdySiderMenu';
import YdyHeader from '@/components/YdyHeader';

const { Content, Header, Footer } = Layout;
class YdyMainLayout extends React.Component<any, any> {
  constructor(props) {
    super(props);
    enquireScreen(isMobile => {
      this.state = {
        isMobile: isMobile
      };
    });
    this.state = {
      fetchingNotices: false,
      collapsed: false,
      isMobile: false,
      notices: [],
    };
  }


  getPageTitle() {
    let title = '控制台';
    return title;
  }

  handleMenuCollapse = collapsed => {
    this.setState({
      collapsed
    })
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
  };

  handleMenuClick = ({ key }) => {
    console.log(key);
  };

  handleNoticeVisibleChange = visible => {
    console.log(visible);
    this.setState({
      notices: [{"id":"000000001","avatar":"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png","title":"你收到了 14 份新周报","datetime":"2017-08-09","type":"通知"},{"id":"000000002","avatar":"https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png","title":"你推荐的 曲妮妮 已通过第三轮面试","datetime":"2017-08-08","type":"通知"},{"id":"000000003","avatar":"https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png","title":"这种模板可以区分多种通知类型","datetime":"2017-08-07","read":true,"type":"通知"},{"id":"000000004","avatar":"https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png","title":"左侧图标用于区分不同的类型","datetime":"2017-08-07","type":"通知"},{"id":"000000005","avatar":"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png","title":"内容不要超过两行字，超出时自动截断","datetime":"2017-08-07","type":"通知"},{"id":"000000006","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"曲丽丽 评论了你","description":"描述信息描述信息描述信息","datetime":"2017-08-07","type":"消息"},{"id":"000000007","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"朱偏右 回复了你","description":"这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像","datetime":"2017-08-07","type":"消息"},{"id":"000000008","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"标题","description":"这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像","datetime":"2017-08-07","type":"消息"},{"id":"000000009","title":"任务名称","description":"任务需要在 2017-01-12 20:00 前启动","extra":"未开始","status":"todo","type":"待办"},{"id":"000000010","title":"第三方紧急代码变更","description":"冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务","extra":"马上到期","status":"urgent","type":"待办"},{"id":"000000011","title":"信息安全考试","description":"指派竹尔于 2017-01-09 前完成更新并发布","extra":"已耗时 8 天","status":"doing","type":"待办"},{"id":"000000012","title":"ABCD 版本发布","description":"冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务","extra":"进行中","status":"processing","type":"待办"}]
    })
  };

  render () {
    const { children } = this.props;
    const { isMobile: mb, collapsed, notices, fetchingNotices } = this.state;
    const menuData = [
      {
        name: '租户管理',
        icon: 'dashboard',
        path: 'Tenant',
        key: 'Tenant',
        children: [
          {
            name: '租户信息',
            path: '/Tenant.html',
          },
          // {
          //   name: '测试租户信息',
          //   path: '/Tenant-Test.html',
          // },
        ],
      },
      {
        name: '应用管理',
        icon: 'dashboard',
        path: 'Application',
        key: 'Application',
        children: [
          {
            name: '应用列表',
            path: '/Application.html',
          },
        ],
      },
    ]
    const currentUser = {name: "Serati Ma", avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png", userid: "00000001", notifyCount: 12}
    const layout = (
      <Layout>
        <YdySiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          // Authorized={Authorized}
          menuData={menuData}
          collapsed={collapsed}
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <YdyHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            {children}
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: '首页',
                  title: '首页',
                  href: 'index.html',
                  blankTarget: true,
                },
                {
                  key: 'github',
                  title: <Icon type="github" />,
                  href: 'https://github.com/ant-design/ant-design-pro',
                  blankTarget: true,
                },
                {
                  key: '条款',
                  title: '条款',
                  href: '',
                  blankTarget: true,
                }
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2018 武汉源钉云互联科技有限公司
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className="screen" style={{height: window.innerHeight}}>{layout}</div>
      </DocumentTitle>
    );
  }
}

export default YdyMainLayout;
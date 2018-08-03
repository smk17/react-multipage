import React, { Fragment } from 'react';
import { enquireScreen } from 'enquire-js';
import DocumentTitle from 'react-document-title';
import './index.less'
import logo from '@/assets/img/ydy-logo.svg';
import { Layout, Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';
import YdySiderMenu from '@/components/YdySiderMenu';

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
      isMobile: false
    };
  }


  getPageTitle() {
    let title = '控制台';
    return title;
  }

  handleMenuCollapse = collapsed => {
    console.log(collapsed);
  };

  render () {
    const { children } = this.props;
    const { isMobile: mb } = this.state;
    const collapsed = false;
    const menuData = [
      {
        name: '租户管理',
        icon: 'dashboard',
        path: 'dashboard',
        children: [
          {
            name: '租户信息',
            path: '/Tenant.html',
          },
          {
            name: '管理员信息',
            path: '/Manager.html',
          },
          {
            name: '管理员登陆信息',
            path: '/ManagerLogin.html',
          },
          {
            name: '测试租户信息',
            path: '/dashboard/Tenant.html',
          },
        ],
      },
      {
        name: '应用管理',
        icon: 'dashboard',
        path: '/Application.html',
        children: [
          {
            name: '应用列表',
            path: '/Application.html',
          },
        ],
      },
    ]
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
            {/* <GlobalHeader
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
            /> */}
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
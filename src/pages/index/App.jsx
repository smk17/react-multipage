import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import loading from '@/assets/img/load.gif';
import sifuoDUQdAFKAVcFGROC from '@/assets/img/sifuoDUQdAFKAVcFGROC.svg';
import YdyTabBar from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
import { Accordion, List, Grid } from 'antd-mobile';
import './App.less';

const icon = 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'

class Components extends React.Component {
  onClick = (el, index) => {
    DingTalk.open(el.url);
  }
  render () {
    const data = [
      { icon, text: 'blank', url: 'blank' },
      { icon, text: '图片选择器', url: 'ImagePickerExample' }
    ]
    return (<Grid data={data} activeStyle={false} onClick={this.onClick}/>);
  }
}

class Api extends React.Component {
  onChange = (key) => {
    console.log(key);
  }
  onClick = (url, params = '') => {
    DingTalk.open(url, params ? `&type=${params}` : '');
  }
  render() {
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
          <Accordion.Panel header="开放接口">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'PayUtils', '')}>支付接口</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'UserInfo')}>获取用户信息</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'requestAuthCode')}>获取微应用免登授权码</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'requestOperateAuthCode')}>获取微应用反馈式操作的临时授权码</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="导航栏">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'Navigation', '')}>导航</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'SetTitle', '')}>设置界面标题</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'SetIcon', '')}>标题栏添加问号Icon</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'SetMenu', '')}>设置导航栏按钮</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="设备">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'getPhoneInfo')}>获取手机基础信息</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'getUUID')}>获取通用唯一识别码</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'getInterface')}>获取热点接入信息</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'getWifiStatus')}>获取Wifi状态</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'getNetworkType')}>获取当前网络类型</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'nfcRead')}>读取NFC芯片内容</List.Item>
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', 'nfcWrite')}>写NFC芯片</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="界面">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'UIUtils', '')}>界面</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="钉盘">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'CspaceUtils', '')}>钉盘</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="媒体">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'MediaUtils', '')}>媒体</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="地图">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'MapUtils', '')}>地图</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="数据">
            <List className="my-list">
              <List.Item onClick={this.onClick.bind(this, 'DataUtils', '')}>数据</List.Item>
            </List>
          </Accordion.Panel>
        </Accordion>
      </div>
    );
  }
}

class Friend extends React.Component {
  render () {
    return (<YdyScrollView style={{ backgroundColor: 'white' }}>朋友</YdyScrollView>);
  }
}

class Me extends React.Component {
  render () {
    return (<YdyScrollView style={{ backgroundColor: 'white' }}> 我的</YdyScrollView>);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init()
    this.setState({
      load: true,
    });
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    const tabBarItems = [
      {
        id: 'components',
        name: '组件',
        size: '22px',
        selectedTab: 'blueTab',
        badge: 1,
        dot: false,
        renderContent: <Components />,
        icon: sifuoDUQdAFKAVcFGROC,
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg'
      },
      {
        id: 'api',
        name: '接口',
        size: '22px',
        selectedTab: 'redTab',
        badge: 'new',
        dot: false,
        renderContent: <Api />,
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg',
        selectedIcon: 'https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg'
      },
      {
        id: 'friend',
        name: '朋友',
        size: '22px',
        selectedTab: 'greenTab',
        badge: '',
        dot: true,
        renderContent: <Friend />,
        icon: 'https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg',
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg'
      },
      {
        id: 'me',
        name: '我的',
        size: '22px',
        selectedTab: 'yellowTab',
        badge: '',
        dot: false,
        renderContent: <Me />,
        icon: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg',
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg'
      }
    ];
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px', textAlign: 'center' }}>
      {
        this.state.load ? <YdyTabBar ref="YdyTabBar" tabBarItems={tabBarItems} selectedTab="blueTab"/> : LoadView
      }
      </div>
    );
  }
}

export default App;

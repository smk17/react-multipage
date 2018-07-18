import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import loading from '@/assets/img/load.gif';
import sifuoDUQdAFKAVcFGROC from '@/assets/img/sifuoDUQdAFKAVcFGROC.svg';
import YdyTabBar, { YdyTabBarItem } from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
import { Accordion, List, Grid } from 'antd-mobile';
import 'antd-mobile/lib/accordion/style/css';
import 'antd-mobile/lib/list/style/css';
import 'antd-mobile/lib/grid/style/css';
import './App.less';

const icon = 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'

class Components extends React.Component {
  onClick (el, index) {
    DingTalk.open(el.url);
  }
  render () {
    const dataLayout = [
      { icon, text: 'Flex布局', url: 'Flex' },
      { icon, text: '两翼留白', url: 'WingBlank' },
      { icon, text: '上下留白', url: 'WhiteSpace' }
    ]
    // const dataNavigation = [
    //   { icon, text: 'blank', url: 'blank' },
    // ]
    const dataDataEntry = [
      { icon, text: '按钮', url: 'Button' },
      { icon, text: '日历', url: 'Calendar' },
      { icon, text: '复选框', url: 'Checkbox' },
      { icon, text: '日期选择器(弹窗)', url: 'DatePicker' },
      { icon, text: '日期选择器', url: 'DatePickerView' },
      { icon, text: '图片选择器', url: 'ImagePickerExample' },
      { icon, text: '文本输入', url: 'InputItem' },
      { icon, text: '选择器', url: 'PickerView' },
      { icon, text: '选择器(弹窗)', url: 'Picker' },
      // { icon, text: '区域选择', url: 'Range' },
      // { icon, text: '单选框', url: 'Radio' },
      // { icon, text: '滑动开关', url: 'Switch' },
      // { icon, text: '搜索栏', url: 'SearchBar' },
      // { icon, text: '滑动输入条', url: 'Slider' },
      // { icon, text: '步进器', url: 'Stepper' },
      // { icon, text: '多行输入', url: 'TextareaItem' }
    ]
    // const dataDataDisplay = [
    //   { icon, text: 'blank', url: 'blank' },
    // ]
    // const dataFeedback = [
    //   { icon, text: 'blank', url: 'blank' },
    // ]
    const dataGesture = [
      { icon, text: 'PullToRefresh 拉动刷新', url: 'PullToRefresh' },
      { icon, text: 'ListView 下拉刷新', url: 'PullToRefreshListView' },
      { icon, text: 'SwipeAction 滑动操作', url: 'SwipeAction' },
    ]
    // const dataCombination = [
    //   { icon, text: 'blank', url: 'blank' },
    // ]
    // const dataOther = [
    //   { icon, text: 'blank', url: 'blank' },
    // ]
    return (
      <YdyScrollView>
        <div className="sub-title">Layout </div>
        <Grid data={dataLayout} onClick={this.onClick.bind(this)}/>

        {/* <div className="sub-title">Navigation </div>
        <Grid data={dataNavigation} onClick={this.onClick.bind(this)}/> */}

        <div className="sub-title">Data Entry </div>
        <Grid data={dataDataEntry} onClick={this.onClick.bind(this)}/>

        {/* <div className="sub-title">Data Display </div>
        <Grid data={dataDataDisplay} onClick={this.onClick.bind(this)}/>

        <div className="sub-title">Feedback </div>
        <Grid data={dataFeedback} onClick={this.onClick.bind(this)}/> */}

        <div className="sub-title">Gesture </div>
        <Grid data={dataGesture} onClick={this.onClick.bind(this)}/>

        {/* <div className="sub-title">Combination </div>
        <Grid data={dataCombination} onClick={this.onClick.bind(this)}/>

        <div className="sub-title">Other </div>
        <Grid data={dataOther} onClick={this.onClick.bind(this)}/> */}
      </YdyScrollView>
      
    );
  }
}

class Api extends React.Component {
  onChange(key) {
    console.log(key);
  }
  onClick (url, params = '') {
    DingTalk.open(url, params ? `&type=${params}` : '');
  }
  render() {
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange.bind(this)}>
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
  onClick (el, index) {
    DingTalk.open(el.url);
  }
  render () {
    const dataResult = [
      { icon, text: '登录失败', url: 'ResultError', params: '&code=10001' },
      { icon, text: '无权限访问', url: 'ResultError', params: '&code=70001' },
      { icon, text: '等待处理', url: 'ResultWaiting', params: '&code=70001' },
      { icon, text: '操作失败', url: 'ResultFailed', params: '&code=70001' },
      { icon, text: '操作成功', url: 'ResultSuccess', params: '&code=70001' },
    ]
    return (
      <YdyScrollView>
        <div className="sub-title">Result </div>
        <Grid data={dataResult} onClick={this.onClick.bind(this)}/>
      </YdyScrollView>
      
    );
  }
}

class Me extends React.Component {
  render () {
    return (<YdyScrollView style={{ backgroundColor: 'white' }}> 我的</YdyScrollView>);
  }
}

class App extends React.Component<{}, AppStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
    })
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    const tabBarItems: YdyTabBarItem[] = [
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
        this.state.load ? <YdyTabBar tabBarItems={tabBarItems} selectedTab="blueTab"/> : LoadView
      }
      </div>
    );
  }
}

export default App;

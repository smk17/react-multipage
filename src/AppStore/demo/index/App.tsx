import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import loading from '@/assets/img/load.gif';
import YdyTabBar, { YdyTabBarItem } from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
import { Accordion, List, Grid } from 'antd-mobile';
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
    const dataNavigation = [
      { icon, text: '标签栏', url: 'TabBar' }
    ]
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
    const dataCombination = [
      { icon, text: '自定义容器长列表', url: 'CustomizeListView' },
    ]
    // const dataOther = [
    //   { icon, text: 'blank', url: 'blank' },
    // ]
    return (
      <YdyScrollView>
        <div className="sub-title">Layout </div>
        <Grid data={dataLayout} onClick={this.onClick.bind(this)}/>

        <div className="sub-title">Navigation </div>
        <Grid data={dataNavigation} onClick={this.onClick.bind(this)}/>

        <div className="sub-title">Data Entry </div>
        <Grid data={dataDataEntry} onClick={this.onClick.bind(this)}/>

        {/* <div className="sub-title">Data Display </div>
        <Grid data={dataDataDisplay} onClick={this.onClick.bind(this)}/>

        <div className="sub-title">Feedback </div>
        <Grid data={dataFeedback} onClick={this.onClick.bind(this)}/> */}

        <div className="sub-title">Gesture </div>
        <Grid data={dataGesture} onClick={this.onClick.bind(this)}/>

        <div className="sub-title">Combination </div>
        <Grid data={dataCombination} onClick={this.onClick.bind(this)}/>

        {/* <div className="sub-title">Other </div>
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
      <div className="sub-title">接口 </div>
        <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange.bind(this)}>
          <Accordion.Panel header="开放接口">
            <List className="my-list">
              {/* <List.Item onClick={this.onClick.bind(this, 'PayUtils', '')}>支付接口</List.Item> */}
              <List.Item onClick={this.onClick.bind(this, 'ViewUtils', '')}>获取信息</List.Item>
            </List>
          </Accordion.Panel>
          {/* <Accordion.Panel header="界面">
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
          </Accordion.Panel> */}
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

class Common extends React.Component<any, { throw: boolean, code: string }> {
  constructor(props) {
    super(props);
    this.state = { throw: false, code: '' };
  }
  onClick (el, index) {
    this.setState({
      throw: true,
      code: el.params
    })
  }
  render () {
    if (this.state.throw) {
      throw new Error(this.state.code);
    }
    const dataResult = [
      { icon, text: '登录失败', params: '10001' },
      { icon, text: '无权限访问', params: '70001' },
      { icon, text: '等待处理', params: '60001' }, 
      { icon, text: '操作失败', params: '50001' },
      { icon, text: '操作成功', params: '40001' },
    ]
    return (
      <YdyScrollView>
        <div className="sub-title">Result </div>
        <Grid data={dataResult} onClick={this.onClick.bind(this)}/>
        <div className="sub-title">Error </div>
        <Grid data={[ { icon, text: '报错' } ]} onClick={() => { new Array(-1); }}/>
      </YdyScrollView>
    );
  }
}

class Me extends React.Component {
  onClick (el, index) {
    DingTalk.open(el.url);
  }
  onDevClick (el, index) {
    DingTalk.openLink(el.url);
  }
  render () {
    const apps = [
      { icon, text: '合同管理', url: 'Contract' },
      { icon, text: '主页定制', url: 'IndexCustomize' },
    ]
    const devApps = [
      { icon, text: 'AntDevDemo', url: 'http://192.168.0.128:3000/index.html?corpid=dingc86162eab28e8abc35c2f4657eb6378f&dd_nav_bgcolor=F00094ff' },
    ]
    return (
      <YdyScrollView>
        <div className="sub-title">应用 </div>
        <Grid data={apps} onClick={this.onClick.bind(this)}/>
        <div className="sub-title">应用调试 </div>
        <Grid data={devApps} onClick={this.onDevClick.bind(this)}/>
      </YdyScrollView>
    );
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
        icon: require("@/assets/img/components.svg"),
        selectedIcon: require("@/assets/img/components_HL.svg")
      },
      {
        id: 'api',
        name: '接口',
        size: '22px',
        selectedTab: 'redTab',
        badge: 'new',
        dot: false,
        renderContent: <Api />,
        icon: require("@/assets/img/api.svg"),
        selectedIcon: require("@/assets/img/api_HL.svg")
      },
      {
        id: 'appstore',
        name: '应用',
        size: '22px',
        selectedTab: 'yellowTab',
        badge: '',
        dot: false,
        renderContent: <Me />,
        icon: require("@/assets/img/appstore.svg"),
        selectedIcon: require("@/assets/img/appstore_HL.svg")
      },
      {
        id: 'common',
        name: '通用',
        size: '22px',
        selectedTab: 'greenTab',
        badge: '',
        dot: true,
        renderContent: <Common />,
        icon: require("@/assets/img/compass.svg"),
        selectedIcon: require("@/assets/img/compass_HL.svg")
      }
    ];
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px', textAlign: 'center' }}>
      <YdyScrollView>
      {
        this.state.load ? <YdyTabBar tabBarItems={tabBarItems} selectedTab="yellowTab"/> : LoadView
      }
      </YdyScrollView>
      </div>
    );
  }
}

export default App;

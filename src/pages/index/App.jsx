import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import loading from '@/assets/img/load.gif';
import sifuoDUQdAFKAVcFGROC from '@/assets/img/sifuoDUQdAFKAVcFGROC.svg';
import YdyTabBar from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
import { Grid } from 'antd-mobile';
import './App.less';

const icon = 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'

class Components extends React.Component {
  onClick = (el, index) => {
    DingTalk.openLink(window.location.origin + el.url + window.location.search);
  }
  render () {
    const data = [
      { icon, text: 'blank', url: '/blank.html' },
      { icon, text: '图片选择器', url: '/ImagePickerExample.html' }
    ]
    return (<Grid data={data} activeStyle={false} onClick={this.onClick}/>);
  }
}

class Api extends React.Component {
  render () {
    return (<YdyScrollView style={{ backgroundColor: 'white' }}>接口</YdyScrollView>);
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

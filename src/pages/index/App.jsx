import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import YdyTabBar from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
import './App.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      development: true,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init()
  }
  
  render() {
    const tabBarItems = [
      {
        id: 'components',
        name: '组件',
        size: '22px',
        selectedTab: 'blueTab',
        badge: 1,
        dot: false,
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>blueTab</YdyScrollView>,
        icon: 'https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg',
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg'
      },
      {
        id: 'api',
        name: '接口',
        size: '22px',
        selectedTab: 'redTab',
        badge: 'new',
        dot: false,
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>redTab</YdyScrollView>,
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
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>greenTab</YdyScrollView>,
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
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>yellowTab</YdyScrollView>,
        icon: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg',
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg'
      }
    ];
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px', textAlign: 'center' }}>
      <YdyTabBar ref="YdyTabBar" tabBarItems={tabBarItems} selectedTab="blueTab"/>
      </div>
    );
  }
}

export default App;

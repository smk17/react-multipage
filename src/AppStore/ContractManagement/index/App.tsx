import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import YdyTabBar, { YdyTabBarItem } from '@/components/YdyTabBar';
import loading from '@/assets/img/load.gif';
import './App.less';
import ContractMe from './components/ContractMe';
import ContractReceivables from './components/ContractReceivables';
import ContractPayback from './components/ContractPayback';
import Contract from './components/Contract';

class App extends React.Component<any, AppStateTypes> {
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
  
  renderContent () {
    const tabBarItems: YdyTabBarItem[] = [
      {
        id: 'Contract',
        name: '合同管理',
        size: '22px',
        selectedTab: 'ContractTab',
        badge: 0,
        dot: false,
        renderContent: <Contract />,
        icon: require("@/assets/img/components.svg"),
        selectedIcon: require("@/assets/img/components_HL.svg")
      },
      {
        id: 'ContractPayback',
        name: '合同回款',
        size: '22px',
        selectedTab: 'ContractPaybackTab',
        badge: 0,
        dot: false,
        renderContent: <ContractPayback />,
        icon: require("@/assets/img/api.svg"),
        selectedIcon: require("@/assets/img/api_HL.svg")
      },
      {
        id: 'ContractReceivables',
        name: '合同应收款',
        size: '22px',
        selectedTab: 'ContractReceivablesTab',
        badge: 0,
        dot: false,
        renderContent: <ContractReceivables />,
        icon: require("@/assets/img/appstore.svg"),
        selectedIcon: require("@/assets/img/appstore_HL.svg")
      },
      {
        id: 'Me',
        name: '我',
        size: '22px',
        selectedTab: 'greenTab',
        badge: 0,
        dot: false,
        renderContent: <ContractMe />,
        icon: require("@/assets/img/compass.svg"),
        selectedIcon: require("@/assets/img/compass_HL.svg")
      }
    ];
    return (
      <YdyTabBar tabBarItems={tabBarItems} selectedTab="ContractTab"/>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
      </div>
    );
  }
}

export default App;

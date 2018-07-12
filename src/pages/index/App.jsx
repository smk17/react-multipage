import axios from 'axios';
import React, { Component } from 'react';
import { ImagePicker, WingBlank, SegmentedControl } from 'antd-mobile';
import YdyTabBar from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
import './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      development: true,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    if (!(window.dd.version === null) && window.location.search.length > 0 ) {
      let corpid =  window.location.search;
      corpid = corpid.substring(1).split('&', 1)[0];
      corpid = corpid.split('=')[1];
      let url = 'http://dd.smk17.cn/getConfig.php?corpid=' + corpid;
      url += '&url=' + encodeURIComponent(window.location.href.split('#')[0]);
      axios.get(url).then(res => {
        res.data['jsApiList'] = [ 'runtime.info', 'biz.contact.choose', 'biz.util.uploadImage',
            'device.notification.confirm', 'device.notification.alert',
            'device.notification.prompt', 'biz.ding.post', 'biz.util.scanCard',
            'biz.util.openLink' ]
        window.dd.config(res.data);
        window.dd.error(error => {
          // this.development && console.log(error);
          this.state.development && alert('dd error: ' + JSON.stringify(error));
        });
        // window.alert(JSON.stringify(res.data));
      })
    }
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
      <YdyTabBar ref="YdyTabBar" tabBarItems={tabBarItems} />
      </div>
    );
  }
}

export default App;

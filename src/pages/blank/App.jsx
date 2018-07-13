import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif'
import './App.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      development: true,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init()
    setTimeout(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('开始吧');
    }, 2000);
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
        {
          this.state.load ? <YdyScrollView style={{ backgroundColor: 'white' }}>新的页面从这里开始吧！</YdyScrollView> : LoadView
        }
      </div>
    );
  }
}

export default App;

import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { WhiteSpace } from 'antd-mobile';
import loading from '@/assets/img/load.gif';
import './App.less';

const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} placeholder`} {...restProps}>Block</div>
);

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
    // setTimeout(() => {
    //   this.setState({
    //     load: true,
    //   })
    //   DingTalk.setTitle('开始吧');
    // }, 2000);
    this.setState({
      load: true,
    })
    DingTalk.setTitle('WhiteSpace 上下留白');
  }
  
  renderContent () {
    return (
      <div>
        <WhiteSpace size="xs" />
        <PlaceHolder />

        <WhiteSpace size="sm" />
        <PlaceHolder />

        <WhiteSpace />
        <PlaceHolder />

        <WhiteSpace size="lg" />
        <PlaceHolder />

        <WhiteSpace size="xl" />
        <PlaceHolder />
      </div>
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

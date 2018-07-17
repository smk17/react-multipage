import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';

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
    DingTalk.init(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('Button 按钮');
    })
  }
  
  renderContent () {
    return (
      <YdyScrollView>
        <WingBlank>
          <Button>default</Button><WhiteSpace />
          <Button disabled>default disabled</Button><WhiteSpace />

          <Button type="primary">primary</Button><WhiteSpace />
          <Button type="primary" disabled>primary disabled</Button><WhiteSpace />

          <Button type="warning">warning</Button><WhiteSpace />
          <Button type="warning" disabled>warning disabled</Button><WhiteSpace />

          <Button loading>loading button</Button><WhiteSpace />
          <Button icon="check-circle-o">with icon</Button><WhiteSpace />
          <Button icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/jBfVSpDwPbitsABtDDlB.svg" alt="" />}>with custom icon</Button><WhiteSpace />

          {/* <Button activeStyle={false}>无点击反馈</Button><WhiteSpace /> */}
          {/* <Button activeStyle={{ backgroundColor: 'red' }}>custom feedback style</Button><WhiteSpace /> */}

          <WhiteSpace />
          <Button type="primary" inline style={{ marginRight: '4px' }}>inline primary</Button>
          {/* use `am-button-borderfix`. because Multiple buttons inline arranged, the last one border-right may not display */}
          <Button type="ghost" inline style={{ marginRight: '4px' }} className="am-button-borderfix">inline ghost</Button>

          <WhiteSpace />
          <Button type="primary" inline size="small" style={{ marginRight: '4px' }}>primary</Button>
          <Button type="primary" inline size="small" disabled>primary disabled</Button>
          <WhiteSpace />
          <Button type="ghost" inline size="small" style={{ marginRight: '4px' }}>ghost</Button>
          {/* use `am-button-borderfix`. because Multiple buttons inline arranged, the last one border-right may not display */}
          <Button type="ghost" inline size="small" className="am-button-borderfix" disabled>ghost disabled</Button>
        </WingBlank>
      </YdyScrollView>
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

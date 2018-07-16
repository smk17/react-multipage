import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { Flex, WhiteSpace } from 'antd-mobile';
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
    this.setState({
      load: true,
    })
    DingTalk.setTitle('Flex布局');
  }

  renderContent () {
    return (
      <div className="flex-container">
      <div className="sub-title">Basic</div>
      <Flex>
        <Flex.Item><PlaceHolder /></Flex.Item>
        <Flex.Item><PlaceHolder /></Flex.Item>
      </Flex>
      <WhiteSpace size="lg" />
      <Flex>
        <Flex.Item><PlaceHolder /></Flex.Item>
        <Flex.Item><PlaceHolder /></Flex.Item>
        <Flex.Item><PlaceHolder /></Flex.Item>
      </Flex>
      <WhiteSpace size="lg" />
      <Flex>
        <Flex.Item><PlaceHolder /></Flex.Item>
        <Flex.Item><PlaceHolder /></Flex.Item>
        <Flex.Item><PlaceHolder /></Flex.Item>
        <Flex.Item><PlaceHolder /></Flex.Item>
      </Flex>
      <WhiteSpace size="lg" />

      <div className="sub-title">Wrap</div>
      <Flex wrap="wrap">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
      </Flex>
      <WhiteSpace size="lg" />

      <div className="sub-title">Align</div>
      <Flex justify="center">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
      </Flex>
      <WhiteSpace />
      <Flex justify="end">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
      </Flex>
      <WhiteSpace />
      <Flex justify="between">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline" />
      </Flex>

      <WhiteSpace />
      <Flex align="start">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline small" />
        <PlaceHolder className="inline" />
      </Flex>
      <WhiteSpace />
      <Flex align="end">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline small" />
        <PlaceHolder className="inline" />
      </Flex>
      <WhiteSpace />
      <Flex align="baseline">
        <PlaceHolder className="inline" />
        <PlaceHolder className="inline small" />
        <PlaceHolder className="inline" />
      </Flex>
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

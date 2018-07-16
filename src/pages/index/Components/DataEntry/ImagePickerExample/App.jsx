import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import YdyImagePicker from "@/components/YdyImagePicker";
import { WingBlank, SegmentedControl } from 'antd-mobile';
import loading from '@/assets/img/load.gif';
import './App.less';

const data = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: '2121',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: '2122',
}];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      files: data,
      multiple: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init()
    this.setState({
      load: true,
    })
    DingTalk.setTitle('图片选择器演示');
  }
  onChange = (files) => {
    this.setState({
      files,
    });
  }
  onSegChange = (e) => {
    const index = e.nativeEvent.selectedSegmentIndex;
    this.setState({
      multiple: index === 1,
    });
  }

  renderImagePicker () {
    const { files } = this.state;
    return (
      <WingBlank className="App-WingBlank">
        <SegmentedControl
          values={['切换到单选', '切换到多选']}
          selectedIndex={this.state.multiple ? 1 : 0}
          onChange={this.onSegChange}
        />
        <YdyImagePicker
          files={files}
          onChange={this.onChange.bind(this)}
          selectable={files.length < 5}
          multiple={this.state.multiple}
        />
      </WingBlank>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
        {
          this.state.load ? this.renderImagePicker() : LoadView
        }
      </div>
    );
  }
}

export default App;

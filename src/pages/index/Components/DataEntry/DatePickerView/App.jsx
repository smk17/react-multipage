import React from 'react';
import YdyScrollView from "@/components/YdyScrollView";
import { DingTalk } from '@/common/dingtalk';
import loading from '@/assets/img/load.gif';
import './App.less';
import { DatePickerView } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker-view/locale/en_US';

class DatePickerViewExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  
  onChange (value) {
    console.log(value);
    this.setState({ value });
  };
  onValueChange(...args) {
    console.log(args);
  };
  render() {
    return (<div>
      <div className="sub-title">Start datetime</div>
      <DatePickerView
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        onValueChange={this.onValueChange.bind(this)}
      />
      <div className="sub-title">End datetime</div>
      <DatePickerView
        locale={enUs}
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        onValueChange={this.onValueChange.bind(this)}
      />
    </div>);
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
    DingTalk.init(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('DatePickerView 日期选择器');
    })
  }
  
  renderContent () {
    return (
      <YdyScrollView><DatePickerViewExample /></YdyScrollView>
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

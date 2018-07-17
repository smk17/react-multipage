import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { List, Switch, Calendar } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import loading from '@/assets/img/load.gif';
import './App.less';

const extra = {
  '2017/07/15': { info: 'Disable', disable: true },
};

const now = new Date();
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8)] = { info: 'Disable', disable: true };

Object.keys(extra).forEach((key) => {
  const info = extra[key];
  const date = new Date(key);
  if (!Number.isNaN(+date) && !extra[+date]) {
    extra[+date] = info;
  }
});

class Test extends React.Component {
  
  constructor(props) {
    super(props);
    this.originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;
    this.state = {
      en: false,
      show: false,
      config: {},
    };
  }

  renderBtn(zh, en, config = {}) {
    config.locale = this.state.en ? enUS : zhCN;

    return (
      <List.Item arrow="horizontal"
        onClick={() => {
          document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
          this.setState({
            show: true,
            config,
          });
        }}
      >
        {this.state.en ? en : zh}
      </List.Item>
    );
  }

  changeLanguage () {
    this.setState({
      en: !this.state.en,
    });
  }

  onSelectHasDisableDate(dates) {
    console.warn('onSelectHasDisableDate', dates);
  }

  onConfirm (startTime, endTime) {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    this.setState({
      show: false,
      startTime,
      endTime,
    });
  }

  onCancel () {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    this.setState({
      show: false,
      startTime: undefined,
      endTime: undefined,
    });
  }

  getDateExtra (date) {
    return extra[+date]
  } 

  render() {
    return (
      <div>
        <List className="calendar-list" style={{ backgroundColor: 'white' }}>
          <List.Item className="item" extra={<Switch className="right" checked={!this.state.en} onChange={this.changeLanguage} />}>
            {this.state.en ? 'Chinese' : '中文'}
          </List.Item>
          {this.renderBtn('选择日期区间', 'Select Date Range')}
          {this.renderBtn('选择日期时间区间', 'Select DateTime Range', { pickTime: true })}
          {this.renderBtn('选择日期', 'Select Date', { type: 'one' })}
          {this.renderBtn('选择日期时间', 'Select DateTime', { type: 'one', pickTime: true })}
          {this.renderBtn('选择日期区间(快捷)', 'Select Date Range (Shortcut)', { showShortcut: true })}
          {this.renderBtn('选择日期时间区间(快捷)', 'Select DateTime Range (Shortcut)', { pickTime: true, showShortcut: true })}
          {this.renderBtn('大行距', 'XL row size', { rowSize: 'xl' })}
          {this.renderBtn('不无限滚动', 'infinite: false', { infinite: false })}
          {this.renderBtn('水平进入', 'Horizontal enter', { enterDirection: 'horizontal' })}
          {this.renderBtn('默认选择范围', 'Selected Date Range', { defaultValue: [new Date(+now - 86400000), new Date(+now - 345600000)] })}
          {this.renderBtn('onSelect API', 'onSelect API', {
            onSelect: (date, state) => {
              console.log('onSelect', date, state);
              return [date, new Date(+now - 604800000)];
            },
          })}
          {
            this.state.startTime &&
            <List.Item>Time1: {this.state.startTime.toLocaleString()}</List.Item>
          }
          {
            this.state.endTime &&
            <List.Item>Time2: {this.state.endTime.toLocaleString()}</List.Item>
          }
        </List>
        <Calendar
          {...this.state.config}
          visible={this.state.show}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
          onSelectHasDisableDate={this.onSelectHasDisableDate.bind(this)}
          getDateExtra={this.getDateExtra.bind(this)}
          defaultDate={now}
          minDate={new Date(+now - 5184000000)}
          maxDate={new Date(+now + 31536000000)}
        />
      </div>
    );
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
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('Calendar 日历');
    })
  }
  
  renderContent () {
    return (
      <YdyScrollView>
        <Test />
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

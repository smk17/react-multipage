import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { List, InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';

interface DataUtilsStateTypes extends AppStateTypes {
  key: string,
  value: string,
}

class App extends React.Component<any, DataUtilsStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      key: '',
      value: '',
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('数据存储演示');
    })
  }

  setTimeItem () {
    let times: Date[] = []
    setTimeout(() => {
      const time = new Date()
      times.push(time)
      DingTalk.setStorageItem({
        name: 'time',
        value: JSON.stringify(time)
      })
    }, 1000);
  }

  renderContent () {
    const { key, value } = this.state;
    return (
      <YdyScrollView>
        <List>
          <InputItem
            clear
            onChange={value => this.setState({ key: value })}
            value={this.state.key}
            placeholder="请输入key"
          >key</InputItem>
          <InputItem
            clear
            onChange={value => this.setState({ value: value })}
            value={this.state.value}
            placeholder="请输入value"
          >value</InputItem>
        </List><WhiteSpace />
        <WingBlank>
          <Button type="primary" onClick={() => DingTalk.setStorageItem({ name: key, value: value })}>存储数据</Button><WhiteSpace />
          <Button onClick={this.setTimeItem.bind(this)}>定时存储数据</Button><WhiteSpace />
          <Button onClick={() => DingTalk.getStorageItem(key).then(res => DingTalk.alert(JSON.stringify(res)))}>读取数据</Button><WhiteSpace />
          <Button type="warning" onClick={() => DingTalk.removeStorageItem(key)}>清理数据</Button><WhiteSpace />
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

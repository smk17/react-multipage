import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { List, InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';

class App extends React.Component {
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

  setItem () {
    if (!(window.dd.version === null)) {
      window.dd.util.domainStorage.setItem({
        name: this.state.key , // 存储信息的key值
        value: this.state.value, // 存储信息的Value值
        onSuccess : function(info) {
          // alert(JSON.stringify(info));
        },
        onFail : function(err) {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  getItem () {
    if (!(window.dd.version === null)) {
      window.dd.util.domainStorage.getItem({
        name: this.state.key, // 存储信息的key值
        onSuccess : function(info) {
          alert(JSON.stringify(info));
        },
        onFail : function(err) {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  removeItem () {
    if (!(window.dd.version === null)) {
      window.dd.util.domainStorage.removeItem({
        name: this.state.key , // 存储信息的key值
        onSuccess : function(info) {
          alert(JSON.stringify(info));
        },
        onFail : function(err) {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  setTimeItem () {
    let times = []
    setTimeout(() => {
      if (!(window.dd.version === null)) {
        const time = new Date()
        times.push(time)
        window.dd.util.domainStorage.setItem({
          name: 'time' , // 存储信息的key值
          value: JSON.stringify(times), // 存储信息的Value值
          onSuccess : function(info) {
            // alert(JSON.stringify(info));
          },
          onFail : function(err) {
            alert(JSON.stringify(err));
          }
        });
      } else {
        // window.location = url
      }
    }, 1000);
  }

  renderContent () {
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
          <Button type="primary" onClick={this.setItem.bind(this)}>存储数据</Button><WhiteSpace />
          <Button onClick={this.setTimeItem.bind(this)}>定时存储数据</Button><WhiteSpace />
          <Button onClick={this.getItem.bind(this)}>读取数据</Button><WhiteSpace />
          <Button type="warning" onClick={this.removeItem.bind(this)}>清理数据</Button><WhiteSpace />
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

import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';
import { JsonHelper } from '@/common/Utils';

interface ViewUtilsStateTypes extends AppStateTypes {
  showText: string
}

class App extends React.Component<any, ViewUtilsStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      showText: '',
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('获取信息')
    })
  }

  onClick (api: string) {
    const onSuccess = res => {
      this.setState({
        showText: JsonHelper.toJson(res),
      })
    }
    switch (api) {
      case 'requestAuthCode': DingTalk.requestAuthCode().then(onSuccess); break;
      case 'getPhoneInfo': DingTalk.getPhoneInfo().then(onSuccess); break;
      default:
        break;
    }
  }
  
  renderContent () {
    return (
      <YdyScrollView>
        <WingBlank>
          <Button type="primary" onClick={this.onClick.bind(this, 'requestAuthCode')}>获取微应用免登授权码</Button><WhiteSpace />
          <Button type="primary" onClick={this.onClick.bind(this, 'getPhoneInfo')}>获取手机基础信息</Button><WhiteSpace />
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

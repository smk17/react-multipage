import React from 'react';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';
import MiddlegroundService from '@/AppStore/Middleground/MiddlegroundService';

class App extends React.Component<any, AppStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    let code = ''
    let search = window.location.search.substring(1).split('&')
    for (let index = 0; index < search.length; index++) {
      const element = search[index].split('=');
      const key = element[0];
      const val = element[1];
      if (key === 'code') {
        code = val
      }
    }
    console.log(code);
    MiddlegroundService.oauthLogin(code).then(reslut => {
      console.log(reslut);
      MiddlegroundService.Login(reslut).then(res => {
        console.log(res);
        window.location.href="Tenant.html";
        this.setState({
          load: true,
        })
      })
    })
  }
  
  renderContent () {
    return (
      <YdyScrollView>登录成功</YdyScrollView>
    );
  }
  
  render() {
    const LoadView = (
      <div className="App-loading" >
        <img src={loading} alt="" />
        <span>登录中...</span>
      </div>
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

import React from 'react';
import { Icon } from 'antd';
import YdyScrollView from "@/components/YdyScrollView";
import PageHeader from 'ant-design-pro/lib/PageHeader';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import loading from '@/assets/img/load.gif';
import logo from '@/assets/img/ydy.svg';
import './App.less';

const appid = 'dingoa6wneh7puhe8yamlu'

enum LoginType {
  /** 快速登录 */
  quick,
  /** 账密登录 */
  static
}

interface LoginStateTypes extends AppStateTypes {
  loginType: LoginType
}

class App extends React.Component<any, LoginStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      loginType: LoginType.quick,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  DDLogin () {
    const STATE = Date.now()
    window['DDLogin']({
      id: "login_qrcode",//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
      goto: encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=code&scope=snsapi_login&state=${STATE}&redirect_uri=${window.location.origin}/Console.html`),
      style: "border:none;background-color:#FFFFFF;",
      width: "300",
      height: "300"
    })
  }

  componentDidMount () {
    var hanndleMessage = function (event) {
      var origin = event.origin;
      console.log("origin", event.origin);
      if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
          var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          console.log("loginTmpCode", loginTmpCode);
          const STATE = Date.now()     
          window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=code&scope=snsapi_login&state=${STATE}&redirect_uri=${window.location.origin}/Console.html&loginTmpCode=${loginTmpCode}`;
      }
    };
    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('message', hanndleMessage, false);
    } else if (typeof window['attachEvent'] != 'undefined') {
        window['attachEvent']('onmessage', hanndleMessage);
    }
    this.DDLogin()
  }
  
  renderContent () {
    const { loginType } = this.state;
    const loginSwitch = () => {
      if (loginType === LoginType.quick) {
        this.setState({ loginType: LoginType.static })
      } else {
        this.setState({ loginType: LoginType.quick }, () => {
          this.DDLogin()
        })
      }
    }
    const links = [{
      key: '帮助',
      title: '帮助',
      href: '',
      blankTarget: true,
    }, 
    // {
    //   key: 'github',
    //   title: <Icon type="github" />,
    //   href: 'https://github.com/ant-design/ant-design-pro',
    //   blankTarget: true,
    // }, 
    {
      key: '条款',
      title: '条款',
      href: '',
      blankTarget: true,
    }];
    const copyright = <div>Copyright <Icon type="copyright" /> 2018 武汉源钉云互联科技有限公司</div>;
    return (
      <YdyScrollView>
        <PageHeader
          title={<div className="App-title"></div>}
          logo={<a className="App-logo" href="index.html"><img style={{width: 140, height: '100%'}} src={logo} alt="源钉云" /></a>}
          action={
            <div className="App-action">
              <a href="index.html">首页</a>
            </div>
          }
          tabActiveKey="1"
        />
        <div className="App-login-body">
          <div className="App-login">
            <div className={loginType === LoginType.static ? 'hd login-quick' : 'hd login-static'} style={{height: 36}}>
              <h2 className="quick" onClick={loginSwitch}>快速登录</h2>
              <h2 className="static" onClick={loginSwitch}>账密登录</h2>
              <div className="quick-tip">
                <div className="poptip">
                  <div className="poptip-arrow">
                    <em></em>
                    <span></span>
                  </div>
                  <div className="poptip-content">扫码登录</div>
                </div>
              </div>
              <div className="static-tip">
                <div className="poptip">
                  <div className="poptip-arrow">
                    <em></em>
                    <span></span>
                  </div>
                  <div className="poptip-content">密码登录</div>
                </div>
              </div>
            </div>
            <div className="qrcode-login" style={{display: loginType === LoginType.quick ? '' : 'none'}}>
              <div className="title">扫码登录</div>
              <div id="login_qrcode"></div>
            </div>
            <div className="static-login" style={{display: loginType === LoginType.quick ? 'none' : ''}}>
              <div className="title">密码登录</div>
            </div>
          </div>
        </div>
        <div className="App-footer">
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </YdyScrollView>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: '100%', height: this.state.height + 'px' }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
      </div>
    );
  }
}

export default App;

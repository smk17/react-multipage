import React from 'react';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import './App.less';
import MiddlegroundService from '../MiddlegroundService';

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
    MiddlegroundService.hasLoginInfo();
    this.setState({
      load: true,
    })
  }
  
  renderContent () {
    return (
      <YdyMainLayout handleLoginOut={MiddlegroundService.handleLoginOut}>新的页面从这里开始吧！</YdyMainLayout>
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

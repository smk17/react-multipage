import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';
import IndexService from '../IndexService';

interface InformationStateTypes extends AppStateTypes {
  content: string
}

class App extends React.Component<any, InformationStateTypes> {
  _content: HTMLDivElement | null = null
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      content: '',
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    let id = ''
    let search = window.location.search.substring(1).split('&')
    for (let index = 0; index < search.length; index++) {
      const element = search[index].split('=');
      const key = element[0];
      const val = element[1];
      if (key === 'id') {
        id = val
      }
    }
    if (id) {
      IndexService.getInformation(id).then(res => {
        if (res.success) {
          DingTalk.setTitle(res.data.title)
          let content = res.data.content
          content = content.replace(/(\/res\/\/upload)/g, window.baseConfig.host + '/res/upload')
          this.setState({ load: true, content: content })
        } else{
          this.setState({
            load: true,
          })
        }
      }).catch(() => {
        this.setState({
          load: true,
        })
      })
    } else {
      this.setState({
        load: true,
      })
    }
  }

  onClick (event) {
    if (event.target.nodeName === 'IMG') {
      let urls: string[] = []
      let images = this._content && this._content.getElementsByTagName('img')
      if (images) {
        for (let index = 0; index < images.length; index++) {
          const element = images[index]
          let src = element.getAttribute('src')
          src && urls.push(src)
        }
      }
      DingTalk.previewImage(urls, event.target.src)
    }
  }
  
  renderContent () {
    return (
      <YdyScrollView>
        <div ref={el => this._content = el } className="App-content" onClick={this.onClick.bind(this)} dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
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

import React from 'react';
import objectAssign from "object-assign";
import { DingTalk } from '@/common/DingTalk';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';
import IndexService from '../IndexService';
import { IndexCustomizeInfo } from '../statement';

interface IndexCustomizeStateTypes extends AppStateTypes{
  data: IndexCustomizeInfo[]
}

class App extends React.Component<any, IndexCustomizeStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      data: [],
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    let preview = false
    let search = window.location.search.substring(1).split('&')
    for (let index = 0; index < search.length; index++) {
      const element = search[index].split('=');
      const key = element[0];
      const val = element[1];
      if (key === 'preview') {
        preview = val === 'true'
      }
    }
    if (preview) {
      IndexService.getData(preview).then(res => {
        this.setState({ load: true, data: res })
        DingTalk.setTitle('主页定制')
      })
    } else {
      DingTalk.init().then(() => {
        DingTalk.setTitle('主页定制')
        IndexService.getData(preview).then(res => {
          this.setState({ load: true, data: res })
        })
      })
    }
  }

  format (block: IndexCustomizeInfo) {
    let content = block.content
    for (const key in block.property) {
      const re = new RegExp(`{{${key}}}`, 'g')
      content = content.replace(re, block.property[key])
    }
    return content
  }
  
  renderContent () {
    const { width, data } = this.state
    return (
      <YdyScrollView>
      {
        data.map((Item, index) => {
          let style: React.CSSProperties = {
            width: width * (Item.width / 100),
            height: Item.height,
            top: Item.top,
            left: width * (Item.left / 100),
            position: 'absolute'
          }
          let content = this.format(Item)
          return (
            <div key={index} style={objectAssign(style, Item.style)} dangerouslySetInnerHTML={{ __html: content}}></div>
          );
        })
      }
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

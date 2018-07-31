import React from 'react';
import objectAssign from "object-assign";
import { DingTalk } from '@/common/DingTalk';
import YdyScrollView from "@/components/YdyScrollView";
// import { Flex, WhiteSpace } from 'antd-mobile';
import loading from '@/assets/img/load.gif';
import './App.less';
import IndexService from '../IndexService';
import { IndexCustomizeInfo } from '../statement';

interface IndexCustomizeStateTypes extends AppStateTypes{
  data: IndexCustomizeInfo[]
  preview: boolean
}

class App extends React.Component<any, IndexCustomizeStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      preview: false,
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
        this.setState({ load: true, data: res, preview })
        DingTalk.setTitle('主页定制')
      })
    } else {
      DingTalk.init().then(() => {
        DingTalk.setTitle('主页定制')
        IndexService.getData(preview).then(res => {
          console.log(res);
          this.setState({ load: true, data: res, preview })
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

  blockClick (block: IndexCustomizeInfo) {
    if (!this.state.preview) {
      if (block.type === 3) {
        block.property.url && DingTalk.openLink(block.property.url + '&timestamp=' + (new Date().getTime()))
      } else if (block.type === 0) {
        block.property.agentId && DingTalk.openMicroApp(block.property.agentId)
      } 
    }
  }
  
  renderContent () {
    const { width, data } = this.state
    const _width = width - 32
    const pixel = (width / 310);
    return (
      <YdyScrollView>
      {
        data.map((Item, index) => {
          let style: React.CSSProperties = {
            width: _width * (Item.width / 100),
            height: Item.height * pixel,
            top: Item.top * pixel,
            left: _width * (Item.left / 100),
            position: "absolute"
          }
          let content = this.format(Item)
          return (
            <div id={Item.property.name} key={index} style={objectAssign(style, Item.style)}
            onClick={() => this.blockClick(Item)}>
              <div 
                style={{position: 'absolute', width: '100%', height: '100%', top: 0}} 
                dangerouslySetInnerHTML={{ __html: content}}
              >
              </div>
              <span style={{color: 'transparent'}}>{Item.property.name}</span>
            </div>
          );
        })
      }
      </YdyScrollView>
    );
  }
  
  render() {
    const { width, height } = this.state
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: width - 32 + 'px', height: height - 32 + 'px', padding: 16 }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
      </div>
    );
  }
}

export default App;

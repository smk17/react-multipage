import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';
import { SwipeAction, List } from 'antd-mobile';

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
      DingTalk.setTitle('SwipeAction 滑动操作');
    })
  }
  
  renderContent () {
    return (
      <YdyScrollView>
      <List>
        <SwipeAction
          style={{ backgroundColor: 'gray' }}
          autoClose
          right={[
            {
              text: 'Cancel',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: 'Delete',
              onPress: () => console.log('delete'),
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
          left={[
            {
              text: 'Reply',
              onPress: () => console.log('reply'),
              style: { backgroundColor: '#108ee9', color: 'white' },
            },
            {
              text: 'Cancel',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <List.Item
            extra="More"
            arrow="horizontal"
            onClick={e => console.log(e)}
          >
            Have left and right buttons
          </List.Item>
        </SwipeAction>
        <SwipeAction
          style={{ backgroundColor: 'gray' }}
          autoClose
          left={[
            {
              text: 'Reply',
              onPress: () => console.log('reply'),
              style: { backgroundColor: '#108ee9', color: 'white' },
            },
            {
              text: 'Cancel',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <List.Item
            extra="More"
            arrow="horizontal"
            onClick={e => console.log(e)}
          >
            Only left buttons
          </List.Item>
        </SwipeAction>
        <SwipeAction
          style={{ backgroundColor: 'gray' }}
          autoClose
          right={[
            {
              text: 'Cancel',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: 'Delete',
              onPress: () => console.log('delete'),
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <List.Item
            extra="More"
            arrow="horizontal"
            onClick={e => console.log(e)}
          >
            Only right buttons
          </List.Item>
        </SwipeAction>
        <SwipeAction
          style={{ backgroundColor: 'gray' }}
          autoClose
          right={[
            {
              text: 'short',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: 'long text',
              onPress: () => console.log('delete'),
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <List.Item
            extra="More"
            arrow="horizontal"
            onClick={e => console.log(e)}
          >
            Different button width
          </List.Item>
        </SwipeAction>
        <SwipeAction
          style={{ backgroundColor: 'gray' }}
          autoClose
          right={[
            {
              text: 'button1',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: 'button2',
              onPress: () => console.log('delete'),
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <List.Item
            extra="More"
            arrow="horizontal"
            onClick={() => console.log('List.Item clicked!')}
          >
            List.Item with onClick
          </List.Item>
        </SwipeAction>
      </List>
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

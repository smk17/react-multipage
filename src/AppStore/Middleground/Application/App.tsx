import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import './App.less';
import { Card, List } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

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
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
    })
  }
  
  renderContent () {

    const { list } = this.props;
    return (
      <YdyMainLayout>   
        <div className="cardList">
          <List
            rowKey="id"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item =>
              (
                <List.Item key={item.id}>
                  <Card hoverable className="card" actions={[<a>申请</a>, <a>续费</a>]}>
                    <Card.Meta
                      avatar={<img alt="" className="cardAvatar" src={item.avatar} />}
                      title={<a href="#">{item.title}</a>}
                      description={
                        <Ellipsis className="item" lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              )
            }
          />
        </div>
      </YdyMainLayout>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: '100%', height: '100%' }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
      </div>
    );
  }
}

export default App;

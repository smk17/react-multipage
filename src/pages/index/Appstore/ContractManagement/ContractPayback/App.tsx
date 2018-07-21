import React from 'react';
import ReactDOM from "react-dom";
import { DingTalk } from '@/common/dingtalk';
import loading from '@/assets/img/load.gif';
import YdyScrollView from "@/components/YdyScrollView";
import { Icon, List, WingBlank, WhiteSpace, Badge, ListView, PullToRefresh, SwipeAction } from 'antd-mobile';
import { Service } from '@/common/Service';
import './App.less';
import YdyIcon from '@/components/YdyIcon';

interface ContractPaybackStateTypes extends AppStateTypes {
  showHeader: boolean,
  /** 数据加载是否完成 */
  isLoading: boolean,
  /** 下拉刷新是否完成 */
  refreshing: boolean,
  /** 数据源 */
  dataSource: any,
  begindate: string,
  enddate: string,
  user: string,
}
interface DateListTypes {
  id: number;
  title: string;
  icon: string;
  days: number;
  companyname: string;
  moeny: number;
  typename: string;
}
let dateList: DateListTypes[] = [
  {
    id: 0,
    title:'测试标题',
    icon:'',
    days:176,
    companyname:'测试公司',
    moeny:899088089,
    typename:'付款条件达到一致',
  }
]
for (let index = 1; index < 10; index++) {
  dateList.push(
    {
      id: index,
      title:'测试标题' + index,
      icon:'',
      days:17 * index,
      companyname:'测试公司' + index,
      moeny:88089 * index,
      typename:'付款条件达到一致',
    }
  )
}

class App extends React.Component<any, ContractPaybackStateTypes> {
  _lv: ListView | null = null
  _data: DateListTypes[] = [];
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      load: false,
      showHeader: false,
      isLoading: false,
      refreshing: false,
      width: window.innerWidth,
      height: window.innerHeight,
      dataSource,
      begindate: '',
      enddate: '',
      user:'全部',
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      });
      this._data = this._data.concat(dateList);
      DingTalk.setTitle('合同回款')
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._data),
        refreshing: false,
        isLoading: false,
      });
    })
    // this.getUserList();
  }

  getUserList = () =>{
    Service.executeService({
      name: '/service/controller/execute?_ajax=1',
      params: {
        id: 'getData',
        pageAddress: {"pageMode":0,"pageId":"Preview","moduleId":"Main","systemId":"IndexBuilder"},
      }
    }).then(result => {
      window.baseConfig.development && alert('getData : ' + JSON.stringify(result));
    }).catch(err => {
      window.baseConfig.development && alert('getData err: ' + JSON.stringify(err));
    })
  }

  /** 下拉刷新 */
  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // simulate initial Ajax
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dateList),
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  };

  /** 上拉加载更多 */
  onEndReached(event) {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    setTimeout(() => {
      this._data = this._data.concat(dateList);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._data),
        isLoading: false
      });
    }, 2000);
  }

  onScroll = (event) => {
    if (this._lv) {
      let lv: Element = ReactDOM.findDOMNode(this._lv) as Element;
      if (lv.scrollTop > 20) {
        this.setState({
          showHeader: true
        })
      } else {
        this.setState({
          showHeader: false
        })
      }
    }
  }

  renderHeader (position = false) {
    const { begindate, enddate, user } = this.state;
    const chosenDate = (date: string, key: string) => {
      let state: any = {}
      DingTalk.chosenDatePicker(date).then(res => {
        state[key] = res.value
        this.setState(state)
      })
    }
    const chosenUser = () => {
      DingTalk.chosenPicker({
        source: [ { key: '全部', value: '全部' }, { key: '张三', value: '张三' }, { key: '李四', value: '李四' } ],
        selectedKey: this.state.user
      }).then(res => {
        this.setState({
          user: res.key
        })
      })
    }
    const style: React.CSSProperties = {
      height: 'auto',
      position: 'absolute',
      backgroundColor: 'rgba(245, 245, 249, 0.96)',
      zIndex: 99,
      top: 0
    }
    return (
      <YdyScrollView style={ position ? style : {} }>
        <List className="App-list">
          <List.Item arrow="horizontal" extra={begindate || '请选择'} onClick={ () => chosenDate(begindate, 'begindate') }>应收日期</List.Item>
          <List.Item arrow="horizontal" extra={enddate || '请选择'}  onClick={ () => chosenDate(enddate, 'enddate') }> </List.Item>
          <List.Item arrow="horizontal" extra={user || '请选择'}  onClick={chosenUser}>负责人</List.Item>
        </List>
        <WhiteSpace size="lg" />
        <div className="report">
          <WingBlank size="lg">
            <div className="report-all">
              <div className="report-total">
                <div className="info-font">超过60天账龄款项数</div>
                <WhiteSpace size="sm" />
                <div>30 个</div>
              </div>
              <div className="report-total report-right">
                <div className="info-font">本期应收未收金额</div>
                <WhiteSpace size="sm" />
                <div>10,000,000.00 元</div>
              </div>
            </div>
          </WingBlank>
        </div>
        <WhiteSpace size="lg"/>
      </YdyScrollView>
    );
  }
  
  render() {
    const { showHeader } = this.state;
    const ListRow = (rowData: DateListTypes, sectionID, rowID, highlightRow) => {
      return (
        <SwipeAction key={rowID} style={{ backgroundColor: 'gray' }} autoClose
        right={[
          {
            text: '取消',
            onPress: () => console.log('cancel'),
            style: { padding: 10, backgroundColor: '#ddd', color: 'white' },
          },
          {
            text: 'DING',
            onPress: () => console.log('delete'),
            style: { padding: 10, backgroundColor: '#108ee9', color: 'white' },
          },
        ]}
        onOpen={() => console.log('global open')}
        onClose={() => console.log('global close')}>
          <div className={rowID===0?"info":"info info-border"} onClick={
            () => {
              DingTalk.open('ContractPaybackDetails', '&id=' + rowData.id)
            }
          }>
            <WhiteSpace size="md"/>
            <WingBlank size="lg">
              <div className="info-all">
                <div className="info-left"><Badge text="欠" hot  style={{
                  marginLeft:4,
                  fontSize:16,
                  padding: '4px 6px',
                  backgroundColor: '#fff',
                  borderRadius: 15,
                  color: 'red',
                  border: '2px solid red',
                }}></Badge>
                <WhiteSpace size="xs" />{rowData.days}天</div>
                <div className="info-right">
                  <div className="info-right-top">{rowData.title}</div>
                  <WhiteSpace size="sm" />
                  <div className="info-right-bottom info-font">
                    <div>业主单位：{rowData.companyname}</div>
                    <WhiteSpace size="xs" />
                    <div>欠款金额：{rowData.moeny}</div>
                    <WhiteSpace size="xs" />
                    <div>回款进度：{rowData.typename}</div>
                    <WhiteSpace size="xs" />
                  </div>
                </div>
              </div>
            </WingBlank>
            <WhiteSpace size="md"/>
          </div>
        </SwipeAction>
      );
    }
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    const report=(
      <YdyScrollView>
        {showHeader && this.renderHeader(true)}
        <ListView ref={ el => this._lv = el }
          dataSource={this.state.dataSource}
          renderHeader={() => this.renderHeader()}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? 'Loading...' : 'Loaded'}
          </div>)}
          renderRow={ListRow}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={4}
          scrollRenderAheadDistance={500}
          onScroll={this.onScroll}
          pullToRefresh={
            <PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={10}
        />
        <div className="App-plus"><YdyIcon size="lg" type="plus-circle-fill" color="#29A1F7" /></div>
      </YdyScrollView>
    );

    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
      {
        this.state.load ? report : LoadView
      }
      </div>
    );
  }
}

export default App;

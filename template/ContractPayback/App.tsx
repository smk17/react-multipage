import './App.less';
import React from 'react';
import ReactDOM from "react-dom";
import { DingTalk } from '@/common/DingTalk';
import loading from '@/assets/img/load.gif';
import YdyScrollView from "@/components/YdyScrollView";
import { List, WingBlank, WhiteSpace, Badge, ListView, PullToRefresh, SwipeAction } from 'antd-mobile';
import YdyIcon from '@/components/YdyIcon';
import ContractService from '../ContractService';
import { ContractPaybackInfo } from '../statement';
import { PickerResult } from '@/common/DingTalk/statement';

interface ContractPaybackStateTypes extends AppStateTypes {
  showHeader: boolean,
  /** 数据加载是否完成 */
  isLoading: boolean,
  /** 下拉刷新是否完成 */
  refreshing: boolean,
  /** 数据源 */
  dataSource: any,
  beginDate: string,
  endDate: string,
  user: string,
  /** 超过60天账龄款项数 */
  total: number,
  /** 本期应收未收金额 */
  uncollected: number
}

class App extends React.Component<any, ContractPaybackStateTypes> {
  /** 列表实例 */
  private _lv: ListView | null = null
  /** 列表数据源 */
  private _data: ContractPaybackInfo[] = [];
  /** 责任人Id */
  private _userId: string = ''
  private _pageIndex: number = 0
  private _hasMore: boolean = true

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
      beginDate: '',
      endDate: '',
      user:'全部',
      total: 0,
      uncollected: 0
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      });
      DingTalk.setTitle('合同回款')
      this.initList()
    })
  }

  async initList (pageIndex: number = 0) {
    const { beginDate, endDate } = this.state;
    await ContractService.getContractList({
      beginDate,
      endDate,
      userId: this._userId,
      pageIndex: pageIndex
    })
    .then(res => {
      this._pageIndex = pageIndex
      if (pageIndex === 0) {
        this._data = []
        this._hasMore = true
      }
      if (res.list.length === 0) {
        this._hasMore = false
        // return;
      }
      this._data = this._data.concat(res.list);
      this.setState({
        load: true,
        dataSource: this.state.dataSource.cloneWithRows(this._data),
        refreshing: false,
        isLoading: false,
        total: res.total,
        uncollected: res.uncollected
      });
      return;
    })
  }

  /** 下拉刷新 */
  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    this.initList();
  };

  /** 上拉加载更多 */
  onEndReached(event) {
    if (this.state.isLoading && !this._hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this._pageIndex++
    this.initList(this._pageIndex);
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
    const { beginDate, endDate, user, total, uncollected } = this.state;
    const chosenDate = (date: string, key: string) => {
      let state: any = {}
      DingTalk.chosenDatePicker(date).then(res => {
        state[key] = res.value
        this.setState(state)
        this.initList()
      })
    }
    const chosenUser = () => {
      ContractService.getPrincipalList().then(res => {
        let userList: PickerResult[] = [{ key: '全部', value: '' }]
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          userList.push({
            key: element.username,
            value: element.id
          })
        }
        DingTalk.chosenPicker({
          source: userList,
          selectedKey: this.state.user
        }).then(res => {
          this._userId = res.value
          this.setState({
            user: res.key
          })
          this.initList()
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
          <List.Item arrow="horizontal" extra={beginDate || '请选择'} onClick={ () => chosenDate(beginDate, 'beginDate') }>应收日期</List.Item>
          <List.Item arrow="horizontal" extra={endDate || '请选择'}  onClick={ () => chosenDate(endDate, 'endDate') }> </List.Item>
          <List.Item arrow="horizontal" extra={user || '请选择'}  onClick={chosenUser}>负责人</List.Item>
        </List>
        <WhiteSpace size="lg" />
        <div className="report">
          <WingBlank size="lg">
            <div className="report-all">
              <div className="report-total">
                <div className="info-font">超过60天账龄款项数</div>
                <WhiteSpace size="sm" />
                <div>{total} 个</div>
              </div>
              <div className="report-total report-right">
                <div className="info-font">本期应收未收金额</div>
                <WhiteSpace size="sm" />
                <div>{uncollected} 元</div>
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
    const ListRow = (rowData: ContractPaybackInfo, sectionID, rowID, highlightRow) => {
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
                <WhiteSpace size="xs" />{rowData.agingday}天</div>
                <div className="info-right">
                  <div className="info-right-top">{rowData.customname}</div>
                  <WhiteSpace size="sm" />
                  <div className="info-right-bottom info-font">
                    <div>款项名称 ：{rowData.moneytypename}</div>
                    <WhiteSpace size="xs" />
                    <div>应收未收金额 ：{rowData.uncollected}</div>
                    <WhiteSpace size="xs" />
                    <div>付款条件 ：{rowData.accordancename}</div>
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

import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import YdyScrollView from "@/components/YdyScrollView";
import { List, WingBlank, WhiteSpace, Badge, SwipeAction } from 'antd-mobile';
import ContractService from '../../ContractService';
import { ContractReceivablesInfo } from '../../statement';
import { PickerResult } from '@/common/DingTalk/statement';
import YdyListView from '@/components/YdyListView';

interface ContractReceivablesStateTypes extends AppStateTypes {
  showHeader: boolean,
  /** 数据加载是否完成 */
  // isLoading: boolean,
  hasMore: boolean,
  /** 下拉刷新是否完成 */
  // refreshing: boolean,
  /** 数据源 */
  // dataSource: any,
  beginDate: string,
  endDate: string,
  user: string,
  /** 超过60天账龄款项数 */
  total: number,
  /** 本期应收未收金额 */
  uncollected: number
  /** 列表数据源 */
  data: ContractReceivablesInfo[]
}

class ContractReceivables extends React.Component<any, ContractReceivablesStateTypes> {
  /** 责任人Id */
  private _userId: string = ''

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      load: false,
      showHeader: false,
      hasMore: true,
      width: window.innerWidth,
      height: window.innerHeight - 50,
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
      this.initList()
    })
  }

  async initList (pageIndex: number = 0) {
    const { beginDate, endDate } = this.state;
    let result = await ContractService.getContractReceivablesList({
      beginDate,
      endDate,
      userId: this._userId,
      pageIndex: pageIndex
    })
    let { data } = this.state;
    let hasMore = true;
    if (pageIndex === 0) {
      data = []
      hasMore = true
    }
    if (result.list.length === 0) {
      hasMore = false
      // return;
    }
    data = data.concat(result.list);
    this.setState({
      data,
      hasMore,
      load: true,
      total: result.total,
      uncollected: result.uncollected
    });
    return {
      pageIndex: pageIndex
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
    const { showHeader, hasMore, height, data } = this.state;
    const ListRow = (rowData: ContractReceivablesInfo, sectionID, rowID, highlightRow) => {
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
              DingTalk.open('ContractReceivablesDetails', '&id=' + rowData.id)
            }
          }>
            <WhiteSpace size="md"/>
            <WingBlank size="lg">
              <div className="info-all">
                <div className="info-left"><Badge text="欠" hot style={{
                  width: 30,
                  height: 30,
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
    return (
      <div style={ { width: window.innerWidth } }>
        {showHeader && this.renderHeader(true)}
        <YdyListView renderHeader={this.renderHeader()}  
        initList={this.initList.bind(this)} data={data}
        ListRow={ListRow} hasMore={hasMore} height={height} onScroll={
          (lv: Element) => {
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
        }/>
        {/* <div className="App-plus"><YdyIcon size="lg" type="plus-circle-fill" color="#29A1F7" /></div> */}
      </div>
    );
  }
}

export default ContractReceivables;
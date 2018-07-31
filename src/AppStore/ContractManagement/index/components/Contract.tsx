import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import YdyScrollView from "@/components/YdyScrollView";
import { List, WingBlank, WhiteSpace, Badge, SwipeAction } from 'antd-mobile';
import ContractService from '../../ContractService';
import { ContractInfo } from '../../statement';
import { PickerResult } from '@/common/DingTalk/statement';
import YdyListView from '@/components/YdyListView';

interface ContractReceivablesStateTypes extends AppStateTypes {
  showHeader: boolean,
  hasMore: boolean,
  companyName: string,
  /** 列表数据源 */
  data: ContractInfo[]
}

class Contract extends React.Component<any, ContractReceivablesStateTypes> {
  /** 签署公司Id */
  private _companyId: string = ''

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      load: false,
      showHeader: false,
      hasMore: true,
      width: window.innerWidth,
      height: window.innerHeight - 50,
      companyName:'全部',
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
    let result = await ContractService.getContractList({
      CompanyId: this._companyId,
      pageIndex: pageIndex
    })
    let { data } = this.state;
    let hasMore = true;
    if (pageIndex === 0) {
      data = []
      hasMore = true
    }
    if (result.data.length === 0) {
      hasMore = false
      // return;
    }
    data = data.concat(result.data);
    this.setState({
      data,
      hasMore,
      load: true,
    });
    return {
      pageIndex: pageIndex
    }
  }

  renderHeader (position = false) {
    const { companyName } = this.state;
    const chosenUser = () => {
      ContractService.getCompanyList().then(res => {
        let userList: PickerResult[] = [{ key: '全部', value: '' }]
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          userList.push({
            key: element.companyName,
            value: element.id
          })
        }
        DingTalk.chosenPicker({
          source: userList,
          selectedKey: this.state.companyName
        }).then(res => {
          this._companyId = res.value
          this.setState({
            companyName: res.key
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
          <List.Item arrow="horizontal" extra={companyName || '请选择'}  onClick={chosenUser}>签署公司</List.Item>
        </List>
        <WhiteSpace size="lg"/>
      </YdyScrollView>
    );
  }
  
  render() {
    const { showHeader, hasMore, height, data } = this.state;
    const ListRow = (rowData: ContractInfo, sectionID, rowID, highlightRow) => {
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
                <div className="info-left"><Badge text={''} hot style={{
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
                <WhiteSpace size="xs" /></div>
                <div className="info-right">
                  <div className="info-right-top">{rowData.signingCompanyName}</div>
                  <WhiteSpace size="sm" />
                  <div className="info-right-bottom info-font">
                    <div>签约客户 ：{rowData.customName}</div>
                    <WhiteSpace size="xs" />
                    <div>合同编号 ：{rowData.code}</div>
                    <WhiteSpace size="xs" />
                    <div>签约人 ：{rowData.userName}</div>
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

export default Contract;
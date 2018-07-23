import React from 'react';
import { DingTalk } from '@/common/DingTalk';
import { createForm, formShape } from 'rc-form';
import YdyScrollView from "@/components/YdyScrollView";
import { List, WingBlank, WhiteSpace, Badge, Button } from 'antd-mobile';
import loading from '@/assets/img/load.gif';
import './App.less';
import { ContractPaybackInfo } from '../statement';
import ContractService from '../ContractService';

interface ContractPaybackDetailsStateTypes extends AppStateTypes {
  /** 应收日期 */
  dccountsDueDate: string,
  /** 付款条件 */
  accordancename: string
  /** 付款流程 */
  launchname: string
  /** 款项 */
  approvalname: string
  info?: ContractPaybackInfo
}

class App extends React.Component<any, ContractPaybackDetailsStateTypes> {
  static propTypes = {
    form: formShape,
  };
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      dccountsDueDate: '',
      accordancename: '',
      launchname: '',
      approvalname: '',
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('应收款详情')
      let search =  window.location.search.substring(1).split('&')
      for (let index = 0; index < search.length; index++) {
        const element = search[index].split('=');
        const key = element[0];
        const val = element[1];
        if (key === 'id') {
          ContractService.getContractReceivablesDetails(val).then(res => {
            this.setState({
              info: res,
              dccountsDueDate: res.dccountsDueDate,
              accordancename: res.accordancename,
              launchname: res.launchname,
              approvalname: res.approvalname
            })
          })
        }
      }
    })
  }

  renderInfo () {
    const { info } = this.state;
    if (!info) {
      return <div style={{ padding: 10, textAlign: 'center' }}>加载中...</div>
    }
    return (
      <div className={"info info-border"}>
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
            <WhiteSpace size="xs" />{info.agingday}天</div>
            <div className="info-right">
              <div className="info-right-top">{info.customname}</div>
              <WhiteSpace size="sm" />
              <div className="info-right-bottom info-font">
                <div>款项名称 ：{info.moneytypename}</div>
                <WhiteSpace size="xs" />
                <div>应收未收金额 ：{info.uncollected}</div>
                <WhiteSpace size="xs" />
                <div>已开票金额 ：{info.invoiceMoney}</div>
                <WhiteSpace size="xs" />

                <div>应收责任人 ：{info.username}</div>
                <WhiteSpace size="xs" />
                <div>款项小类 ：{info.moneytypeclass}</div>
                <WhiteSpace size="xs" />
                <div>已回款金额 ：{info.useMoney}</div>
                <WhiteSpace size="xs" />
                <div>未开票金额 ：{info.uncollected}</div>
                <WhiteSpace size="xs" />

                <div>账龄 ：{info.agingday}</div>
                <WhiteSpace size="xs" />
                <div>应收未收 ：{info.money}</div>
                <WhiteSpace size="xs" />
                <div>合同编号 ：{info.contractcode}</div>
                <WhiteSpace size="xs" />
              </div>
            </div>
          </div>
        </WingBlank>
        <WhiteSpace size="md"/>
        <WhiteSpace size="md"/>
      </div>
    );
  }
  
  renderContent () {
    const { getFieldProps } = this.props.form;
    const { dccountsDueDate, accordancename, approvalname, launchname } = this.state
    let Item = (title, name, key) => {
      return (
        <List.Item arrow="horizontal"
          {...getFieldProps(key, {
            initialValue: name
          })}
          extra={name === '' ? '请选择' : null}
        >
          {title} 
          {/* <span style={{color: 'rgb(244, 51, 60)'}}>*</span> */}
          {name}
        </List.Item>
      );
    }
    return (
      <YdyScrollView>
        {this.renderInfo()}
        <WhiteSpace />
        { Item('应收日期', dccountsDueDate, 'dccountsDueDate') }
        { Item('付款条件', accordancename, 'accordancename') }
        { Item('付款流程', launchname, 'launchname') }
        { Item('款项', approvalname, 'approvalname') }
        <WhiteSpace />
      </YdyScrollView>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    const submit = () => {
      this.props.form.validateFields((error, value) => {
        DingTalk.alert(JSON.stringify(value))
      });
    }
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
        { this.state.load && <WingBlank style={{width: '-webkit-fill-available'}}>
          <Button type="primary" onClick={submit}>提交</Button><WhiteSpace />
        </WingBlank>}
      </div>
    );
  }
}

export default createForm()(App);

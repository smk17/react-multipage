import React from 'react';
import objectAssign from "object-assign";
import { DingTalk } from '@/common/DingTalk';
import { createForm, formShape } from 'rc-form';
import YdyScrollView from "@/components/YdyScrollView";
import { List, WingBlank, WhiteSpace, Badge, Button } from 'antd-mobile';
import loading from '@/assets/img/load.gif';
import './App.less';
import { ContractReceivablesInfo } from '../statement';
import ContractService from '../ContractService';
import { DateHelper } from '@/common/Utils';

interface ContractPaybackDetailsStateTypes extends AppStateTypes {
  /** 应收日期 */
  predictDccountsDueDate: string,
  info?: ContractReceivablesInfo
}

class App extends React.Component<any, ContractPaybackDetailsStateTypes> {
  static propTypes = {
    form: formShape,
  };
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      predictDccountsDueDate: '',
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
      this.initDetails()
    })
  }

  initDetails () {
    let search =  window.location.search.substring(1).split('&')
    for (let index = 0; index < search.length; index++) {
      const element = search[index].split('=');
      const key = element[0];
      const val = element[1];
      if (key === 'id') {
        ContractService.getContractReceivablesDetails(val).then(res => {
          this.setState({
            info: res,
            predictDccountsDueDate: DateHelper.format(res.predictDccountsDueDate)
          })
        })
      }
    }
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
    const { predictDccountsDueDate, info } = this.state
    if (info) {
      let Item = (title: string, name: string, key: string, onClick: () => void) => {
        return (
          <List.Item arrow="horizontal"
            {...getFieldProps(key, {
              initialValue: name
            })}
            extra={name === '' ? '请选择' : null}
            onClick={onClick}
          >
            <div className="ydy-list-content">
              <span style={{fontSize: 17, flex: 2}}>{title}</span>
              <span style={{fontSize: 16, flex: 5}}>{name}</span>
              {/* <span style={{color: 'rgb(244, 51, 60)'}}>*</span> */}
            </div>
          </List.Item>
        );
      }
      const dccountsDueDateClick = () => {
        DingTalk.chosenDatePicker(predictDccountsDueDate).then(res => {
          this.setState({ predictDccountsDueDate: res.value })
        })
      }
      const accordancenameClick = () => {
        DingTalk.chosenPicker({
          source: [
            { key: '与客户达成一致', value: '0' },
            { key: '与客户未达成一致', value: '1' }
          ],
          selectedKey: info.accordancename
        }).then(res => {
          info.accordancename = res.key
          info.isAccordance = Number(res.value)
          this.setState({ info: info })
        })
      }
      const launchnameClick = () => {
        DingTalk.chosenPicker({
          source: [
            { key: '已发起审批', value: '0' },
            { key: '未发起审批', value: '1' }
          ],
          selectedKey: info.launchname
        }).then(res => {
          info.launchname = res.key
          info.isLaunch = Number(res.value)
          this.setState({ info: info })
        })
      }
      const approvalnameClick = () => {
        DingTalk.chosenPicker({
          source: [
            { key: '已审批', value: '0' },
            { key: '未审批', value: '1' }
          ],
          selectedKey: info.approvalname
        }).then(res => {
          info.approvalname = res.key
          info.isApproval = Number(res.value)
          this.setState({ info: info })
        })
      }
      return (
        <YdyScrollView>
          {this.renderInfo()}
          <WhiteSpace />
          { Item('应收日期', predictDccountsDueDate, 'predictDccountsDueDate', dccountsDueDateClick) }
          { Item('付款条件', info.accordancename, 'accordancename', accordancenameClick) }
          { Item('付款流程', info.launchname, 'launchname', launchnameClick) }
          { Item('款项', info.approvalname, 'approvalname', approvalnameClick) }
          <WhiteSpace />
        </YdyScrollView>
      );
    } else {
      return <div>加载中</div>
    }
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    const submit = () => {
      this.props.form.validateFields((error, value) => {
        if (this.state.info) {
          console.log(value.predictDccountsDueDate);
          console.log(this.state.info.predictDccountsDueDate);
          const isUpdateDccountsDueDate = value.predictDccountsDueDate === DateHelper.format(this.state.info.predictDccountsDueDate)
          ContractService.saveContractReceivables(objectAssign(this.state.info, value), !isUpdateDccountsDueDate).then(res => {
            DingTalk.alert('保存成功').then(this.initDetails)
          })
        }
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

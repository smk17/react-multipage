import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { createForm, formShape } from 'rc-form';
import YdyScrollView from "@/components/YdyScrollView";
import { List, WingBlank, WhiteSpace, Badge, Button, TextareaItem } from 'antd-mobile';
import loading from '@/assets/img/load.gif';
import './App.less';

interface ContractPaybackDetailsStateTypes extends AppStateTypes {
  typename: string
}

class App extends React.Component<any, ContractPaybackDetailsStateTypes> {
  static propTypes = {
    form: formShape,
  };
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      typename: '',
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('回款详情')
    })
  }

  renderInfo () {
    const rowData = {
      id: 0,
      title:'测试标题',
      icon:'',
      days:176,
      companyname:'测试公司',
      moeny:899088089,
      typename:'付款条件达到一致',
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
    );
  }
  
  renderContent () {
    let errors;
    const { getFieldProps, getFieldError } = this.props.form;
    const { typename } = this.state
    return (
      <YdyScrollView>
        {this.renderInfo()}
        <WhiteSpace />
        <List.Item arrow="horizontal"
          {...getFieldProps('typename', {
            initialValue: typename
          })}
          onClick={
            () => {
              DingTalk.chosenPicker({
                source: [
                  {
                    key: '付款条件达成一致',
                    value: '付款条件达成一致'
                  },
                  {
                    key: '达到付款条件',
                    value: '达到付款条件'
                  },
                  {
                    key: '款项已审批',
                    value: '款项已审批'
                  },
                  {
                    key: '已回款',
                    value: 'v'
                  }
                ],
                selectedKey: '付款条件达成一致'
              }).then(res => {
                this.setState({
                  typename: res.key
                })
              })
            }
          }
          extra={typename === '' ? '请选择' : null}
        >
          回款进度 <span style={{color: 'rgb(244, 51, 60)'}}>*</span>  {typename}
        </List.Item><WhiteSpace />
        <TextareaItem
          {...getFieldProps('description')}
          placeholder="请填写"
          rows={5}
          count={200}
        />
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

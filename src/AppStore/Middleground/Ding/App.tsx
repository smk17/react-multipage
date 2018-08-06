import React from 'react';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import { Form, Input, Card,Button  } from 'antd';
import './App.less';
import { DingCorpParams } from '../statement';
import MiddlegroundService from '../MiddlegroundService';

const FormItem = Form.Item;

interface AppDingState extends AppStateTypes{
  submitting: boolean,
  dingCorpParams?:DingCorpParams,
};

class App extends React.Component<any, AppDingState> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight,
      submitting:false,
    };
  }

  componentDidMount () {
    MiddlegroundService.hasLoginInfo();
    this.setState({
      load: true,
    });
    MiddlegroundService.getDingCorp().then(res=>{
      this.setState({
        dingCorpParams:res,
      })
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {   
        const dingCorpParams: DingCorpParams={
          id: values.id,
          tenantId:sessionStorage.getItem("tenantId"),
          corpId:values.corpId,
          corpSecret:values.corpSecret,
        };
        console.log(dingCorpParams);
        this.setState({submitting:true});
          MiddlegroundService.saveDingCorp(dingCorpParams).then(res => {
          console.log(res);
          this.setState({submitting:false});
        })
      }
    });
  };

  renderContent () {

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <YdyMainLayout handleLoginOut={MiddlegroundService.handleLoginOut}>   
        <Card bordered={false}>
          <Form  onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="CorpId">
              {getFieldDecorator('corpId', {
                initialValue:this.state.dingCorpParams ? this.state.dingCorpParams.corpId:'',
                rules: [
                  {
                    required: true,
                    message: 'CorpId不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入CorpId" maxLength={30} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="CorpSecret">
              {getFieldDecorator('corpSecret', {
                initialValue:this.state.dingCorpParams ? this.state.dingCorpParams.corpSecret:'',
                rules: [
                  {
                    required: true,
                    message: 'CorpSecret不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入CorpSecret" maxLength={50}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label=" " colon={false} style={{textAlign:'left'}}>
              <a href={'https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.3k06YP&treeId=385&articleId=106926&docType=1#s0'} target={'_blank'}>获取CorpId，CorpSecret等开发信息</a>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={this.state.submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </YdyMainLayout>
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

export default Form.create()(App);

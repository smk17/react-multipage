import React from 'react';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import { Form, Input, Card,Button, } from 'antd';
import './App.less';
import { TenantParams,UserParams } from '../statement';
import MiddlegroundService from '../MiddlegroundService';

const FormItem = Form.Item;

interface AppTenantState extends AppStateTypes{
  submitting: boolean,
};

class App extends React.Component<any, AppTenantState> {
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
    this.setState({
      load: true,
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const  userParams: UserParams={
          id: sessionStorage.getItem("userId"),
          code:values.code,
          password:values.password,
          name:values.name,
          email:values.email,
          mobile:values.mobile,
        };
        const tenantParams: TenantParams={
          id: sessionStorage.getItem("tenantId"),
          name:values.tenantname
        };
        console.log(userParams);
        console.log(tenantParams);
      //  this.setState({submitting:true});
       MiddlegroundService.saveTenantAndUser(tenantParams, userParams).then(res => {
        console.log(res);
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
      <YdyScrollView>   
        <Card bordered={false}>
          <Form  onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('tenantname', {
                rules: [
                  {
                    required: true,
                    message: '公司名称不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入公司名称" maxLength={30} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="登陆名">
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: '登陆名不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入登陆名" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input type="password" placeholder="请输入密码" maxLength={20}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '姓名不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入姓名" maxLength={20}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email', message: '邮箱格式不正确',
                  },
                  {
                    required: true,
                    message: '邮箱不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入邮箱" maxLength={50}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/, message: '手机格式不正确',
                  },
                  {
                    required: true,
                    message: '手机不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input addonBefore="+86" placeholder="请输入手机" maxLength={11} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={this.state.submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
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

export default Form.create()(App);

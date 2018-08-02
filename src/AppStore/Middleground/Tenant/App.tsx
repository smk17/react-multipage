import React from 'react';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import { Form,Input,Card,} from 'antd';
import { createForm } from 'rc-form';
import './App.less';

const FormItem = Form.Item;

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
    this.setState({
      load: true,
    })
  }
  
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

    return (
      <YdyScrollView>   
        <Card bordered={false}>
          <Form>
          <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('tenantname', {
                rules: [
                  {
                    required: true,
                    message: '公司名称不能为空',
                  },
                ],
              })(<Input placeholder="请输入公司名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: '登陆名不能为空',
                  },
                ],
              })(<Input placeholder="请输入登陆名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
              })(<Input type="password" placeholder="请输入密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '姓名不能为空',
                  },
                ],
              })(<Input placeholder="请输入姓名" />)}
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
                  },
                ],
              })(<Input placeholder="请输入邮箱" />)}
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
                  },
                ],
              })(<Input addonBefore="+86" placeholder="请输入手机" />)}
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

export default  createForm()(App);

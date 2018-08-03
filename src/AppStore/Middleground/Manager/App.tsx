import React from 'react';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import { Form, Input, Card,Button, } from 'antd';
import './App.less';
import { UserParams } from '../statement';
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
          name:values.name,
          email:values.email,
          mobile:values.mobile,
        };
        console.log(userParams);
       this.setState({submitting:true});
       MiddlegroundService.saveUser(userParams).then(res => {
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
      <YdyMainLayout>   
        <Card bordered={false}>
          <Form  onSubmit={this.handleSubmit}>
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

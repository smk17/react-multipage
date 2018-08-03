import React from 'react';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import { Form, Input, Card,Button, } from 'antd';
import './App.less';
import { UserPasswordParams } from '../statement';
import MiddlegroundService from '../MiddlegroundService';

const FormItem = Form.Item;

interface AppTenantState extends AppStateTypes{
  submitting: boolean,
  userPasswordParams?: UserPasswordParams,
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
      userPasswordParams:MiddlegroundService.getUserPassword(),
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const  userPasswordParams: UserPasswordParams={
          id: sessionStorage.getItem("userId"),
          code:values.code,
          password:values.password,
        };
        console.log(userPasswordParams);
       this.setState({submitting:true});
       MiddlegroundService.saveUserPassword(userPasswordParams).then(res => {
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
            <FormItem {...formItemLayout} label="登陆名">
              {getFieldDecorator('code', {
                initialValue:this.state.userPasswordParams ? this.state.userPasswordParams.code:'',
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
                initialValue:this.state.userPasswordParams ? this.state.userPasswordParams.password:'',
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input type="password" placeholder="请输入密码" maxLength={20}/>)}
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

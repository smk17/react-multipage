import React from 'react';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import { Form, Input, Card,Button,Cascader  } from 'antd';
import './App.less';
import { TenantParams } from '../statement';
import MiddlegroundService from '../MiddlegroundService';
import Area from "@/common/Area";

const FormItem = Form.Item;

interface AppTenantState extends AppStateTypes{
  submitting: boolean,
  tenantParams?:TenantParams,
  areaOptions:any,
};

class App extends React.Component<any, AppTenantState> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight,
      submitting:false,
      areaOptions:Area,
    };
  }

  componentDidMount () {
    console.log(this.state.areaOptions);
    MiddlegroundService.hasLoginInfo();
    this.setState({
      load: true,
      tenantParams:MiddlegroundService.getTenant(),
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {   
        const tenantParams: TenantParams={
          id: sessionStorage.getItem("tenantId"),
          name:values.companyName,
          conpanyname:values.companyName,
          area:values.area,
          contact:values.contact,
        };
        console.log(tenantParams);
        this.setState({submitting:true});
          MiddlegroundService.saveTenant(tenantParams).then(res => {
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
          <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('companyName', {
                initialValue:this.state.tenantParams ? this.state.tenantParams.conpanyname:'',
                rules: [
                  {
                    required: true,
                    message: '企业名称不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入企业名称" maxLength={30} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="地区">
              {getFieldDecorator('area', {
                initialValue:this.state.tenantParams ? this.state.tenantParams.area:'',
                rules: [
                  {
                    required: true,
                    message: '地区不能为空',
                    whitespace:true,
                  },
                ],
              })(<Cascader options={this.state.areaOptions} placeholder="请选择地区" changeOnSelect  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系方式">
              {getFieldDecorator('contact', {
                initialValue:this.state.tenantParams ? this.state.tenantParams.contact:'',
                rules: [
                  {
                    required: true,
                    message: '联系方式不能为空',
                    whitespace:true,
                  },
                ],
              })(<Input placeholder="请输入联系方式" maxLength={50}/>)}
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

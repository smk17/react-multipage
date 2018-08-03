import React, { CSSProperties } from 'react';
import YdyMainLayout from "@/components/YdyMainLayout";
import loading from '@/assets/img/load.gif';
import './App.less';
import { Form,Card, List,Badge , Modal,Button, InputNumber } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { AppInfo,TenantAppApplyInfo } from '../statement';
import MiddlegroundService from '../MiddlegroundService';
import moment from 'moment';
import { FormComponentProps } from 'antd/lib/form';


const AppRemark=(props => {
  const { modalVisible, handleModalVisible,Remark } = props;
  return (
    <Modal
      title="应用信息"
      visible={modalVisible}
      onOk={() => handleModalVisible(false)}
      onCancel={() => handleModalVisible(false)}
      wrapClassName="vertical-center-modal"
      footer={[
        <Button key="submit" type="primary" onClick={() => handleModalVisible(false)}>
          确定
        </Button>,
      ]}
    >
      <div dangerouslySetInnerHTML={{ __html: Remark}}>      
      </div>
    </Modal>
  );
});
  
const FormItem = Form.Item;

interface AppApplyForm extends FormComponentProps{
  handleAdd:(fields:any)=>void,
  handleModalVisible:(flag:any)=>void,
  modalVisible:boolean,
  loading:boolean,
};

const CreateForm = Form.create()((props:AppApplyForm) => {
  const { modalVisible, form, handleAdd,loading, handleModalVisible } = props;
  const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
      md: { span: 17 },
    },
  };
  return (
    <Modal
      title="应用申请"
      closable={false}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      footer={[
        <Button key="back" onClick={() => handleModalVisible(false)}>取消</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          保存
        </Button>,
      ]}
    >
      <FormItem {...formItemLayout} label="申请使用时长(小时)">
        {form.getFieldDecorator('useTo', {
          rules: [{ required: true, message: '申请使用时长不能为空' }],
        })(<InputNumber placeholder="请输入申请使用时长" style={{width:'100%'}} max={288000} />)}
      </FormItem>
    </Modal>
  );
});

interface AppState extends AppStateTypes{
  submitting: boolean,
  applist?:any[],
  tenantAppApplyInfoParams?: TenantAppApplyInfo,
  modalVisible:boolean,
  modalVisibleForm:boolean,
  selectApp?:AppInfo,
};

class App extends React.Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight,
      submitting:false,
      modalVisible:false,
      modalVisibleForm:false,
    };
  }

  componentDidMount () {
    this.setState({
      load: true,
      applist:MiddlegroundService.getAppList(),
    })
  }
  
  handleAdd = fields => {  
    const tenantAppApplyInfo:TenantAppApplyInfo={
      tenantId: sessionStorage.getItem("tenantId"),
      appId:this.state.selectApp?this.state.selectApp.id:'',
      applyOn: moment().toDate(),
      applyBy:sessionStorage.getItem("userId"),
      useTo:fields.useTo,
    };
    console.log(tenantAppApplyInfo);
    this.setState({submitting:true});
    MiddlegroundService.saveTenantAppApply(tenantAppApplyInfo).then(res => {
      console.log(res);
        this.setState({
        modalVisibleForm: false,
        submitting: false,
      });
    })
  };

  handleModalVisibleForm = flag => {
    this.setState({
      modalVisibleForm: !!flag,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSetRemark = item=>{
    this.setState({
      selectApp: item,
    });
  };

  getactions(item:AppInfo){
    let _actions:any[]=[];
    switch(item.applyState){
      case 2:
        _actions.push(<a>审核中...</a>);
      break;
      case 3:
        _actions.push(<a onClick={()=>{this.handleModalVisibleForm(true);this.handleSetRemark(item)}}>续费</a>);
      break;
      default:
        _actions.push(<a onClick={()=>{this.handleModalVisibleForm(true);this.handleSetRemark(item)}}>申请</a>);
      break;
    }
    return [<a onClick={()=>{this.handleModalVisible(true);this.handleSetRemark(item)}}>详情</a>,..._actions];
  }

  getCount(item:AppInfo):string{
    let _count:string='';
    switch(item.applyState){
      case 2:
        _count='审核中...';
      break;
      case 3:
        _count='已申请';
      break;
      default:
        _count='未申请';
      break;
    }
    return _count;
  }

  getStyle(item:AppInfo):CSSProperties{
    let _style:any={};
    switch(item.applyState){
      case 2:
        _style={ backgroundColor: '#faad14' };
      break;
      case 3:
        _style={ backgroundColor: '#52c41a' };
      break;
      default:
        _style={};
      break;
    }
    return _style;
  }

  renderContent () {
    return (
      <YdyMainLayout>   
        <div className="cardList">
          <List
            rowKey="id"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.applist}
            renderItem={item =>
              (
                <List.Item key={item.id}>
                  <Badge count={this.getCount(item)} style={this.getStyle(item)}>
                    <Card hoverable className="card" actions={this.getactions(item)}>
                      <Card.Meta
                        avatar={<img alt="" className="cardAvatar" src={item.icon} />}
                        title={<a href="#">{item.name}</a>}
                        description={
                          <Ellipsis className="item" lines={3}>
                            {item.info}
                          </Ellipsis>
                        }
                      />
                    </Card>
                  </Badge>
                </List.Item>
              )
            }
          />
        </div>
        <AppRemark handleModalVisible={this.handleModalVisible} 
                   modalVisible={this.state.modalVisible} 
                   Remark={this.state.selectApp?this.state.selectApp.remark:''} />
        <CreateForm handleAdd={this.handleAdd}
                    handleModalVisible={this.handleModalVisibleForm} 
                    modalVisible={this.state.modalVisibleForm} 
                    loading={this.state.submitting} />
      </YdyMainLayout>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: '100%', height: '100%' }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
      </div>
    );
  }
}

export default App;

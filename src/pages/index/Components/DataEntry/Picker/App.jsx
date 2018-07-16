import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';
import { Picker, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import arrayTreeFilter from 'array-tree-filter';

import { district, provinceLite } from 'antd-mobile-demo-data';

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
  <div
    onClick={props.onClick}
    style={{ backgroundColor: '#fff', paddingLeft: 15 }}
  >
    <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
      <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
    </div>
  </div>
);

const seasons = [
  [
    {
      label: '2013',
      value: '2013',
    },
    {
      label: '2014',
      value: '2014',
    },
  ],
  [
    {
      label: '春',
      value: '春',
    },
    {
      label: '夏',
      value: '夏',
    },
  ],
];

class Test extends React.Component {
  state = {
    data: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    sValue: ['2013', '春'],
    visible: false,
  };
  onClick = () => {
    setTimeout(() => {
      this.setState({
        data: provinceLite,
      });
    }, 120);
  };
  onPickerChange = (val) => {
    console.log(val);
    let colNum = 1;
    const d = [...this.state.data];
    const asyncValue = [...val];
    if (val[0] === 'zj') {
      d.forEach((i) => {
        if (i.value === 'zj') {
          colNum = 2;
          if (!i.children) {
            i.children = [{
              value: 'zj-nb',
              label: '宁波',
            }, {
              value: 'zj-hz',
              label: '杭州',
            }];
            asyncValue.push('zj-nb');
          } else if (val[1] === 'zj-hz') {
            i.children.forEach((j) => {
              if (j.value === 'zj-hz') {
                j.children = [{
                  value: 'zj-hz-xh',
                  label: '西湖区',
                }];
                asyncValue.push('zj-hz-xh');
              }
            });
            colNum = 3;
          }
        }
      });
    } else {
      colNum = 1;
    }
    this.setState({
      data: d,
      cols: colNum,
      asyncValue,
    });
  };
  getSel() {
    const value = this.state.pickerValue;
    if (!value) {
      return '';
    }
    const treeChildren = arrayTreeFilter(district, (c, level) => c.value === value[level]);
    return treeChildren.map(v => v.label).join(',');
  }
  onDingTalkClick = () => {
    if (!(window.dd.version === null)) {
      window.dd.ready(() => {
        window.dd.biz.util.chosen({
          source:[{
              key: '选项1', //显示文本
              value: '123' //值，
          },{
              key: '选项2',
              value: '234'
          }],
         selectedKey:'选项2' , // 默认选中的key
         onSuccess : function(result) {
          window.baseConfig.development && alert('chosen result: ' + JSON.stringify(result));
         },
         onFail : function(err) {
          window.baseConfig.development && alert('chosen err: ' + JSON.stringify(err));
         }
        })
      });
    } else {
      // window.location = url
    }
  }
  // setVal() {
  //   this.props.form.setFieldsValue({
  //     district: ['340000', '340800', '340822'],
  //   });
  // },
  render() {
    const { getFieldProps } = this.props.form;
    const SingleData = [
      { value: "Test1", label: "测试一" },
      { value: "Test2", label: "测试二" },
      { value: "Test3", label: "测试三" },
      { value: "Test4", label: "测试四" },
    ]
    return (<div>
      <WhiteSpace size="lg" />
      <List style={{ backgroundColor: 'white' }} className="picker-list">
        <Picker extra="请选择(可选)"
          data={district}
          title="Areas"
          {...getFieldProps('district', {
            initialValue: ['340000', '341500', '341502'],
          })}
          onOk={e => console.log('ok', e)}
          onDismiss={e => console.log('dismiss', e)}
        >
          <List.Item arrow="horizontal">Multiple & cascader</List.Item>
        </Picker>
        <Picker
          data={seasons}
          title="选择季节"
          cascade={false}
          extra="请选择(可选)"
          value={this.state.sValue}
          onChange={v => this.setState({ sValue: v })}
          onOk={v => this.setState({ sValue: v })}
        >
          <List.Item arrow="horizontal">Multiple</List.Item>
        </Picker>
        <Picker data={SingleData} cols={1} {...getFieldProps('district3')} className="forss">
          <List.Item arrow="horizontal">Single</List.Item>
        </Picker>
        <List.Item arrow="horizontal" onClick={this.onDingTalkClick}>Single DingTalk</List.Item>
        <Picker
          data={this.state.data}
          cols={this.state.cols}
          value={this.state.asyncValue}
          onPickerChange={this.onPickerChange}
          onOk={v => console.log(v)}
        >
          <List.Item arrow="horizontal" onClick={this.onClick}>Multiple & async</List.Item>
        </Picker>
        <Picker
          title="选择地区"
          extra="请选择(可选)"
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <CustomChildren>Customized children</CustomChildren>
        </Picker>
        <Picker
          visible={this.state.visible}
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={() => this.setState({ visible: false })}
          onDismiss={() => this.setState({ visible: false })}
        >
          <List.Item extra={this.getSel()} onClick={() => this.setState({ visible: true })}>
            Visible state
          </List.Item>
        </Picker>
      </List>
    </div>);
  }
}

const TestWrapper = createForm()(Test);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init()
    // setTimeout(() => {
    //   this.setState({
    //     load: true,
    //   })
    //   DingTalk.setTitle('开始吧');
    // }, 2000);
    console.log(district);
    this.setState({
      load: true,
    })
    DingTalk.setTitle('Picker 选择器');
  }
  
  renderContent () {
    return (
      <YdyScrollView style={{ backgroundColor: 'white' }}>
        <TestWrapper />
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

export default App;

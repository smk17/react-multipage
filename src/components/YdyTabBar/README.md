# YdyTabBar 标签栏

> 位于 APP 底部，方便用户在不同功能模块之间进行快速切换。

## 规则

- 用作 APP 的一级分类，数量控制在 3-5 个之间。
- 即使某个 Tab 不可用，也不要禁用或者移除该 Tab。
- 使用 Badge 进行提示，足不出户也能知道有内容更新。

## API

|属性         |说明      |类型    |默认值|
|-----        |-----    |-----   |-----|
|tabBarItems  |标签子项  |object[]|[]|

ps: 把官方的 TabBar.Item 改成 tabBarItems 选项，只需对应的配置即可使用，具体使用看demo
ps: 其他API和[TabBar](https://mobile.ant.design/components/tab-bar-cn/)一致

## Demo

~~~ jsx
import YdyTabBar from '@/components/YdyTabBar';
import YdyScrollView from "@/components/YdyScrollView";
class YdyTabBarExample extends React.Component {
  render() {
    const tabBarItems = [
      {
        id: 'components', // id, 唯一标识, 主要给测试使用
        name: '组件', // 标题文字
        size: '22px', // 大小，目前固定22px
        selectedTab: 'blueTab', // 选中时对应的唯一标识
        badge: 1, // 徽标数
        dot: false, // 是否在右上角显示小红点（在设置badge的情况下失效）
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>blueTab</YdyScrollView>, // 对应的页面
        icon: 'https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg', // 默认展示图片
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg' // 选中后的展示图片
      },
      {
        id: 'api',
        name: '接口',
        size: '22px',
        selectedTab: 'redTab',
        badge: 'new',
        dot: false,
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>redTab</YdyScrollView>,
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg',
        selectedIcon: 'https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg'
      },
      {
        id: 'friend',
        name: '朋友',
        size: '22px',
        selectedTab: 'greenTab',
        badge: '',
        dot: true,
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>greenTab</YdyScrollView>,
        icon: 'https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg',
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg'
      },
      {
        id: 'me',
        name: '我的',
        size: '22px',
        selectedTab: 'yellowTab',
        badge: '',
        dot: false,
        renderContent: <YdyScrollView style={{ backgroundColor: 'white' }}>yellowTab</YdyScrollView>,
        icon: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg',
        selectedIcon: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg'
      }
    ];
    return (
      <div className="App">
      <YdyTabBar ref="YdyTabBar" tabBarItems={tabBarItems} selectedTab="blueTab"/>
      </div>
    );
  }
}
ReactDOM.render(<YdyTabBarExample />, mountNode);
~~~

PS: 基于[TabBar](https://mobile.ant.design/components/tab-bar-cn/)实现
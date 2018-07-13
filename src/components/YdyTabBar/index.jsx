import React from 'react';
import PropTypes from 'prop-types';
import { TabBar } from 'antd-mobile';
import { DingTalk } from '@/common/dingtalk';
import './index.less';

class YdyTabBar extends React.Component {
  static propTypes = {
    onPress: PropTypes.func, // 点击tab时触发的事件
    selectedTab: PropTypes.string.isRequired, // 默认要选中的tab
    prefixCls: PropTypes.string, // 样式前缀
    unselectedTintColor: PropTypes.string, // 未选中的字体颜色
    tintColor: PropTypes.string, // 选中的字体颜色
    barTintColor: PropTypes.string, // tabbar 背景色
    hidden: PropTypes.bool, // 是否隐藏	
    noRenderContent: PropTypes.bool, // 不渲染内容部分
    prerenderingSiblingsNumber: PropTypes.number, // 预加载相邻的tab内容, Infinity: 加载所有的tab内容, 0: 仅加载当前tab内容, 当页面较复杂时，建议设为0，提升页面加载性能
    tabBarPosition: PropTypes.string, // tabbar 位置 'top'|'bottom'
    tabBarItems: PropTypes.array.isRequired
  };

  static defaultProps = {
    onPress: () => {},
    selectedTab: '',
    prefixCls: 'am-tab-bar',
    tabBarPosition: 'bottom',
    prerenderingSiblingsNumber: 1,
    noRenderContent: false,
    unselectedTintColor: '#949494',
    tintColor: '#33A3F4',
    barTintColor: 'white',
    hidden: false,
    tabBarItems: []
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.selectedTab
    };
  }

  render() {
    const tabItems = this.props.tabBarItems.map((Item) => {
      this.state.selectedTab === Item.selectedTab && DingTalk.setTitle(Item.name)
      return (
        <TabBar.Item
          data-id={Item.id}
          title={Item.name}
          key={Item.id}
          icon={<div style={{
            width: Item.size,
            height: Item.size,
            background: `url(${Item.icon}) center center /  ${Item.size} ${Item.size} no-repeat` }}
          />
          }
          selectedIcon={<div style={{
            width: Item.size,
            height: Item.size,
            background: `url(${Item.selectedIcon}) center center /  ${Item.size} ${Item.size} no-repeat` }}
          />
          }
          selected={this.state.selectedTab === Item.selectedTab}
          badge={Item.badge}
          dot={Item.dot}
          onPress={() => {
            if (this.state.selectedTab !== Item.selectedTab) {
              this.setState({
                selectedTab: Item.selectedTab,
              });
              DingTalk.setTitle(Item.name);
              this.props.onPress();
            }
          }}
        >
          {Item.renderContent}
        </TabBar.Item>
      );
    });
    return (
      <TabBar style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}
        prefixCls={this.props.prefixCls}
        unselectedTintColor={this.props.unselectedTintColor}
        tintColor={this.props.tintColor}
        barTintColor={this.props.barTintColor}
        noRenderContent={this.props.noRenderContent}
        prerenderingSiblingsNumber={this.props.prerenderingSiblingsNumber}
        tabBarPosition={this.props.tabBarPosition}
        hidden={this.state.hidden}
      >
        {tabItems}
      </TabBar>
    );
  }
}
export default YdyTabBar;
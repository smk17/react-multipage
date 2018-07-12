import React from 'react';
import PropTypes from 'prop-types';
import { TabBar } from 'antd-mobile';
import './index.less';

class YdyTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab'
    };
  }

  render() {
    const tabItems = this.props.tabBarItems.map((Item) =>
      <TabBar.Item
        title={Item.name}
        key={Item.name}
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
          this.setState({
            selectedTab: Item.selectedTab,
          });
        }}
        data-seed="logId"
      >
        {Item.renderContent}
      </TabBar.Item>
    );
    return (
      <TabBar style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        hidden={this.state.hidden}
      >
        {tabItems}
      </TabBar>
    );
  }
}
YdyTabBar.propTypes = {
  unselectedTintColor: PropTypes.string,
  tintColor: PropTypes.string,
  barTintColor: PropTypes.string,
  hidden: PropTypes.bool,
  tabBarItems: PropTypes.array.isRequired
};
YdyTabBar.defaultProps = {
  unselectedTintColor: '#949494',
  tintColor: '#33A3F4',
  barTintColor: 'white',
  hidden: false
}
export default YdyTabBar;
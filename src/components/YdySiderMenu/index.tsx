import './index.less'
import 'rc-drawer/assets/index.css';
import React from 'react';
import DrawerMenu from 'rc-drawer';
import SiderMenu from './SiderMenu';

class YdySiderMenu extends React.Component<any, any> {
  render () {
    const { isMobile, collapsed } = this.props;
    return isMobile ? (
      <DrawerMenu
        getContainer={null}
        level={null}
        handleChild={<i className="drawer-handle-icon" />}
        onHandleClick={() => {
          this.props.onCollapse(!collapsed);
        }}
        open={!collapsed}
        onMaskClick={() => {
          this.props.onCollapse(true);
        }}
      >
        <SiderMenu {...this.props} collapsed={isMobile ? false : collapsed} />
      </DrawerMenu>
    ) : (
      <SiderMenu {...this.props} />
    );
  }
}

export default YdySiderMenu;

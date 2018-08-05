import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import './index.less';
import { CollapseType } from 'antd/lib/layout/Sider';

const { Sider } = Layout;
const { SubMenu } = Menu;

export interface SiderMenuPropTypes {
  Authorized?
  logo?
  collapsed?: boolean
  location?: Location
  menuData?: MenuDataItem[]
  setPageTitle?: (title: string) => void;
  onCollapse?: (collapsed: boolean, type: CollapseType) => void;
}

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return <img src={icon} alt="icon" className={`icon sider-menu-item-img`} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => [path,path2]
 * @param  menu
 */
export const getFlatMenuKeys = (menu, path = ''): {path: string, father: string, name: string}[] =>
  menu.reduce((keys, item) => {
    keys.push({path: item.path, father: path ? path : item.path, name: item.name});
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children, item.path));
    }
    return keys;
  }, []);

const getSelectedMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    return keys;
  }, []);
export default class SiderMenu extends PureComponent<SiderMenuPropTypes, any> {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    if (location) {
      if (nextProps.location.pathname !== location.pathname) {
        this.setState({
          openKeys: this.getDefaultCollapsedSubMenus(nextProps),
        });
      }
    }
  }

  getDefaultCollapsedSubMenus (props: SiderMenuPropTypes) {
    const { menuData, location, setPageTitle } = props;
    if (!location) return []
    if (!menuData) return []
    let flatMenuKeys = getFlatMenuKeys(menuData)
    let fatherMenuKey = ''
    for (let index = 0; index < flatMenuKeys.length; index++) {
      const menuKey = flatMenuKeys[index];
      if (location.pathname === menuKey.path) {
        fatherMenuKey = menuKey.father
        setPageTitle && setPageTitle(menuKey.name)
      }
    }
    if (!fatherMenuKey) return []
    let selectedKeys = flatMenuKeys.filter((item) => {
      return item.father === fatherMenuKey
    })
    return getSelectedMenuKeys(selectedKeys)
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    return (
      <a href={itemPath} target={target}>
        {icon}
        <span>{name}</span>
      </a>
    );
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
    }
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = (): string[] => {
    const { location } = this.props;
    if (location) {
      return [location.pathname]
    }
    return []
  };

  // conversion Path
  // 转化路径
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData ? menuData.some(item => key && (item.key === key || item.path === key)): false
  };

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };

  render() {
    const { logo, menuData, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
          // openKeys: ["Tenant", "/Tenant.html", "/Tenant-Test.html"],
          openKeys
        };
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={(collapsed, type) => {
          onCollapse && onCollapse(collapsed, type)
          this.setState({
            openKeys: this.getDefaultCollapsedSubMenus(this.props),
          });
        }}
        width={196}
        className="sider"
      >
        <div className="logo" key="logo">
          <a href="">
            <img src={logo} alt="logo" />
            <h1>源钉云</h1>
          </a>
        </div>
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
      </Sider>
    );
  }
}

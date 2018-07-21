import React from 'react';
import './index.less'
import './assets/iconfont.css';

interface YdyIconYypes {
  /** 内置 icon 名称 */
  type: string
  /** 图标大小 */
  size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
  /** 图标颜色 */
  color: string
}

class YdyIcon extends React.Component<YdyIconYypes, any> {
  render () {
    return (
      <i style={{color: this.props.color}} className={`ydy-icon ydy-icon-${this.props.size} dingtalk antd-${this.props.type} `}></i>
    );
  }
}

export default YdyIcon;
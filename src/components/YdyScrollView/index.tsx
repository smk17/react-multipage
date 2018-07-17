import * as React from 'react';
import './index.less';

export interface YdyScrollViewPropTypes {
  style?: React.CSSProperties,
  wrap?: string,
  justify?: string,
  align?: string,
  alignContent?: string,
}

class YdyScrollView extends React.Component<YdyScrollViewPropTypes, any> {
  static defaultProps: YdyScrollViewPropTypes = {
    style: {},
    wrap: 'nowrap',
    justify: 'start',
    align: 'center',
    alignContent: 'stretch',
  }

  render(): JSX.Element {
    return (
      // <div className="scroll" direction="column"
      //   wrap={this.props.wrap}
      //   justify={this.props.justify}
      //   align={this.props.align}
      //   alignContent={this.props.alignContent}
      // >
      <div className="ScrollView" style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
export default YdyScrollView
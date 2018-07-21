import React from 'react';
import YdyFallbackView from "@/components/YdyFallbackView";
import './index.less';

export interface YdyScrollViewPropTypes {
  style?: React.CSSProperties,
  wrap?: string,
  justify?: string,
  align?: string,
  alignContent?: string,
}
interface YdyScrollViewStateTypes {
  hasError?: boolean,
  code: string
}

class YdyScrollView extends React.Component<YdyScrollViewPropTypes, YdyScrollViewStateTypes> {
  static defaultProps: YdyScrollViewPropTypes = {
    style: {},
    wrap: 'nowrap',
    justify: 'start',
    align: 'center',
    alignContent: 'stretch',
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false, code: '' };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, code: error.message });
    // // You can also log the error to an error reporting service
    // Service.writeLog({ error, info });
  }

  render(): JSX.Element {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <YdyFallbackView code={this.state.code} onClick={() => {
        window.history.back()
      }} />;
    }
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
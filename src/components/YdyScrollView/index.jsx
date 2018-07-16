import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

class YdyScrollView extends React.Component {

  render () {
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
YdyScrollView.propTypes = {
  style: PropTypes.object,
  wrap: PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
  alignContent: PropTypes.string,
}
YdyScrollView.defaultProps = {
  style: {},
  wrap: 'nowrap',
  justify: 'start',
  align: 'center',
  alignContent: 'stretch',
}
export default YdyScrollView
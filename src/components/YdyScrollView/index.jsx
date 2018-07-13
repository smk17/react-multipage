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
      <div className="ScrollView">
        {this.props.children}
      </div>
    );
  }
}
YdyScrollView.propTypes = {
  wrap: PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
  alignContent: PropTypes.string,
}
YdyScrollView.defaultProps = {
  wrap: 'nowrap',
  justify: 'start',
  align: 'center',
  alignContent: 'stretch',
}
export default YdyScrollView
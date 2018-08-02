import React from 'react';
import './index.less'

class YdyMainLayout extends React.Component<any, any> {
    render(){
        return(
        <div>
           {this.props.children}
        </div>
        );
    }
}

export default YdyMainLayout;
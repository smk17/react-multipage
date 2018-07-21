import React from 'react';
import { Result, Icon, Button, WhiteSpace } from 'antd-mobile';
import error from '@/components/YdyFallbackView/error';
import './index.less';

class YdyIcon extends React.Component<{src: string}> {
  render() {
    return <img src={this.props.src} className="spe am-icon am-icon-md" alt="" />
  }
}

class YdyFallbackView extends React.Component<{code: string, onClick?: Function}, {img?: JSX.Element, title?: string, message?: string}> {
  constructor(props: {code: string}) {
    super(props);
    this.state = {
      img: <Icon type="cross-circle-o" className="spe" style={{ fill: '#F13642' }} />,
      title: '出错啦',
      message: "小钉君在赶来的路上出意外啦"
    };
    error.forEach(element => {
      if (element.code === props.code) {
        let img = <div></div>
        switch (element.url) {
          case 'Error':
            img = <Icon type="cross-circle-o" className="spe" style={{ fill: '#F13642' }} />
            break;
          case 'Success':
            img = <Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />
            break;
          default:
            img = <YdyIcon src={element.url} />
            break;
        }
        this.state = {
          img: img,
          title: element.title,
          message: element.message
        };
      }
    });
  }

  render() {
    const {img, title, message} = this.state
    return (
      <div className="YdyFallbackView">
        <Result img={img} title={title} message={message} /><WhiteSpace />
        <div className="back-btn">
          <Button inline onClick={
            () => {
              this.props.onClick && this.props.onClick()
            }
          }>返回</Button>
        </div>
        <WhiteSpace />
      </div>
    );
  }
}
export default YdyFallbackView
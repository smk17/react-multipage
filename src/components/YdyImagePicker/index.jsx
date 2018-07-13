import React from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'antd-mobile';
import './index.less';

class YdyImagePicker extends React.Component {
  constructor(props) {
    super(props);
    let imgs = []
    for (let index = 0; index < props.files.length; index++) {
      const img = props.files[index].url;
      imgs.push(img)
    }
    this.state = {
      imgs: imgs,
      files: props.files,
    };
  }
  
  onChange = (files, type, index) => {
    let imgs = []
    for (let index = 0; index < files.length; index++) {
      const img = files[index].url;
      imgs.push(img)
    }
    this.setState({
      files,
      imgs
    });
    this.props.onChange(files)
  }
  /** 添加图片, 在钉钉容器使用时，添加图片按钮将调用钉钉的 `biz.util.uploadImage` 功能，其他情况调用默认的H5事件 */
  onAddImage = (e) => {
    if (!(window.dd.version === null)) {
      e.preventDefault();
      window.dd.ready( () => {
        window.dd.biz.util.uploadImage({
          compression: this.props.compression,//(是否压缩，默认为true压缩)
          multiple: this.props.multiple, //是否多选，默认false
          max: this.props.max, //最多可选个数
          quality: this.props.quality, // 图片压缩质量, 
          resize: this.props.resize, // 图片缩放率
          stickers: this.props.stickers,
          onSuccess : (result) => {
            for (let index = 0; index < result.length; index++) {
              const element = result[index];
              this.setState({
                imgs: this.state.imgs.concat(element),
                files: this.state.files.concat({
                  url: element,
                  id: index,
                }),
              });
            }
          },
          onFail : (err) => {
            window.baseConfig.development && window.alert(JSON.stringify(err))
          }
        })
      });
    }
  }
  /** 图片预览，在钉钉容器，预览照片将调用 `biz.util.previewImage` 预览图片，其他情况未实现 */
  onImageClick = (index, fs) => {
    if (!(window.dd.version === null)) {
      window.dd.ready(() => {
        window.dd.biz.util.previewImage({
          urls: this.state.imgs,
          current: this.state.imgs[index],//当前显示的图片链接
          onSuccess : (result) => {
            window.baseConfig.development && window.alert(JSON.stringify(result))
          },
          onFail : (err) => {
            window.baseConfig.development && window.alert(JSON.stringify(err))
          }
        })
      })
    } else {
      // 非钉钉容器的预览照片功能实现
    }
  }

  render() {
    const { files } = this.state;
    return (
      <ImagePicker
        files={files}
        onChange={this.onChange}
        onAddImageClick={this.onAddImage}
        onImageClick={this.onImageClick}
        multiple={this.props.multiple}
        selectable={this.props.selectable}
        accept={this.props.accept}
      />
    );
  }
}
YdyImagePicker.propTypes = {
  files: PropTypes.string, // 图片文件数组,元素为对象
  onChange: PropTypes.func, // files 值发生变化触发的回调函数
  compression: PropTypes.bool, // 是否压缩，默认为true压缩
  max: PropTypes.number, // 最多可选个数
  quality: PropTypes.number, // 图片压缩质量
  resize: PropTypes.number, // 图片缩放率
  stickers: PropTypes.object, // 水印信息
  selectable: PropTypes.bool, // 是否显示添加按钮
  multiple: PropTypes.bool, // 是否支持多选
  accept: PropTypes.string, // 图片类型
}
YdyImagePicker.defaultProps = {
  files: [],
  compression: true,
  max: 9,
  quality: 50,
  resize: 50,
  stickers: {},
  selectable: true,
  multiple: false,
  accept: 'image/*',
}
export default YdyImagePicker;

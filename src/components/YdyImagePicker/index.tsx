import React from 'react';
import { ImagePicker } from 'antd-mobile';
import './index.less';
import { DingTalk } from '@/common/DingTalk';
import { JsonHelper } from '@/common/Utils';

export interface YdyImagePickerPropTypes {
  files?: Array<{}>, // 图片文件数组,元素为对象
  onChange?: Function, // files 值发生变化触发的回调函数
  compression?: boolean, // 是否压缩，默认为true压缩
  max?: number, // 最多可选个数
  quality?: number, // 图片压缩质量
  resize?: number, // 图片缩放率
  stickers?: object, // 水印信息
  selectable?: boolean, // 是否显示添加按钮
  multiple?: boolean, // 是否支持多选
  accept?: string, // 图片类型
}

export interface YdyImagePickerStateTypes {
  imgs: string[],
  files: Array<{}>,
}

class YdyImagePicker extends React.Component<YdyImagePickerPropTypes, YdyImagePickerStateTypes> {
  static defaultProps: YdyImagePickerPropTypes = {
    files: [],
    onChange: () => {},
    compression: true,
    max: 9,
    quality: 50,
    resize: 50,
    stickers: {},
    selectable: true,
    multiple: false,
    accept: 'image/*',
  }
  constructor(props) {
    super(props);
    let imgs: string[] = []
    for (let index = 0; index < props.files.length; index++) {
      const img = props.files[index].url;
      imgs.push(img)
    }
    this.state = {
      imgs: imgs,
      files: props.files,
    };
  }
  
  onChange (files, type, index) {
    let imgs: string[] = []
    for (let index = 0; index < files.length; index++) {
      const img = files[index].url;
      imgs.push(img)
    }
    this.setState({
      files,
      imgs
    });
    this.props.onChange && this.props.onChange(files)
  }
  /** 添加图片, 在钉钉容器使用时，添加图片按钮将调用钉钉的 `biz.util.uploadImage` 功能，其他情况调用默认的H5事件 */
  onAddImage (e) {
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
            this.props.onChange && this.props.onChange(this.state.files)
          },
          onFail : (err) => {
            window.baseConfig.development && DingTalk.alert(JsonHelper.toJson(err))
          }
        })
      });
    }
  }
  /** 图片预览，在钉钉容器，预览照片将调用 `biz.util.previewImage` 预览图片，其他情况未实现 */
  onImageClick (index, fs) {
    if (!(window.dd.version === null)) {
      window.dd.ready(() => {
        window.dd.biz.util.previewImage({
          urls: this.state.imgs,
          current: this.state.imgs[index],//当前显示的图片链接
          onSuccess : (result) => {
            // window.baseConfig.development && DingTalk.alert(JsonHelper.toJson(result))
          },
          onFail : (err) => {
            window.baseConfig.development && DingTalk.alert(JsonHelper.toJson(err))
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
        onChange={this.onChange.bind(this)}
        onAddImageClick={this.onAddImage.bind(this)}
        onImageClick={this.onImageClick.bind(this)}
        multiple={this.props.multiple}
        selectable={this.props.selectable}
        accept={this.props.accept}
      />
    );
  }
}
export default YdyImagePicker;

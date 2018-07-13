# YdyImagePicker 图片选择器

> 放置表单中，用户通过添加按钮选择图片，通过点击查看图片，查看模式隐藏添加按钮

## 注意

- 针对在钉钉容器使用时，添加图片按钮将调用钉钉的 `biz.util.uploadImage` 功能，确保 `jsApiList` 包含该接口
- 在钉钉容器，预览照片将调用 `biz.util.previewImage` 预览图片

## API

~~~ js
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
~~~

## 要做的功能

- 需要实现在H5模式下的预览图片功能

## 已知Bug

- 单选添加图片会变形

PS: 基于[ImagePicker](https://mobile.ant.design/components/image-picker-cn/)实现
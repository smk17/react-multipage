# 基于react的多页面构建

> 基于react的多页面构建，不使用路由等第三方插件，UI库使用`antd-mobile`,主要用于钉钉应用开发

## 如何更新

若你之前已经使用该项目创建了新的项目，而该项目又更新了一系列组件和类，这个时候你只要重新获取[common](#common)和[components](#components)的内容并更新即可，对应[pages](#pages)的更新，目前还没有很好的策略，如果你有好的方案请[Issues](https://github.com/smk17/react-multipage/issues)我们。

## 目录结构

- assets 静态资源目录
- [common 公共服务目录](#common)
- [components 组件目录](#components)
- [pages](#pages) 页面目录
- [template 页面模板目录](/src/template/README.md)
- typings 声明文件，这是为以后`Flow`或`TypeScript`预留的

## <span id="common">common 公共服务</span>

> 这里放置一些全局通用的类和方法

### code.js

> 核心文件，主要使用其中的 `Service.executeService` 请求后端API

#### 引用

~~~ js
import { Service } from '@/common/code';

Service.executeService(...);
~~~

### dingtalk.js

> 基于官方 `dingtalk.js` 的一个封装

#### 引用

~~~ js
import { DingTalk } from '@/common/dingtalk';

DingTalk.init();
~~~

## <span id="components">components 组件</span>

> 组件，基于 `antd-mobile` 再次封装，让其更简单的使用和更好的在钉钉容器上使用

### 组件列表（持续更新）

- [YdyTabBar](/src/components/YdyTabBar/README.md)
- [YdyScrollView](/src/components/YdyScrollView/README.md)
- [YdyImagePicker](/src/components/YdyImagePicker/README.md)

### 创建组件规范

> 目前创建一个组件，需要创建一个该组件的目录，然后在文件夹有以下三个文件：

- index.jsx 组件DOM和逻辑的实现
- index.less 组件的样式实现
- README.md 组件的使用文档

组件创建成功许要更新 `总 README.md` 文件的 `组件列表`

## <span id="pages">pages 页面目录</span>

> 多页面构造基于该目录每个文件，请保证该目录下至少有一个目录，并且`index`是必须的，`blank`是一个空白模版

### 创建页面规范

> pages目录下每一个文件夹，对应一个页面，创建一个页面文件夹，以下三个文件：

- index.jsx 页面主入口
- index.less 页面全局样式
- index.html 页面html入口

每个页面文件夹，可以是一个单纯的页面，也可以做成一个SPA，目前编译规则是不论pages目录嵌套多少层文件夹，最终只会在站点根目录生成相应的html

### 页面文件夹的命名规范

每个项目必备一个
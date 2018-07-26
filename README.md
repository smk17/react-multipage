# 基于react的多页面构建

> 基于react的多页面构建，不使用路由等第三方插件，UI库使用`antd-mobile`,主要用于钉钉应用开发

## 开始使用

~~~ shell
# bash
git clone https://github.com/smk17/react-multipage.git
cd react-multipage
yarn
yarn start
~~~

## 如何更新

若你之前已经使用该项目创建了新的项目，而该项目又更新了一系列组件和类，这个时候你只要重新获取[common](#common)和[components](#components)的内容并更新即可，对应[pages](#pages)的更新，目前还没有很好的策略，如果你有好的方案请[Issues](https://github.com/smk17/react-multipage/issues)我们。

## 目录结构

- src 源码目录
  - assets 静态资源目录
  - [common 公共服务目录](#common)
  - [components 组件目录](#components)
  - [AppStore](#AppStore) app目录
  - typings 声明文件，这是为以后`Flow`或`TypeScript`预留的
- [template 页面模板目录](/src/template/README.md)
- public 公共资源目录
  - config.json APP全局配置文件，该文件主要作用是APP编译后还可以提供该配置文件修复对应配置而不用再次编译

## 异常处理机制

### 针对 render 函数异常的处理

每个页面的根DOM都包装了 [YdyScrollView](/src/components/YdyScrollView/README.md) ，该组件内部实现了对 render 出现异常的捕获并呈现对应的异常提示

### 针对其他的异常的处理

通过每个页面的入口文件执行 `BetterJs.init`， 建立全局的异常的捕获，然后通过调用 `Service.writeLog` 把异常信息上传到服务器

## <span id="common">common 公共服务</span>

> 这里放置一些全局通用的类和方法

### code.ts

> 核心文件，主要使用其中的 `Service.executeService` 请求后端API

#### 引用

~~~ js
import { Service } from '@/common/code';

Service.executeService(...);
~~~

### dingtalk/index.ts

> 基于官方 `dingtalk.js` 的一个封装

#### 引用

~~~ js
import { DingTalk } from '@/common/DingTalk';

DingTalk.init();
~~~

#### 封装规范

> 封装的函数必须包装在 DingTalk.execute 里面，如果函数需要传入2个以上(包括两个)必须定义接口，返回结果也必须定义接口

以下有几个简单的例子：

##### 无参数有返回结果的实现

~~~ js
static requestChannelAuthCode () {
  interface Result {
    /** 授权码，5分钟有效，且只能使用一次 */
    code: string
  }
  return DingTalk.execute<Result>('channel.permission.requestAuthCode');
}
~~~

#### 只有一个参数无返回结果的实现

~~~ js
static openLink (url: string) {
  return DingTalk.execute<{}>('biz.util.openLink', { url }, () => { window.location.href = url });
}
~~~

#### 多参数无返回结果的实现

~~~ js
// statement.ts
export interface StorageSetParams {
  /** 存储信息的key值 */
  name: string,
  /** 存储信息的Value值 */
  value: string
}

// index.ts
static setStorageItem (params: StorageSetParams) {
  return DingTalk.execute<{}>('util.domainStorage.setItem', params);
}
~~~

## <span id="components">components 组件</span>

> 组件，基于 `antd-mobile` 再次封装，让其更简单的使用和更好的在钉钉容器上使用

### 组件列表（持续更新）

- [YdyTabBar](/src/components/YdyTabBar/README.md) 标签栏
- [YdyScrollView](/src/components/YdyScrollView/README.md) 滚动视图
- [YdyFallbackView](/src/components/YdyFallbackView/README.md) 异常视图组件
- [YdyImagePicker](/src/components/YdyImagePicker/README.md) 图片选择器

### 创建组件规范

> 目前创建一个组件，需要创建一个该组件的目录，然后在文件夹有以下三个文件：

- index.jsx 组件DOM和逻辑的实现
- index.less 组件的样式实现
- README.md 组件的使用文档

组件创建成功许要更新 `总 README.md` 文件的 `组件列表`

## <span id="AppStore">AppStore app目录</span>

> 多页面构造基于该目录下某个文件夹的每个文件，请保证该目录下下某个文件夹中至少有一个目录，并且`index`是必须的，`blank`是一个空白模板

### 快速创建一个页面

> 接下来，将说明怎么快速创建一个页面

目前可以通过复制粘贴 `blank` 文件夹快速创建一个页面，粘贴后重命名文件夹即可。

PS： `blank`空白模板一般不会有太大的变化

### 创建页面规范

> pages目录下每一个文件夹，对应一个页面，创建一个页面文件夹，以下三个文件：

- index.jsx 页面主入口
- index.less 页面全局样式
- index.html 页面html入口

每个页面文件夹，可以是一个单纯的页面，也可以做成一个SPA，目前编译规则是不论pages目录嵌套多少层文件夹，最终只会在站点根目录生成相应的html

## 问题汇总

### 页面过多导致运行时过慢

> 可以把已经开发完成的模块移动到 `template` 目录

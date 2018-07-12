# YdyTabBar 标签栏

> 位于 APP 底部，方便用户在不同功能模块之间进行快速切换。

## 规则

- 用作 APP 的一级分类，数量控制在 3-5 个之间。
- 即使某个 Tab 不可用，也不要禁用或者移除该 Tab。
- 使用 Badge 进行提示，足不出户也能知道有内容更新。

## API

|属性         |说明      |类型    |默认值|
|-----        |-----    |-----   |-----|
|tabBarItems  |标签子项  |object[]|[]|

ps: 把官方的 TabBar.Item 改成 tabBarItems 选项，只需对应的配置即可使用，具体使用看demo
ps: 其他API和[TabBar](https://mobile.ant.design/components/tab-bar-cn/)一致

PS: 基于[TabBar](https://mobile.ant.design/components/tab-bar-cn/)实现
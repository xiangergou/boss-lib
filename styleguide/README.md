<!--
 * @Author: 轻语
 * @Date: 2021-02-24 21:44:48
 * @LastEditors: 轻语
 * @LastEditTime: 2021-02-25 10:41:17
 * @Description: 参考https://segmentfault.com/a/1190000022721297
 * vue-styleguidist基础用法
-->

### 插件梗概

#### 作用

依据组件内部注释生成对应组件文档，可在线生成也可打包生成静态文件。 类似于webpack-buldle-anzlyzer，以新端口启用，支持'*.vue'页面热更新。

#### 目的

1. 组件传承更为友好。
2. 组件内部搭建更为规范，达到即使抛开文档，通过翻阅组件内部注释也能快速上手当前组件。

### 用法

#### 启动

运行npm run styleguide启动styleguide开发服务
运行npm run styleguide:build构建一个固定版本

#### 配置
在 <strong>styleguide.config.js</strong> 文件中进行基础配置，其中牵扯到全局组件、指令等的引入放在 <strong>styleguide/global.require.js</strong> 中

#### 使用
1. 于组件内部注释，具体注释规则可查阅文件底部，也可参考‘https://segmentfault.com/a/1190000022721297’，更为建议翻阅官方文档。

2. 组件文件夹内添加README.md文件， 用于添加demo样例。 也可在组件内部以<docs>标签包裹添加， 但出于组件纯粹性考虑，更为建议使用前者。


### 各个模块注释方式 
常用为 props、event、template以及组件大体简介等注释。

####  事件注释
如果事件传入的有参数或属性，使用@propety标签的描述它。也可以使用@arg或者@param。
```js
/**
 * Triggers when the number changes
 *
 * @property {number} newValue new value set
 * @property {number} oldValue value that was set before the change
 * 
 */
```

#### template注释

被直接用在v-on表达式中触发的事件将自动被检测到。为了更好地让文档说明他们，可以在template中，在$emit被调用的代码行上面添加注释。
注释块内编写文档需要包含一行@event click。剩下的注释块那内容和在脚本中注释一样即可。
@property用来描述参数。

```html
<div>
  <!--
    trigered on click
    @event click
    @property {object} demo - example
    @property {number} called - test called
  -->
  <button @click="$emit('click', test)"></button>
</div>
```

styleguidist将自动检测到插槽部分。在插槽前一行添加用@slot注释描述。

```html
<template>
  <div class="modal">
    <div class="modal-container">
      <div class="modal-head">
        <!-- @slot Use this slot header -->
        <slot name="head"></slot>
      </div>
      <div class="modal-body">
        <!-- @slot Use this slot body -->
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
```

#### 组件梗概
```js
  // 请注意使用了@displayName标签将该变组件名称，这是一个顶层的注释，必须出现在脚本标签export default之前。
  /**
   * The only true button.
   * @displayName Best Button
   */
```
如果组件中创建了自定义的v-model，你必须添加model标签在注释中

```js
  export default {
    name: 'my-checkbox',
    props: {
      /**
       * @model
       */
      value: String
    }
  }
```
#### 公共方法
默认的组件中methods中的方法被视为私有的，是不会被公开的。可以使用JSDoc中@public标签让方法视为公开，并展示在文档中。
```js
/**
 * Insert text at cursor position.
 *
 * @param {string} text
 * @public
 */
insertAtCursor(text) {
  // ...
}
```

#### 忽略props

默认情况下，组件中的所有属性props被认为是公开发的。在极少数情况下，想要只在文档中的移除部分属性说明。为此，可以使用JSDoc的@ignore标签注释在属性前面，用于标记在文档中移除它。

```js
props: {
  /**
  * @ignore
  */
  color: {
    type: String,
    default: '#333'
  }
```
以上。
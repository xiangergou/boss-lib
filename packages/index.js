/*
 * @Author: 轻语
 * @Date: 2021-03-09 16:41:56
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 11:07:12
 * @Description: 
 */

import vxeTable from './plugins/vxeTable.js'


import BsButton from "./Button/index.js";
import BsArticleSteps from "./ArticleSteps/index.js";
import BsCardMenu from "./CardMenu/index.js";
import BsCrumbs from './Crumbs/index.js'
import BsForm from './Form/index.js'
import Directives from './Directive/index' // 指令

// 组件集合，用于遍历
const components = [BsButton, BsArticleSteps, BsCardMenu, BsCrumbs, BsForm];

// 定义 install 方法
const install = function (Vue) {
  Vue.use(Directives);
  Vue.use(vxeTable)

  if (install.installed) return;
  // 遍历注册全局组件
  components.map((component) => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}


export {
  install, 
  BsButton,
  BsArticleSteps,
  BsCardMenu,
  BsForm
};

export default {
  install, 
  BsButton,
  BsArticleSteps,
  BsCardMenu,
  BsCrumbs,
  BsForm
};


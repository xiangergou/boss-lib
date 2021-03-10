/*
 * @Author: 轻语
 * @Date: 2021-03-09 16:41:56
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 15:40:26
 * @Description: 
 */

import vxeTable from './plugins/vxeTable.js'


import BsButton from "./Button/index.js";
import BsArticleSteps from "./ArticleSteps/index.js";
import BsCardMenu from "./CardMenu/index.js";
import BsCrumbs from './Crumbs/index.js'
import BsForm from './Form/index.js'
import BsJsonEditor from './JsonEditor/index'
import Directives from './Directive/index' // 指令
import LoadingMark from './Loadingmark/index'
import BsOperationLog from './OperationLog/index'
import BsQuery from './Query/index'

// 组件集合，用于遍历
const components =
  [
    BsButton, BsArticleSteps, BsCardMenu, BsCrumbs, BsForm, BsJsonEditor, BsOperationLog,
    BsQuery
  ];

// 定义 install 方法
const install = function (Vue) {
  if (install.installed) return;

  Vue.use(Directives);
  Vue.use(vxeTable)
  // 遍历注册全局组件

  components.map((component) => Vue.component(component.name, component));
  
  Vue.prototype.$LoadingMark = LoadingMark;
  
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install, 
  BsButton,
  BsArticleSteps,
  BsCardMenu,
  BsCrumbs,
  BsForm,
  BsJsonEditor,
  LoadingMark,
  BsOperationLog,
  BsQuery
};


/*
 * @Author: 轻语
 * @Date: 2021-03-09 16:41:56
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 20:41:12
 * @Description: 
 */


import BsButton from "./Button/index.js";
import BsArticleSteps from "./ArticleSteps/index.js";

// 组件集合，用于遍历
const components = [BsButton, BsArticleSteps];

// 定义 install 方法
const install = function(Vue) {
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
  BsArticleSteps
};

export default {
  install, 
  BsButton,
  BsArticleSteps
};


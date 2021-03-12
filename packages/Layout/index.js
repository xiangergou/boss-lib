/*
 * @Author: 轻语
 * @Date: 2021-03-12 15:11:02
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-12 15:11:49
 * @Description: 
 */
import BsLayout from "./src/index.vue";

BsLayout.install = function(Vue) {
  Vue.component(BsLayout.name, BsLayout);
};

export default BsLayout;


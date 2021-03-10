/*
 * @Author: 轻语
 * @Date: 2021-03-09 21:15:43
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 21:16:18
 * @Description: 
 */
import BsCardMenu from "./src/index.vue";

BsCardMenu.install = function(Vue) {
  Vue.component(BsCardMenu.name, BsCardMenu);
};

export default BsCardMenu;

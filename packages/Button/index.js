/*
 * @Author: 轻语
 * @Date: 2021-03-09 16:43:29
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 20:03:12
 * @Description: 
 */

import BsButton from "./src/index.vue";

BsButton.install = function(Vue) {
  Vue.component(BsButton.name, BsButton);
};

export default BsButton;

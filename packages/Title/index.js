/*
 * @Author: sunlight
 * @Date: 2021-03-10 15:16:29
 * @LastEditors: sunlight
 * @LastEditTime: 2021-03-10 15:16:29
 * @Description: 
 */

import BsTitle from "./src/index.vue";

BsTitle.install = function(Vue) {
  Vue.component(BsTitle.name, BsTitle);
};

export default BsTitle;

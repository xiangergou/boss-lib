/*
 * @Description: 
 * @Author: sunlight
 * @Date: 2021-03-10 22:44:57
 * @LastEditTime: 2021-03-10 22:49:17
 * @LastEditors:  
 */
import BsTabSelect from "./src/index.vue";

BsTabSelect.install = function(Vue) {
  Vue.component(BsTabSelect.name, BsTabSelect);
};

export default BsTabSelect;

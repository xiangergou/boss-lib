/*
 * @Description: 
 * @Author: sunlight
 * @Date: 2021-03-12 15:48:05
 * @LastEditTime: 2021-03-12 15:57:05
 * @LastEditors:  
 */
import BsFilterSelect from "./src/index.vue";

BsFilterSelect.install = function(Vue) {
  Vue.component(BsFilterSelect.name, BsFilterSelect);
};

export default BsFilterSelect;
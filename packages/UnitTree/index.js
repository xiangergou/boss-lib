/*
 * @Description: 
 * @Author: sunlight
 * @Date: 2021-03-11 10:59:32
 * @LastEditTime: 2021-03-11 11:03:52
 * @LastEditors:  
 */
import BsUnitTree from "./src/index.vue";

BsUnitTree.install = function(Vue) {
  Vue.component(BsUnitTree.name, BsUnitTree);
};

export default BsUnitTree;
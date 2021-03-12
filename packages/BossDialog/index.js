/*
 * @Description: 
 * @Author: sunlight
 * @Date: 2021-03-12 17:11:23
 * @LastEditTime: 2021-03-12 17:12:36
 * @LastEditors:  
 */
import BsDialog from "./src/index.vue";

BsDialog.install = function(Vue) {
  Vue.component(BsDialog.name, BsDialog);
};

export default BsDialog;


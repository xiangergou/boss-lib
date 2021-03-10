/*
 * @Author: 轻语
 * @Date: 2021-03-10 10:40:36
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 10:41:23
 * @Description: 
 */
import BsForm from "./src/index.vue";

BsForm.install = function(Vue) {
  Vue.component(BsForm.name, BsForm);
};

export default BsForm;

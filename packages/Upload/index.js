/*
 * @Author: 轻语
 * @Date: 2021-03-12 10:39:51
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-12 10:40:09
 * @Description: 
 */
import BsUpload from "./src/index.vue";

BsUpload.install = function(Vue) {
  Vue.component(BsUpload.name, BsUpload);
};

export default BsUpload;
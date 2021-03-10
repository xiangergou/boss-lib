/*
 * @Author: 轻语
 * @Date: 2021-03-10 14:28:51
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 14:29:49
 * @Description: 
 */
import BsJsonEditor from "./src/index.vue";

BsJsonEditor.install = function(Vue) {
  Vue.component(BsJsonEditor.name, BsJsonEditor);
};

export default BsJsonEditor;

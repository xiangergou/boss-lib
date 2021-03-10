/*
 * @Author: 轻语
 * @Date: 2021-03-10 15:53:12
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 15:54:11
 * @Description: 
 */

import BsRichTextEditor from "./src/index.vue";

BsRichTextEditor.install = function(Vue) {
  Vue.component(BsRichTextEditor.name, BsRichTextEditor);
};

export default BsRichTextEditor;

/*
 * @Author: 轻语
 * @Date: 2021-03-09 16:43:29
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 16:43:45
 * @Description: 
 */

import Button from "./src/index.vue";

Button.install = function(Vue) {
  Vue.component(Button.name, Button);
};

export default Button;

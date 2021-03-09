/*
 * @Author: 轻语
 * @Date: 2021-03-09 20:37:55
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 20:38:44
 * @Description: 
 */

import BsArticleSteps from "./src/index.vue";

BsArticleSteps.install = function(Vue) {
  Vue.component(BsArticleSteps.name, BsArticleSteps);
};

export default BsArticleSteps;

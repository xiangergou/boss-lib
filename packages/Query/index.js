/*
 * @Author: 轻语
 * @Date: 2021-03-10 15:37:10
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 15:37:42
 * @Description: 
 */
import BsQuery from "./src/index.vue";

BsQuery.install = function(Vue) {
  Vue.component(BsQuery.name, BsQuery);
};

export default BsQuery;
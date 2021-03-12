/*
 * @Author: 轻语
 * @Date: 2021-03-12 14:57:17
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-12 15:02:41
 * @Description: 
 */
import BsTable from "./src/quickNav/index.vue";

BsTable.install = function(Vue) {
  Vue.component(BsTable.name, BsTable);
};

export default BsTable;

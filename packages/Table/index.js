/*
 * @Author: 轻语
 * @Date: 2021-03-12 14:31:44
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-12 14:32:57
 * @Description: 
 */
import BsTable from "./src/index.vue";

BsTable.install = function(Vue) {
  Vue.component(BsTable.name, BsTable);
};

export default BsTable;

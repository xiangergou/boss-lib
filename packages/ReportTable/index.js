/*
 * @Author: 轻语
 * @Date: 2021-03-12 15:41:00
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-12 15:41:52
 * @Description: 
 */

import BsReportTable from "./src/index.vue";

BsReportTable.install = function(Vue) {
  Vue.component(BsReportTable.name, BsReportTable);
};

export default BsReportTable;
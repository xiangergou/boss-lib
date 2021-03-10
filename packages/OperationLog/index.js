/*
 * @Author: 轻语
 * @Date: 2021-03-10 15:14:26
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 15:15:39
 * @Description: 
 */
import BsOperationLog from "./src/index.vue";

BsOperationLog.install = function(Vue) {
  Vue.component(BsOperationLog.name, BsOperationLog);
};

export default BsOperationLog;

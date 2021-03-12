/*
 * @Description: 
 * @Author: 
 * @Date: 2021-03-12 14:54:21
 * @LastEditTime: 2021-03-12 18:25:06
 * @LastEditors:  
 */

import vxeTable from 'boss-lib/src/plugins/vxeTable.js'

import BsButton from "./Button/index.js";
import BsCardMenu from "./CardMenu/index.js";
import BsCrumbs from './Crumbs/index.js'
import BsForm from './Form/index.js'
import BsJsonEditor from './JsonEditor/index.js'
import LoadingMark from './Loadingmark/index.js'
import BsOperationLog from './OperationLog/index.js'
import BsQuery from './Query/index.js'
import BsRichTextEditor from './RichTextEditor/index.js'
import BsTab from './Tab/index.js'
import BsTitle from './Title/index.js'
import BsTabSelect from './TabSelect/index.js'
import BsUnitTree from './UnitTree/index.js'
import BsEditDownTextarea from './EditDownTextarea/index.js'
import BsUpload from './Upload/index.js'
import BsEditDownConditions from './EditDownConditions/index.js'
import BsTabKeepRouter from './TabKeepRouter/index.js'
import BsEditInterval from './EditInterval/index.js'
import BsTable from './Table/index.js'
import BsLayout from './Layout/index.js'
// import BsReportTable from './ReportTable/index.js'
// import BsQuickNav from './QuickNav/index.js'  // 待处理vuex 、api
import BsFilterComplex from './FilterComplex/index.js'
import BsFilterSelect from './FilterSelect/index.js'
import BsFilterInput from './FilterInput/index.js'
import BsFilterContent from './FilterContent/index.js'
import BsDialog from './BossDialog/index.js'
import BsTreeSet from './TreeSet/index.js'

const components =
  [
    BsButton, BsCardMenu, BsCrumbs, BsForm, BsJsonEditor, BsOperationLog,
    BsQuery, BsRichTextEditor, BsTab, BsTitle, BsTabSelect, BsUnitTree, BsEditDownTextarea,
    BsUpload, BsEditDownConditions, BsTabKeepRouter, BsEditInterval, BsTable, BsLayout,
    BsFilterComplex, BsFilterSelect, BsFilterInput, BsFilterContent, BsDialog, BsTreeSet
  ];

// 定义 install 方法
const install = function (Vue) {
  if (install.installed) return;

  Vue.use(vxeTable)
  // 遍历注册全局组件
  components.map((component) => Vue.component(component.name, component));
  Vue.prototype.$LoadingMark = LoadingMark;
  
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install, 
  BsButton,
  BsCardMenu,
  BsCrumbs,
  BsForm,
  BsJsonEditor,
  LoadingMark,
  BsOperationLog,
  BsQuery,
  BsRichTextEditor,
  BsTab,
  BsTitle,
  BsTabSelect,
  BsUnitTree,
  BsEditDownTextarea,
  BsUpload,
  BsEditDownConditions,
  BsTabKeepRouter,
  BsEditInterval,
  BsTable,
  BsLayout,
  BsFilterComplex,
  BsFilterSelect,
  BsFilterInput,
  BsFilterContent,
  BsDialog,
  BsTreeSet
};


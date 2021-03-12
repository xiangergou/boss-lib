
import vxeTable from 'boss-lib/src/plugins/vxeTable.js'

import BsButton from "./Button/index.js";
import BsCardMenu from "./CardMenu/index.js";
import BsCrumbs from './Crumbs/index.js'
import BsForm from './Form/index.js'
import BsJsonEditor from './JsonEditor/index.js'
// import Directives from './Directive/index.js' // 指令
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



const components =
  [
    BsButton, BsCardMenu, BsCrumbs, BsForm, BsJsonEditor, BsOperationLog,
    BsQuery, BsRichTextEditor, BsTab, BsTitle, BsTabSelect, BsUnitTree, BsEditDownTextarea,
    BsUpload, BsEditDownConditions
  ];

// 定义 install 方法
const install = function (Vue) {
  if (install.installed) return;

  // Vue.use(Directives);


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
  BsEditDownConditions
};


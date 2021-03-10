/* eslint-disable no-undef */
// import Vue from 'vue'
import VXETablePluginExcel from 'vxe-table-plugin-excel'
// import 'vxe-table-plugin-excel/dist/style.css'
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import XEClipboard from 'xe-clipboard'
import VXETablePluginElement from 'vxe-table-plugin-element'
import VXETablePluginMenus from 'vxe-table-plugin-menus'
import Sortable from 'sortablejs'
import jsoneditor from 'jsoneditor'
import globleRenders from './defaultRenders.js'

// Vue.use(VXETable)
const vxeTable = {
  install: function (Vue) {
    for (let i in globleRenders) {
      VXETable.renderer.add(i, globleRenders[i])
    }
    VXETable.setup({
      select: {
        transfer: true
      },
      input: {
        transfer: true
      },
      pulldown: {
        transfer: true
      },
      icon: {
      //   // table
      //   TABLE_SORT_ASC: 'vxe-icon--caret-top',
      //   TABLE_SORT_DESC: 'vxe-icon--caret-bottom',
        TABLE_FILTER_NONE: 'base-font baseicon-shaixuan-moren',
        TABLE_FILTER_MATCH: 'base-font baseicon-shaixuan-moren'
        //   TABLE_EDIT: 'vxe-icon--edit-outline',
        //   TABLE_TREE_LOADED: 'vxe-icon--refresh roll',
        //   TABLE_TREE_OPEN: 'vxe-icon--caret-right rotate90',
        //   TABLE_TREE_CLOSE: 'vxe-icon--caret-right',
        //   TABLE_EXPAND_LOADED: 'vxe-icon--refresh roll',
        //   TABLE_EXPAND_OPEN: 'vxe-icon--arrow-right rotate90',
        //   TABLE_EXPAND_CLOSE: 'vxe-icon--arrow-right',

        //   // button
        //   BUTTON_DROPDOWN: 'vxe-icon--arrow-bottom',
        //   BUTTON_LOADING: 'vxe-icon--refresh roll',

        //   // select
        //   SELECT_OPEN: 'vxe-icon--caret-bottom rotate180',
        //   SELECT_CLOSE: 'vxe-icon--caret-bottom',

        //   // pager
        //   PAGER_JUMP_PREV: 'vxe-icon--d-arrow-left',
        //   PAGER_JUMP_NEXT: 'vxe-icon--d-arrow-right',
        //   PAGER_PREV_PAGE: 'vxe-icon--arrow-left',
        //   PAGER_NEXT_PAGE: 'vxe-icon--arrow-right',
        //   PAGER_JUMP_MORE: 'vxe-icon--more',

        //   // input
        //   INPUT_CLEAR: 'vxe-icon--close',
        //   INPUT_PWD: 'vxe-icon--eye-slash',
        //   INPUT_SHOW_PWD: 'vxe-icon--eye',
        //   INPUT_PREV_NUM: 'vxe-icon--caret-top',
        //   INPUT_NEXT_NUM: 'vxe-icon--caret-bottom',
        //   INPUT_DATE: 'vxe-icon--calendar',
        //   INPUT_SEARCH: 'vxe-icon--search',

        //   // modal
        //   MODAL_ZOOM_IN: 'vxe-icon--square',
        //   MODAL_ZOOM_OUT: 'vxe-icon--zoomout',
        //   MODAL_CLOSE: 'vxe-icon--close',
        //   MODAL_INFO: 'vxe-icon--info',
        //   MODAL_SUCCESS: 'vxe-icon--success',
        //   MODAL_WARNING: 'vxe-icon--warning',
        //   MODAL_ERROR: 'vxe-icon--error',
        //   MODAL_QUESTION: 'vxe-icon--question',
        //   MODAL_LOADING: 'vxe-icon--refresh roll',

        //   // toolbar
        //   TOOLBAR_TOOLS_REFRESH: 'vxe-icon--refresh',
        //   TOOLBAR_TOOLS_REFRESH_LOADING: 'vxe-icon--refresh roll',
        //   TOOLBAR_TOOLS_IMPORT: 'vxe-icon--upload',
        //   TOOLBAR_TOOLS_EXPORT: 'vxe-icon--download',
        //   TOOLBAR_TOOLS_ZOOM_IN: 'vxe-icon--zoomin',
        //   TOOLBAR_TOOLS_ZOOM_OUT: 'vxe-icon--zoomout',
        //   TOOLBAR_TOOLS_CUSTOM: 'vxe-icon--menu',

      //   // form
      //   FORM_PREFIX: 'vxe-icon--info',
      //   FORM_SUFFIX: 'vxe-icon--info',
      //   FORM_FOLDING: 'vxe-icon--arrow-top rotate180',
      //   FORM_UNFOLDING: 'vxe-icon--arrow-top'
      }
    })
    VXETable.use(VXETablePluginMenus)
    VXETable.use(VXETablePluginExportXLSX)
    VXETable.use(VXETablePluginElement)
    Vue.prototype.$JsonEditor = jsoneditor

    // 给 vue 实例挂载全局窗口对象，属性名称随意定义，例如：$XModal
    window.XEUtils = XEUtils
    window.Sortable = Sortable
    Vue.use(VXETable)
    VXETable.use(VXETablePluginExcel)
    Vue.prototype.$Sortable = Sortable
    Vue.prototype.$XEUtils = XEUtils
    Vue.prototype.$VXETable = VXETable
    Vue.prototype.$modal = VXETable.modal
    Vue.prototype.$XEClipboard = XEClipboard
  }
}
export default vxeTable

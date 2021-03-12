// props   Author:Titans@2396757591@qq.com
// import { tableFormConfig, tableConfig, columns, tableData, toolbarConfig } from '../config/config'
export default {
  unidirectionalData: { // 是否单向数据，不拷贝数据
    type: Boolean,
    default: true
  },
  id: {
    type: String,
    default () {
      return 'TableGeneral'
    }
  },
  highConfig: {
    type: [Object],
    default() {
      return {
        scrollY: {
        },
        scrollX: {
        }
      }
    }
  },
  tableGlobalConfig: { // 表格全局配置
    type: Object,
    default () {
      return {}
    }
  },
  tableFormConfig: { // 表格form配置
    type: [Object, Boolean],
    default () {
      return false
    }
  },
  keyboardConfig: { // keyboardConfig
    type: Object,
    default () {
      return {
        isArrow: true,
        isDel: true,
        isEnter: true,
        isTab: true,
        isEdit: true
      }
    }
  },
  tableConfig: { // 表格配置
    type: Object,
    default () {
      return {}
    }
  },
  toolbarConfig: { // 工具栏配置
    type: [Object, Boolean],
    default () {
      return {}
    }
  },
  pagerConfig: { // 分页配置
    type: [Object, Boolean],
    default () {
      return {}
    }
  },
  tableColumnsConfig: { // 表头配置
    type: Array,
    default () {
      return []
    }
  },
  tableData: { // 表内容
    type: Array,
    default () {
      return []
    }
  },
  editConfig: { // table 编辑配置
    type: [Object, Boolean],
    default () {
      return {
        trigger: 'dblclick',
        mode: 'cell'
        // activeMethod({ row, rowIndex, column, columnIndex }) {

        // }
      }
    }
  },
  editRules: { // table 编辑配置
    type: [Object],
    default () {
      return {}
    }
  },
  expandConfig: { // table 展开行配置
    type: [Boolean, Object],
    default () {
      return false
    }
  },
  footerConfig: { // 表尾配置
    type: [Object],
    default () {
      return {
        showFooter: false
      }
    }
  },
  treeConfig: { // table tree配置
    type: [Object, Boolean]
  },
  loading: { // 表格是否显示加载中
    type: Boolean
  },
  contextMenuConfig: { // 右键菜单配置
    type: [Object, Boolean],
    default () {
      return {}
    }
  },
  height: {
    type: [String],
    default () {
      return 'auto'
    }
  },
  checkboxConfig: {
    type: Object,
    default () {
      return {
        // checkMethod({ row }) {
        //   return true
        // }
      }
    }
  },
  rowStyle: {
    type: [Function, Object],
    default () {
      return {}
    }
  },
  cellStyle: {
    type: [Object, Function, String],
    default () {
      return {}
    }
  },
  showZero: {
    type: [Boolean]
  },
  defaultMoneyUnit: {
    type: Number,
    default: 1
  },
  calculateConstraintConfig: {
    type: Object,
    default () {
      return {}
    }
  },
  contentTableConfig: {
    type: Object,
    default() {
      return {}
    }
  }
}

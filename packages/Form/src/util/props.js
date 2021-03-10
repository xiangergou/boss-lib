// props   Author:Titans@2396757591@qq.com
import { formGloabalConfig, formConfig, formValidationConfig } from '../config/config'
export default {
  formInitGloabalData: { // form表单初始化数据
    type: Object,
    default () {
      return {}
    }
  },
  formGloabalConfig: {// 表单全局配置
    type: Object,
    default() {
      return formGloabalConfig
    }
  },
  formItemsConfig: { // 表单每一条目配置
    type: Array,
    default () {
      return []
    }
  },
  formDataList: { // 表单数据集
    type: Object,
    default () {
      return {}
    }
  },
  formConfig: { // 表单用户配置
    type: Object,
    default () {
      return formConfig
    }
  },
  formValidationConfig: { // form表单校验配置
    type: Object,
    default () {
      return formValidationConfig
    }
  },
  editable: {
    type: Boolean,
    default() {
      return true
    }
  }
}

// formInitGloabalData: {}, // form表单初始化数据
// formGloabalConfig: {},// 表单全局配置
// formItemsConfig: [] // 表单每一条目配置
// formDataList: {}, // 表单数据集
// formConfig: { }, // 表单用户配置
// formValidationConfig: {} // form表单校验配置

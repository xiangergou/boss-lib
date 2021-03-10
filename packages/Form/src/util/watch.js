// watch   Author:Titans@2396757591@qq.com
/* eslint-disable */
export default {
  formGloabalConfig: {
    // 表单全局配置
    handler(newVal, oldVal) {
      this.initFormGloabalConfig(newVal)
    },
    deep: true,
    immediate: true
  },
  formItemsConfig: {
    // 表单每一条目配置
    handler(newVal, oldVal) {
      this.initFormItemsConfig(newVal)
      this.initFormDataList(newVal)
      this.registRenderers(this.formItemsConfigIn)
    },
    deep: true,
    immediate: true
  },
  formDataList: {
    // 表单数据集
    handler(newVal, oldVal) {
      this.initFormDataList(newVal)
    },
    deep: true,
    immediate: true
  },
  formConfig: {
    // 表单用户配置
    handler(newVal, oldVal) {
      this.initFormConfig()
      this.registFormItemRender(this.formConfigCp.renderers)
      this.registRenderers(this.formItemsConfigIn)
    },
    deep: true,
    immediate: true
  },
  formValidationConfig: {
    handler(newVal, oldVal) {
      this.initFormValidationConfig()
    },
    deep: true,
    immediate: true
  },
  formInitGloabalData: {
    handler(newVal, oldVal) {
      this.initFormInitGloabalData()
    },
    deep: true,
    immediate: true
  },
  formDataListIn: {
    handler(newVal, oldVal) {
      // debugger
      // this.formDataList = this.formDataListIn
      // this.$emit('update:formDataList', this.formDataListIn)
    },
    deep: false,
    immediate: true
  }
}

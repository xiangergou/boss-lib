<!--  form表单   Author:Titans@2396757591@qq.com -->
<template>
  <div class="Titans-form editable?'editable':'not-editable'">
    <vxe-form
      ref="form"
      sync-resize
      :data="formDataListIn"
      :items="formItemsConfigData"
      :rules="formValidationConfigIn"
      :span="formGloabalConfigIn.span"
      :align="formGloabalConfigIn.align"
      :size="formGloabalConfigIn.size"
      :title-align="formGloabalConfigIn.titleAlign"
      :title-width="formGloabalConfigIn.titleWidth"
      :title-colon="formGloabalConfigIn.titleColon"
      :prevent-submit="formGloabalConfigIn.preventSubmit"
      :loading="formGloabalConfigIn.loading"
      @submit-invalid="submitInvalid"
      @submit="onFormSubmit"
      @reset="reset"
      @toggle-collapse="toggleCollapse"
    />
  </div>
</template>

<script>
import { defaultformGloabalConfig } from './config/formDefaultConfig'
import methods from './util/methods.js'
import props from './util/props.js'
import watch from './util/watch.js'
import mixin from './config/mixin.js'

export default {
  name: 'bs-form',
  components: {},
  mixin: [mixin],
  props: {
    ...props
  },
  data() {
    return {
      formGloabalConfigIn: {
        ...defaultformGloabalConfig
      },
      formItemsConfigData: this.formItemsConfig,
      formDataListIn: this.formDataList || [],
      formConfigCp: {
        formRenderConfig: {},
        renderers: {},
        axiosDatas: {}
      } || this.formConfig,
      formValidationConfigIn: this.formValidationConfig ||  {}
    }
  },
  methods: {
    ...methods
  },
  created() {
    console.log(this.formItemsConfigData, 'formItemsConfigData')
    console.log(this.formDataListIn, 'formDataListIn')
    console.log(this.formValidationConfigIn, 'formValidationConfigIn')
    // this.initCreated()
  },
  mounted() {
    // this.initMounted()
  },
  watch: {
    ...watch
  }
}
</script>
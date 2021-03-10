<!--  form表单   Author:Titans@2396757591@qq.com -->
<template>
  <div class="Titans-form editable?'editable':'not-editable'">
    <vxe-form
      ref="form"
      sync-resize
      :data="formDataListIn"
      :items="formItemsConfigIn"
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
  <!-- <vxe-form-item
      v-for="(item,index) in formDataConfigIn"
      :key="index"
      :span="item.span"
      :title="item.title"
      :field="item.field"
      :align="item.align"
      :item="item"
      :item-render="item.itemRender"
    /> -->
  </div>
</template>

<script>
import data from './util/data.js'
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
      ...data
    }
  },
  methods: {
    ...methods
  },
  created() {
    this.initCreated()
  },
  mounted() {
    this.initMounted()
    console.log(this.formItemsConfigIn, 'formItemsConfigIn')
  },
  watch: {
    ...watch
  }
}
</script>

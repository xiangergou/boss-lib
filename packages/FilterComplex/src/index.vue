<template>
  <div class="my-filter-complex" @keydown.stop>
    <div class="my-fc-type">
      <div>
        <vxe-radio v-model="option.data.type" name="fType" label="has">包含</vxe-radio>
        <vxe-radio v-model="option.data.type" name="fType" label="eq">等于</vxe-radio>
        <vxe-radio v-model="option.data.type" name="fType" label="gt">大于</vxe-radio>
        <vxe-radio v-model="option.data.type" name="fType" label="lt">小于</vxe-radio>
        <vxe-radio v-model="option.data.type" name="fType" label="ltgt">区间</vxe-radio>
        <vxe-radio v-model="option.data.type" name="fType" label="null" @change="changeTypeEvent">空值</vxe-radio>
      </div>
    </div>
    <div class="my-fc-name">
      <vxe-input v-model="option.data.value" :type="option.data.dataType || 'text'" placeholder="请输入..." @input="changeOptionEvent" />
      <div v-if="option.data.type === 'ltgt'" class="my-fc-name-to">至</div>
      <vxe-input v-if="option.data.type === 'ltgt'" v-model="option.data.valuegt" :type="option.data.dataType || 'text'" placeholder="请输入..." @input="changeOptionEvent" />
    </div>
    <div class="my-fc-iscase">
      <vxe-checkbox v-model="option.data.isCase">不区分大小写</vxe-checkbox>
    </div>
    <div class="my-fc-footer">
      <vxe-button status="primary" @click="confirmEvent">确认</vxe-button>
      <vxe-button @click="resetEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bs-filter-complex',
  props: {
    params: {
      type: Object,
      default() {
        return {
          column: {
            filters: [
              {
                data: {}
              }
            ],
            own: {}
          }
        }
      }
    }
  },
  data () {
    return {
      isltgt: false,
      size: 'mini', // 被所有子组件继承 size
      column: null,
      option: null
    }
  },
  watch: {
    params () {
      this.load()
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      // filters 可以配置多个，实际只用一个就可以满足需求了
      const { column } = this.params
      const option = column.filters[0]
      const { cellRender, editRender } = column.own
      let render = cellRender || editRender || { props: { type: 'text', format: 'YYYY-MM-DD' } }
      const { type, format } = render.props
      option.data.format = format || 'YYYY-MM-DD'
      option.data.dataType = option.data.dataType || type || 'text'
      this.column = column
      this.option = option
    },
    changeOptionEvent () {
      const { params, option } = this
      const { $panel } = params
      const checked = !!option.data.value
      // $panel.changeOption(null, checked, option)
    },
    changeTypeEvent () {
      const { params, option } = this
      const { $panel } = params
      const checked = true
      // $panel.changeOption(null, checked, option)
    },
    confirmEvent () {
      const { $panel } = this.params
      $panel.confirmFilter()
    },
    resetEvent () {
      const { params, option } = this
      const { $panel } = params
      $panel.resetFilter(option.data)
    }
  }
}
</script>

<style lang="scss">
.my-filter-complex {
  width: 350px;
  padding: 5px 15px 10px 15px;
  .my-fc-type {
    padding: 8px 0;
  }
  .my-fc-iscase {
    padding: 12px 0;
  }
  .my-fc-footer {
    text-align: center;
  }
  .my-fc-name{
    display: flex;
    .my-fc-name-to{
      width: 50px;
      text-align: center;
      line-height: 30px;
    }
  }
}

</style>

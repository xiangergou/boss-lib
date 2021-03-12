<!--
 * @Description: 
 * @Author: sunlight
 * @Date: 2021-03-12 16:08:07
 * @LastEditTime: 2021-03-12 16:17:35
 * @LastEditors:  
-->
<template>
  <div class="my-filter-input" @keydown.stop>
    <vxe-input v-model="option.data" type="text" placeholder="输入关键字过滤" @keyup="keyupEvent" @input="changeOptionEvent" />
  </div>
</template>

<script>
export default {
  name: 'bs-filter-input',
  props: {
    params: {
      type: Object,
      default() {
        return {
          column: {
            filters: [
              {
                data: ''
              }
            ]
          }
        }
      }
    }
  },
  data () {
    return {
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
      this.column = column
      this.option = option
    },
    changeOptionEvent () {
      const { params, option } = this
      const { $panel } = params
      const checked = !!option.data
      // $panel.changeOption(null, checked, option)
    },
    keyupEvent ({ $event }) {
      const { params } = this
      const { $panel } = params
      if ($event.keyCode === 13) {
        $panel.confirmFilter()
      }
    }
  }
}
</script>

<style scoped>
.my-filter-input {
  padding: 10px;
}
</style>

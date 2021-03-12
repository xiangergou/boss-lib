<!--  EditDownTextarea   Author:Titans@2396757591@qq.com -->
<template>
  <div class="edit-down-textarea">
    <vxe-pulldown ref="xDown" class="edit-down-pulldown" :transfer="true" @hide-panel="onHidePanel">
      <template>
        <vxe-input
          v-model="data[property]"
          class="edit-down-input"
          readonly
          @click="clickEvent"
        />
      </template>
      <template v-slot:dropdown>
        <div class="edit-down-wrapper edit-down-textarea-dropbox">
          <vxe-textarea
            ref="xText"
            v-model="data[property]"
            class="edit-down-text"
            resize="none"
            :maxlength="props.maxlength || 1000"
            show-word-count
            @input="input"
            @change="change"
            @keydown="keydown"
            @mousewheel="mousewheel"
            @keyup="keyup"
            @click="click"
            @dblclick="dblclick"
            @focus="focus"
            @blur="blur"
          />
        </div>
      </template>
    </vxe-pulldown>
  </div>
</template>

<script>
export default {
  name: 'bs-edit-down-textarea',
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'table' // form
    },
    params: {
      type: Object,
      default() {
        return {
          row: {},
          column: {
            property: ''
          }
        }
      }
    }
  },
  data() {
    return {
      data: {},
      property: ''
    }
  },
  watch: {
    params() {
      this.load()
    },
    props: {
      handler() {
      },
      deep: true,
      immediate: true
    },
    type: {
      handler() {

      },
      immediate: true
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      if (this.type === 'table') {
        const { row, column } = this.params
        this.data = row
        this.property = column.property
      } else {
        const { property, data } = this.params
        this.data = data
        this.property = property
      }
    },
    onHidePanel() {
      // 隐藏下拉框
      this.$emit('input', this.data[this.property])
    },
    clickEvent() {
      this.$refs.xDown.showPanel().then(() => {
        this.$refs.xText.focus()
      })
    },
    suffixClick() {
      this.$refs.xDown.togglePanel()
    },
    input({ value, $event }) {
      this.$emit('input', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    change({ value, $event }) {
      this.$emit('change', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    keydown({ value, $event }) {
      this.$emit('keydown', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    mousewheel({ value, $event }) {
      this.$emit('mousewheel', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    keyup({ value, $event }) {
      this.$emit('keyup', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    click({ value, $event }) {
      this.$emit('click', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    dblclick({ value, $event }) {
      this.$emit('dblclick', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    focus({ value, $event }) {
      this.$emit('focus', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    },
    blur({ value, $event }) {
      this.$emit('blur', { value, $event }, { EDT: this, textarea: this.$refs.xText })
    }
  }
}
</script>

<style lang="scss">
.edit-down-pulldown {
  width: 100%;
}
.edit-down-wrapper.edit-down-textarea-dropbox {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
}
.edit-down-text {
  width: 400px;
  height: 200px;
  display: block;
}
</style>

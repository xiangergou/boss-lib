<!--  query组件   Author:Titans@2396757591@qq.com -->
<template>
  <div class="T-search">
    <div class="basicsearch">
      <div class="basicsearch-form">
        <BsForm
          v-if="ifRenderQuerySearch"
          ref="queryForm"
          :form-gloabal-config="formGloabalConfigIn"
          :form-items-config="queryFormItemConfigIn"
          :form-data-list.sync="queryFormDataIn"
          @itemChange="itemChange"
        />
        <div v-show="isMoreSearch" class="query-form-bottom">
          <slot name="formFootSlot"> </slot>
        </div>
      </div>
      <div class="basicsearch-btngroups">
        <vxe-button
          v-if="queryConfigIn.searchBtnText"
          :content="queryConfigIn.searchBtnText"
          status="primary"
          size="medium"
          @click="onSearchClick"
        />
        <vxe-button
          v-if="queryConfigIn.resetBtnText"
          :content="queryConfigIn.resetBtnText"
          size="medium"
          @click="onSearchResetClick"
        />
        <vxe-button
          v-if="isRenderHighSearchBtn"
          size="medium"
          @click="onMoreSearchClick(undefined)"
        >
          <span class="fn-inline">{{ queryConfigIn.moreBtnText }}</span>
          <i
            class="fn-inline drop"
            :class="
              isMoreSearch ? 'vxe-icon--arrow-top' : 'vxe-icon--arrow-bottom'
            "
          ></i>
        </vxe-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BsQuery',
  components: {},
  props: {
    queryConfig: {
      type: Object,
      default() {
        return {
          searchBtnText: '搜索',
          resetBtnText: '重置',
          moreBtnText: '更多查询'
        }
      }
    },
    queryFormItemConfig: {
      type: Array,
      default() {
        return []
      }
    },
    perLineItemCount: {
      type: Number,
      default() {
        return 6
      }
    },
    formGloabalConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    queryFormData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ifRenderQuerySearch: true,
      queryConfigIn: {},
      isMoreSearch: false,
      formGloabalConfigIn: {
        span: 4,
        align: 'left',
        size: 'medium',
        titleAlign: 'right',
        titleWidth: 0,
        titleColon: false,
        preventSubmit: false,
        loading: false,
        validConfig: {
          autoPos: true
        }
      },
      queryFormDataIn: {},
      perLineItemCountCp: 6,
      defaultQueryFormData: false,
      queryFormItemConfigIn: []
    }
  },
  computed: {
    isRenderHighSearchBtn() {
      return this.queryFormItemConfig.length > this.perLineItemCountCp
    }
  },
  methods: {
    queryFormOptionFn() {
      return this.$refs.queryForm
    },
    getFormData() {
      return this.$refs.queryForm.getFormData()
    },
    setDefaultQueryFormData(conlums, data) {
      conlums.forEach((item) => {
        if (item.field) {
          if (item.itemRender && (item.itemRender.name === '$formTreeInput' || item.itemRender.name === '$vxeTree')) {
            data[item.field + 'name'] = data[item.field + 'name'] === undefined ? '' : data[item.field + 'name']
            data[item.field + 'code'] = data[item.field + 'code'] === undefined ? '' : data[item.field + 'code']
            data[item.field + 'id'] = data[item.field + 'id'] === undefined ? '' : data[item.field + 'id']
          }
          data[item.field] = data[item.field] === undefined ? '' : data[item.field]
        }
      })
      return data
    },
    getMultipleValue(conlums, queryFormData) {
      let obj = {}
      conlums.forEach((item) => {
        if (item.field) {
          if (item.itemRender && item.itemRender.props) {
            const { multiple } = item.itemRender.props
            if (multiple) {
              obj[item.field] = typeof (queryFormData[item.field]) === 'string' ? queryFormData[item.field].split(',') : Array.isArray(queryFormData[item.field]) ? queryFormData[item.field] : []
              if (item.itemRender === '$vxeTree') {
                obj[item.field + 'code'] = typeof (queryFormData[item.field + 'code']) === 'string' ? queryFormData[item.field + 'code'].split(',') : Array.isArray(queryFormData[item.field + 'code']) ? queryFormData[item.field + 'code'] : []
                obj[item.field + 'name'] = typeof (queryFormData[item.field + 'name']) === 'string' ? queryFormData[item.field + 'name'].split(',') : Array.isArray(queryFormData[item.field + 'name']) ? queryFormData[item.field + 'name'] : []
                obj[item.field + 'id'] = typeof (queryFormData[item.field + 'id']) === 'string' ? queryFormData[item.field + 'id'].split(',') : Array.isArray(queryFormData[item.field + 'id']) ? queryFormData[item.field + 'id'] : []
              }
            }
          } else {
            obj[item.field] = queryFormData[item.field]
            if (item.itemRender === '$vxeFormTreeinput') {
              obj[item.field + 'code'] = obj[item.field + 'code'] === undefined ? '' : obj[item.field + 'code']
              obj[item.field + 'name'] = obj[item.field + 'name'] === undefined ? '' : obj[item.field + 'name']
              obj[item.field + 'id'] = obj[item.field + 'id'] === undefined ? '' : obj[item.field + 'id']
            }
          }
        }
      })
      return obj
    },
    itemChange(obj, form) {
      this.$emit('itemChange', obj, form)
    },
    onSearchClick() {
      this.queryFormDataIn = this.$refs.queryForm.getFormData()
      this.$emit('onSearchClick', this.queryFormDataIn, this.getMultipleValue(this.queryFormItemConfig, this.queryFormDataIn))
    },
    onSearchResetClick() {
      this.queryFormDataIn = Object.assign(this.queryFormDataIn, this.defaultQueryFormData)
      this.queryFormItemConfigIn = []
      // this.ifRenderQuerySearch = false
      this.$nextTick().then(() => {
        this.onMoreSearchClick(this.isMoreSearch)
      })
      this.$emit('onSearchResetClick', this.queryFormDataIn)
    },
    getActualPerLineItemCount(queryFormItemConfig, perLineItemCountCp) {
      // 获取除隐藏列 实际显示的内容
      queryFormItemConfig.forEach((item, index) => {
        if (index < perLineItemCountCp) {
          if (item.visible + '' === 'false') {
            perLineItemCountCp += 1
          }
        }
      })
      return perLineItemCountCp
    },
    onMoreSearchClick(isMoreSearch) {
      this.perLineItemCountCp = this.perLineItemCount
      this.isMoreSearch = isMoreSearch === undefined ? !this.isMoreSearch : isMoreSearch
      if (this.isMoreSearch) {
        this.queryFormItemConfigIn = this.queryFormItemConfig.slice(0)
      } else {
        this.queryFormItemConfigIn = this.queryFormItemConfig.slice(0, this.getActualPerLineItemCount(this.queryFormItemConfig, this.perLineItemCountCp))
      }
    }
  },
  mounted() {
  },
  watch: {
    queryConfig: {
      handler() {
        this.queryConfigIn = Object.assign({}, this.queryConfigIn, this.queryConfig)
      },
      deep: true,
      immediate: true
    },
    queryFormItemConfig: {
      handler() {
        this.defaultQueryFormData = this.setDefaultQueryFormData(this.queryFormItemConfig, {})
        this.queryFormDataIn = Object.assign({}, this.queryFormData, this.defaultQueryFormData)
        this.onMoreSearchClick(false)
      },
      immediate: true
    },
    formGloabalConfig: {
      handler() {
        this.formGloabalConfigIn = Object.assign(
          {},
          this.formGloabalConfigIn,
          this.formGloabalConfig
        )
      },
      deep: true,
      immediate: true
    },
    perLineItemCount: {
      handler() {
        this.perLineItemCountCp = this.perLineItemCount
        this.onMoreSearchClick(false)
        this.onSearchResetClick()
      }
    },
    queryFormDataIn: {
      handler() {
      },
      deep: true,
      immediate: true
    },
    queryFormData: {
      handler() {
        this.queryFormDataIn = Object.assign({}, this.defaultQueryFormData, this.queryFormData)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang='scss'>
.T-search {
  padding: 6px 18px 6px 16px;
  flex: 1;
  background: #e3f2fe;

  .basicsearch {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
  }

  .basicsearch-form {
    flex: 1;

    .vxe-form {
      background: transparent;
      font-size: 12px !important;
    }
    .vxe-pulldown{
      .vxe-input--inner{
        padding-right: 30px;
      }
    }
    .vxe-form--item {
      padding: 6px 8px;

      .vxe-input.size--medium {
        height: 32px;
      }
      .vxe-default-textarea {
        resize: none;
        vertical-align: middle;
        height: 32px;
        border-radius: 2px;
      }
    }

    .vxe-form--item-title {
      display: none;
    }
    .vxe-input--inner {
      box-shadow: none;
      background: #ffffff;
      border: 1px solid #cfd2d4;
      border-radius: 2px;
      border-radius: 2px;
      // padding: 0 30px 0 16px;
    }
    // .vxe-input--suffix {
    //   right: 10px;
    // }
    .boss-tree__input {
      .el-input {
        font-size: 12px;
      }
      .el-select {
        height: 32px;
      }
      .el-input__inner {
        background-color: #fff;
        border-radius: 2px;
        border: 1px solid #dcdfe6;
        height: 32px;
        line-height: 32px;
      }
      .el-select__caret {
        color: #c0c4cc;
        line-height: 32px;
        font-size: 5px;
        transform-origin: center center;
      }
    }
    .vxe-input--inner {
      padding: 0 15px;
    }
    .type--date {
      .vxe-input--extra-suffix {
        right: 0.5em;
      }
      .vxe-input--inner {
        padding: 0 30px 0 15px;
      }
    }
  }
  .query-form-bottom {
    .vxe-checkbox {
      padding: 6px 12px;
    }
    line-height: 32px;
  }
  .basicsearch-btngroups {
    padding: 6px;

    .vxe-button {
      border-radius: 2px;
      font-size: 12px;
      margin: 0 0 0 8px;
      line-height: 19px;
      padding: 0 14px;
      display: inline-block;
      vertical-align: middle;

      .drop {
        margin-left: 5px;
        font-size: 5px;
      }
    }
  }
}
</style>

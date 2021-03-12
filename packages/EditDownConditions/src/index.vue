<!--  EditDownConditions   Author:Titans@2396757591@qq.com -->
<template>
  <div class="edit-down-conditions">
    <vxe-pulldown ref="xDown" class="edit-down-pulldown" :transfer="true" destroy-on-close>
      <template>
        <vxe-input
          v-model="data[property]"
          class="edit-down-input"
          readonly
          @click="clickEvent"
        />
      </template>
      <template v-slot:dropdown>
        <div class="edit-down-wrapper edit-down-conditions-dropbox" @click.stop>
          <div class="edit-down-select-group">
            <div class="fn-inline select0">
              <vxe-select v-model="conditionsGroup[0]" :transfer="true" placeholder="请选择组合">
                <vxe-option
                  v-for="(item, index) in combinationType"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </vxe-select>
            </div>
            <div class="fn-inline select1">
              <vxe-select v-model="conditionsGroup[1]" :transfer="true" placeholder="请选择">
                <vxe-option
                  v-for="(item, index) in currentDataType"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </vxe-select>
            </div>
            <div class="fn-inline select2">
              <vxe-select v-model="conditionsGroup[2]" :transfer="true" placeholder="请选择关系">
                <vxe-option
                  v-for="(item, index) in conditionsType"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </vxe-select>
            </div>
            <div class="fn-inline select3">
              <vxe-select v-model="conditionsGroup[3]" :transfer="true" placeholder="请选择">
                <vxe-option
                  v-for="(item, index) in targetDataType"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </vxe-select>
            </div>
          </div>
          <div class="edit-down-btn-group">
            <vxe-button
              status="primary"
              content="加入"
              @click="onJoinConditionsClick"
            />
            <vxe-button content="清空" @click="onJoinConditionsCancelClick" />
          </div>
          <vxe-textarea
            ref="xText"
            v-model="conditionsText"
            class="edit-down-text"
            resize="none"
            maxlength="1000"
            show-word-count
          />
          <div class="edit-down-btn-group">
            <vxe-button status="primary" content="确定" @click="onSureClick" />
            <vxe-button content="取消" @click="onCancelClick" />
          </div>
        </div>
      </template>
    </vxe-pulldown>
  </div>
</template>

<script>
export default {
  name: 'bs-edit-down-conditions',

  props: {
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
    },
    constProps: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ownOpts: {},
      data: {}, // 当前行数据
      property: '', // 当前列数据
      conditionsStr: '', // 预选关系字符
      conditionsText: '', // 预选关系转化后文本
      conditionsGroup: [], // 当前关系组合数据
      conditionsCacheArr: [], // 预选关系数组
      currentDataType: [
        // 匹配数据源集
        {
          label: '预算单位',
          value: '1000'
        }
      ],
      targetDataType: [
        // 匹配目标数据集
        {
          label: '匹配预算单位',
          value: '2000'
        }
      ],
      combinationType: [
        // 结合类型
        {
          label: '并且',
          value: 'and'
        },
        {
          label: '或',
          value: 'or'
        }
      ],
      conditionsType: [
        // 匹配关系类型
        {
          label: '等于',
          value: '='
        },
        {
          label: '不等于',
          value: '!='
        },
        {
          label: '大于',
          value: '>'
        },
        {
          label: '大于等于',
          value: '>='
        },
        {
          label: '小于等于',
          value: '<='
        },
        {
          label: '小于',
          value: '<'
        },
        {
          label: '包含',
          value: 'like%'
        }
      ]
    }
  },
  watch: {
    params() {
      this.load()
    },
    type: {
      handler() {

      },
      immediate: true
    },
    conditionsGroup: {
      handler() {

      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.load()
  },
  methods: {
    onJoinConditionsClick() {
      // 添加关系事件
      if (
        this.conditionsGroup.filter((item) => {
          return item !== undefined
        }).length === 4
      ) {
        this.conditionsCacheArr.push(this.conditionsGroup.join(' '))
      }
      this.conditionsStr =
        this.data[this.property] +
        [...new Set(this.conditionsCacheArr)].join(' ')
      this.conditionsText = this.getConditionsText(this.conditionsStr)
    },
    onJoinConditionsCancelClick() {
      // 移除关系事件
      this.conditionsGroup = []
    },
    onSureClick() {
      this.data[this.property] = this.conditionsText
      this.$refs.xDown.hidePanel().then(() => {})
    },
    onCancelClick() {
      // 取消
      this.$refs.xDown.hidePanel().then(() => {})
    },
    load() {
      // 初始化事件
      if (this.type === 'table') {
        const { row, column } = this.params
        this.data = row
        this.property = column.property
      } else {
        const { property, data } = this.params
        this.data = data
        this.property = property
      }
      this.ownOpts = this.constProps
      this.conditionsText = this.data[this.property]
      this.loadCompareData()
    },
    clickEvent() {
      // 单元格点击事件
      this.$refs.xDown.togglePanel().then(() => {
        if (this.$refs.xDown.isPanelVisible()) {
          this.$refs.xText.focus()
        }
      })
    },
    getConditionsText(text) {
      // 转化预添加关系文本内容
      let transArr = [
        ...this.combinationType,
        ...this.conditionsType,
        ...this.currentDataType,
        ...this.targetDataType
      ]
      transArr.forEach((item, index) => {
        let reg = new RegExp(item.value, 'ig')
        if (reg.test(text)) {
          text = text.replace(reg, item.label)
        }
      })
      return text
    },
    loadCompareData() {
      let self = this
      let {
        matchSourcePostMethods,
        matchTargetPostMethods,
        matchSourceUrl,
        matchTargetUrl,
        matchSourceRequestParams,
        matchTargetRequestParams
      } = this.constProps
      // const { postMethods, url, requestParams } = this.constProps
      let matchSourceData = new Promise((resolve, reject) => {
        self.$http[matchSourcePostMethods](
          matchSourceUrl,
          Object.assign(matchSourceRequestParams, this.data)
        )
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
      })
      let matchTargetData = new Promise((resolve, reject) => {
        self.$http[matchTargetPostMethods](
          matchTargetUrl,
          Object.assign(matchTargetRequestParams, this.data)
        )
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
      })
      Promise.all([matchSourceData, matchTargetData])
        .then((result) => {
          // ['成功了', 'success']
          // 下拉数据源头处理
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss">
.edit-down-pulldown {
  width: 100%;
}
.edit-down-wrapper.edit-down-conditions-dropbox {
  padding: 0 10px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);

  .edit-down-btn-group {
    padding: 10px 0;
    text-align: right;
    .vxe-button {
      cursor: pointer;
      border-radius: 0;
      margin: 0 0 0 10px;
    }
  }
  .edit-down-text {
    width: 100%;
    height: 100px;
    display: block;
  }
  .edit-down-select-group {
    padding: 10px 0 0 0;
    .vxe-select {
      width: 100%;
    }
    .select0 {
      width: 100px;
    }
    .select1 {
      width: 200px;
    }
    .select2 {
      width: 100px;
    }
    .select3 {
      width: 200px;
    }
  }
}
</style>

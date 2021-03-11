<template>
  <div class="tab-select__con">
    <div v-if="isRenderTab" class="tab-select-con-list fn-inline">
      <ul>
        <li
          v-for="(item, index) in tabListIn"
          :key="index"
          class="fn-inline pointer btn-hover"
          :class="[curTabSelect.code === item.code ? 'active-btn' : 'no-active',item.type === 'button' ? 'button-btn' : '']"
          @click.stop="onTabElClick(item)"
        >
          <!-- buton -->
          <el-button v-if="item.type === 'button'" class="fn-inline olh" :title="item.label">
            <img :src="item.iconUrl" class="prefix-btn-icon">
            <span>{{ showNum ? (showZero ? item.labelZero : item.labelNum) : item.label }}</span>
          </el-button>

          <!-- select -->
          <span v-if="(item.type === 'select') && (curTabSelect.code !== item.code)" class="select-tab__hover"></span>
          <el-select v-if="item.type === 'select'" v-model="item.curValue" placeholder="请选择" class="fn-inline olh" :change="changeOption(item)">
            <el-option
              v-for="(option, idx) in item.options"
              :key="idx"
              :value="option.code"
              :label=" (showNum ? (showZero ? option.labelZero : option.labelNum) : `${item.label} - ${option.label}`)"
            />
            <template v-slot:prefix>
              <img :src="item.iconUrl" class="prefix-btn-icon">
            </template>
          </el-select>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bs-tab-select',
  props: {
    showNum: {
      type: Boolean
    },
    showZero: {
      type: Boolean
    },
    tabList: {
      type: [Array, Object],
      default() {
        return [
          {
            code: 'testCode',
            type: 'button',
            label: 'button label',
            iconUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1986451467,394304688&fm=26&gp=0.jpg',
            labelZero: 100,
            label: 200
          },
          {
            code: 'testCode',
            type: 'select',
            label: 'button label',
            iconUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1986451467,394304688&fm=26&gp=0.jpg',
            labelZero: 100,
            label: 200,
            options: [
              {
                code: 'optionsCode',
                labelZero: 100,
                labelNum: 200,
                label: 'test label',
                iconUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1986451467,394304688&fm=2'
              }
            ]
          }
        ]
      }
    },
    defaultSelect: {
      type: [Object],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isRenderTab: false,
      tabListCp: [],
      tabListIn: [],
      curTabSelect: { ...this.defaultSelect },
      slectCurValueTemp: ''
    }
  },
  methods: {
    getbasicDataType(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1)
    },
    init() {
      this.tabListCp = this.deepCopy(this.tabList) // 修复上面的深度copy 方法丢失问题
      this.tabListIn = this.tabListCp
      // console.log('55', this.tabListIn, this.curTabSelect)
    },
    deepCopy(obj) {
      // 深拷贝通用方法
      // var new_arr = JSON.parse(JSON.stringify(arr)) // 不仅可拷贝数组还能拷贝对象（ 但不能拷贝函数）
      // 只拷贝对象
      let me = this
      if (typeof obj !== 'object' || obj === null) return obj
      // 根据obj的类型判断是新建一个数组还是一个对象
      let newObj = obj instanceof Array ? [] : {}
      for (let key in obj) {
        // 遍历obj,并且判断是obj的属性才拷贝
        if (obj.hasOwnProperty(key)) {
          // 判断属性值的类型，如果是对象递归调用深拷贝
          newObj[key] =
            typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
        }
      }
      return newObj
    },
    getImageUrl() {
      this.tabList.forEach(item => {
        if (item.iconName) {
          item.iconUrl = require('./img/' + item.iconName)
        }
      })
    },

    // 切换Tab的触发
    onTabElClick(obj) {
      if (
        this.getbasicDataType(this.curTabSelect) === 'Object' &&
        obj.code !== this.curTabSelect.code
      ) {
        this.slectCurValueTemp = ''
        this.curTabSelect = Object.assign({}, obj)
        if (obj.type === 'button') {
          this.$emit('onTabClick', obj)
        }
      }
    },

    // 切换select下的option触发
    changeOption(obj) {
      if (
        this.getbasicDataType(this.curTabSelect) === 'Object' &&
        obj.code !== this.curTabSelect.code
      ) {
        return
      }

      if (this.slectCurValueTemp === obj.curValue) {
        return
      }

      const curTab = Object.assign({}, obj)
      this.slectCurValueTemp = obj.curValue
      this.$emit('update:tabList', this.tabListIn)
      this.$emit('onTabClick', curTab)
    }
  },

  created() {

  },
  mounted() {
    // 初始化数据
    this.init()
    // 加载本地图片
    this.getImageUrl()
    // 开始渲染
    this.isRenderTab = true
    // 全部加载完成后，如果再调用下激活态panel
    this.$nextTick(() => {
      this.$emit('onTabAfterLoad', this.curTabSelect)
    })
  },
  watch: {
    tabList: {
      handler() {
        this.init()
      },
      deep: true,
      immediately: true
    },
    defaultSelect: {
      handler(newVal) {
        this.onTabElClick(newVal)
      },
      immediately: true
    }
  }
}
</script>

<style  lang="scss">
  .tab-select-con-list{
    font-size: 0;
    li{
      position: relative;
    }
    .btn-icon{
      color: #2A8BFD;
      font-size: 20px;
      margin-top: -1px;
      margin-right: 4px;
    }
    .prefix-btn-icon{
      width: 18px;
      height: 18px;
      vertical-align: middle;
      margin-top: -2px;
    }
    button{
      color: #2E3133;
      letter-spacing: 0;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      padding: 12px 24px;
      box-sizing: border-box;
      height: 48px;
      border-radius: unset;
      max-width: 300px;
      border-top: solid 5px #fff
    }
    .el-input__prefix{
      left: 24px;
      height: 48px;
      line-height: 48px;
    }
    .el-input__suffix{
      right: 15px;
    }
    .el-input--suffix .el-input__inner{
      height: 48px;
      line-height: 48px;
      padding-left: 48px;
      padding-right: 40px;
      font-size: 14px;
      border-radius: unset;
      color: #1F8CFB;

    }
    .el-select .el-input .el-select__caret{
      color: #1F8CFB;
    }
    .el-button:active,  .el-button:focus{
        color: #2E3133;
        background-color: #fff;
    }
    .el-input__inner:active,  .el-input__inner:focus{
        color: #2E3133;
        background-color: #fff;
        border-color: #DCDFE6;
    }
    .select-tab__hover:hover {
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #c6e2ff;
        opacity: 0.3;
    }
    .button-btn:hover{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }

    .no-active{
      .el-input__inner{
        border: unset;
        border-bottom: solid 1px #DCDFE6;
        color: #606266;
      }
      .el-select__caret{
        color: #606266 !important;
      }
      button{
        border-left: unset;
        border-right: unset;
        border-bottom: solid 1px #DCDFE6;
      }
    }
    .el-button:hover{
      border-color: #ecf5ff;
    }
    .el-button:active,  .el-button:focus{
      border-color: #1F8CFB;
      border-left-color: #DCDFE6;
      border-right-color: #DCDFE6;
      color: #1F8CFB;
    }
    .el-input__inner:active,  .el-input__inner:focus{
      border-left-color: #DCDFE6;
      border-right-color: #DCDFE6;
    }
    .active-btn{
      .el-input__inner{
        border: unset;
        border-left: solid 1px #DCDFE6;
        border-right: solid 1px #DCDFE6;
        border-top: solid 5px #1F8CFB;
        border-top-left-radius: 6px ;
        border-top-right-radius: 6px;
        padding-bottom: 6px;
      }
      button{
        border: unset;
        border-left: solid 1px #DCDFE6;
        border-right: solid 1px #DCDFE6;
        border-top: solid 5px #1F8CFB;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

      }

    }
    .select-tab__hover{
      position:absolute;
      width: 100%;
      height: 100%;
      z-index: 99;
    }
  }

</style>

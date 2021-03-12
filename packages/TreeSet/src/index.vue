<!-- 左侧树上面搜索和设置组合组件 by comer -->
<template>
  <div
    class="tree-set__content"
    :style="{ '--tree-set-no__icon': treeConfigIn.radioGroup.length ? '0px' : '7px' }"
  >
    <div v-if="!isHide" class="fn-inline aside-tree-show-leftvisible" @click="changeAside">
    </div>
    <div class="fn-inline tree-set__tip">
      <span>导航</span>
    </div>
    <div class="fn-inline tree-set__query">
      <el-input v-model="filterValue" prefix-icon="el-icon-search" :placeholder="treeConfigIn.placeholder" />
    </div>
    <div
      v-if="treeConfigIn.radioGroup.length"
      class="fn-inline tree-set__icon"
      @click="changeTree"
    >
      <i class="fn-inline base-font base-tree-set"></i>
    </div>
    <div class="modal-body">
      <vxe-modal
        id="tree-set-modal"
        v-model="visible"
        class-name="tree-set-modal"
        width="640px"
        height="340px"
        :show-footer="true"
        :resize="false"
        destroy-on-close
        transfer
        @close="closeDialog"
      >
        <template v-slot:header>
          <p class="choseTree">选择树</p>
          <i class="vxe-icon--close downModal" @click="closeDialog"></i>
        </template>
        <div class="tree-content">
          <div class="tree-set__switch">
            <div class="tree-set-switch__content">
              <vxe-radio-group v-model="treeConfigIn.curRadio">
                <div v-for="(item, index) in treeConfigIn.radioGroup" :key="index" :class="item.code === treeConfigIn.curRadio ? 'aciveBak' : ''" class="tree-set-radio">
                  <vxe-radio :label="item.code" :content="item.label" />
                </div>
              </vxe-radio-group>
            </div>
          </div>
        </div>
        <template v-slot:footer>
          <button class="footer-btnBak" @click="confirmData">保存</button>
          <button class="footer-btn" @click="closeDialog">取消</button>
        </template>
      </vxe-modal>
    </div>
  </div>
</template>

<script>
import { extend } from './config'
import {
  defaultTreeConfig
} from './config/config'
export default {
  name: 'bs-tree-set',
  props: {
    isHide: {
      // 是否隐藏折叠按钮  默认不隐藏
      type: Boolean
    },
    value: {
      // 左侧是否折叠起来，默认不折叠
      type: Boolean,
      default() {
        return true
      }
    },
    treeConfig: { // 树Radios配置
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      leftVisible: this.value,
      filterValue: '',
      treeConfigIn: { ...defaultTreeConfig },
      initRadio: ''
    }
  },
  methods: {
    change(obj) {
      console.log(obj)
    },
    getBackground(index) {
      if (index === 0) {
        return 'background:rgb(202,224,256)'
      } else if (index === 1) {
        return 'background:rgb(248,249,251)'
      } else if (index === 2) {
        return 'background:rgb(238,239,241)'
      }
    },
    initData() {
      this.initTreeConfig()
    },
    // 初始化api服务数据
    initTreeConfig() {
      this.treeConfigIn = Object.assign(
        {},
        this.treeConfigIn,
        this.treeConfig
      )

      this.initRadio = this.treeConfigIn.curRadio
    },
    // aside状态切换
    changeAside() {
      this.leftVisible = !this.leftVisible
      this.$emit('input', this.leftVisible)
      this.$emit('onAsideChange', this.leftVisible)
    },
    // 打开选择树模态框
    changeTree() {
      if (this.treeConfigIn.radioGroup.length === 0) {
        this.$message({ message: '还未设置树确认框内容!', type: 'warning' })
        return
      }
      this.visible = true
    },
    // 关闭获取取消
    closeDialog() {
      this.visible = false
      // 关闭时，要重置数据，模态框再打开时才不会有留痕
      this.resetData()
    },
    resetData() {
      this.treeConfigIn.curRadio = this.initRadio
    },

    // 确定
    confirmData() {
      const curRadioCode = this.treeConfigIn.curRadio || ''
      const radios = (this.treeConfigIn && this.treeConfigIn.radioGroup) || []
      let newRadio = Object.create(null)
      for (let i = 0, len = radios.length; i < len; i++) {
        let item = radios[i]
        if (curRadioCode === item.code) {
          newRadio = extend(true, {}, item)
          break
        }
      }
      this.$emit('onConfrimData', newRadio)
      // 设置二次打开默认radio
      this.initRadio = curRadioCode
      // 本地缓存
      this.setTreeRadioValToStorage()
      // 关闭模态框
      this.visible = false
    },
    // storage存储： 一个用户的一个菜单模块的默认树radio变化了，则进行本地存储
    setTreeRadioValToStorage() {
      if (this.$store.state.userInfo && this.$store.state.curNavModule) {
        const params = {
          uid: this.$store.state.userInfo.guid || '',
          url: this.$store.state.curNavModule.url || ''
        }

        // 传递对象的key必须为params和radio
        this.$store.commit('setTreeRadio', { params, radio: this.initRadio })
      }
    }
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  watch: {
    value(val) {
      this.leftVisible = val
    },
    filterValue(val) {
      // console.log('5', val)
      this.$emit('onChangeInput', val)
    },
    treeConfig: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue)
        this.initTreeConfig()
      },
      deep: true,
      immediate: true
    },
    'treeConfigIn.curRadio': {
      handler(newValue, oldValue) {
        // console.log(newValue, this.treeConfigIn)
        // for (let i in this.treeConfigIn.radioGroup) {
        //   if (self.treeConfigIn.radioGroup[i].code = newValue) {
        //   }
        // }
        this.treeConfigIn.radioGroup.forEach((v, index) => {
          if (v.code === newValue) {
            console.log(index)
          }
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .tree-set__content{
    height: 48px;
    box-sizing: border-box;
    background-color: #E3F2FE;
    display: flex;
    align-items: center;
    overflow: hidden;
    .aside-tree-show-leftvisible {
      height: 48px;
      width: 32px;
      cursor: pointer;
      background: url(./img/aside-left.svg);
      background-size: 100% 100%;
    }
    .tree-set__arrow{
      width: 32px;
      height: 44px;
      background-color: #2A8BFD;
      border-color: #2A8BFD;
      color: #fff;
      cursor: pointer;
      i{
        font-size: 21px;
        margin-top: 6px;
        margin-left: 5px;
      }
    }
    .tree-set__tip{
      margin: 0 11px 0 7px;
      font-weight: 500;
      font-size: 14px;
    }
    .tree-set__query{
      flex: 1;
      margin-right: var(--tree-set-no__icon);
      .el-input__inner{
        height: 32px;
        padding-left: 30px;
        border-radius: 2px;
        font-weight: 300;
        color: #9EA4A9;
      }
      .el-input__prefix{
        top: -3px;
      }
    }
    .tree-set__icon{
      margin: 0 10px;
      cursor: pointer;
      i{
        color: #8A9299;
      }
    }
  }
  //选择树弹窗
  .tree-set-modal{
    .vxe-modal--footer{
      padding: 12px 0;
      border-top: 1px solid rgb(234, 234, 234);
    }
  }
    .choseTree{
      display: inline-block;
      color:#1D1F25;
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
      height: 100%;
      margin:2.76px 0 0 8.6px;
    }
  .downModal{
    position: relative;
    right: -524px;
    top: -5px;
    cursor: pointer;
  }
  .tree-set__switch{
    width:100%;
    .tree-set-switch__content{
      width: 100%;
      height:100%;
      .vxe-radio-group{
        display: block;
        margin:0 auto;
        width: 450px;
        height:182px;
        .aciveBak{
          background:rgb(210,224,255)
        }
        .aciveBak:hover{
          background:rgb(210,224,255)
        }
      }
      .tree-set-radio{
        background:rgb(248,249,251);
        margin-top: 16px;
        height: 50px;
        .vxe-radio{
          margin: 10px 0 0 24px;
          font-size: 14px;
          line-height: 24px;
          color:#2E3133
        }
      }
      .tree-set-radio:hover{
        background: rgb(238,239,241)
      }
    }
  }
  .footer-btn{
    margin-right:16px;
    border:1px solid#CFD2D4;
    border-radius: 5%;
    width:90px;
    height:40px;
    font-size: 14px;
    line-height: 24px;
  }
  .footer-btnBak{
    color:#fff;
    margin-right:24px;
    background: #2A8BFD ;
    // border:1px solid#CFD2D4;
    border-radius: 5%;
    width:90px;
    height:40px;
    font-size: 14px;
    line-height: 24px;
  }
</style>

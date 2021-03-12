<!-- 基于elmentUI的 模态框组件 by comer -->
<template>
  <el-dialog
    :visible.sync="isVisible"
    :style="dialogstyle"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="appendtobody"
    :show-close="showClose"
    :fullscreen="fullscreen"
    :modal-append-to-body="false"
    :width="width"
    @close="close"
  >
    <div v-if="showHeader" slot="title" :style="titlestyle" :class="titleclass">
      <slot name="header"><h1>{{ title }}</h1></slot>
    </div>
    <slot name="context" :style="contextstyle" :class="contextclass"></slot>
    <div v-if="showFooter" slot="footer" class="dialog-footer" :style="footerstyle" :class="footerclass">
      <slot name="footer">
        <el-row>
          <el-button type="primary" @click.stop="saveData">保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-row>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'bs-dialog',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '50%'
    },
    title: {
      type: String,
      default: 'dialog title'
    },
    showFooter: {
      type: Boolean
    },
    showClose: {
      type: Boolean
    },
    appendtobody: {
      type: Boolean
    },
    dialogstyle: {
      type: Object,
      default: () => ({})
    },
    fullscreen: {
      type: Boolean
    },
    titleclass: {
      type: Object,
      default: () => ({})
    },
    titlestyle: {
      type: Object,
      default: () => ({})
    },
    contextclass: {
      type: Object,
      default: () => ({})
    },
    contextstyle: {
      type: Object,
      default: () => ({})
    },
    footerclass: {
      type: Object,
      default: () => ({})
    },
    footerstyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isVisible: this.visible
    }
  },
  methods: {
    close() {
      this.$emit('onClose')
      this.isVisible = false
      this.$emit('update:visible', this.isVisible)
      // this.value = false
    },
    saveData() {
      this.$emit('onSaveData')
      this.close()
    }
  },
  updated() {
    // console.log(this.visible, this.value, 999999999)
  },
  mounted() {
  },
  watch: {
    visible (newVal) {
      this.isVisible = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__body {
    padding: 15px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  /*新增-修改等全屏dialog*/
  .dialog_one{
    background:#fff;
    padding: 16px;
    .el-dialog{
      box-shadow:none;
      background:#f4faff;
      .el-dialog__header{
        border:0;
        background:#fff;
        padding: 0;
        .el-page-header{
          font-size:18px;
          font-weight: 600;
          padding:6px 0;
          .el-page-header__left{
            width: 28px;
            height: 28px;
            margin-left: 4px;
            border: 0;
            background: #fff;
            border-radius: 50%;
            padding: 0;
            font-weight: 900;
            font-size: 18px;
            box-shadow: 0px 0px 3px 2px #eee;
            .el-icon-back{
              margin-left:5px;
            }
          }
        }
        .el-row .el-col:last-child{
          text-align: right;
          padding:6px;
        }
      }
      .el-dialog__body{
        padding: 0;
        background:#f4faff;
        .el-tabs__nav-scroll{
          padding: 16px;
          .el-tabs__active-bar{
            display: none;
          }
          .el-tabs__item{
            padding: 0 16px;
            font-size: 14px;
            background: #fff;
            height: 32px;
            line-height: 32px;
            border: 1px solid #ccd2d8;
          }
          .el-tabs__item.is-active{
            border-color: #2A8BFD;
          }
        }
        .vxe-form{
          background: transparent;
          padding: 16px;
        }
      }
    }
  }
</style>

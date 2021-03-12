<!--  主列表页面布局组件   Author:Titans@2396757591@qq.com -->
<template>
  <div class="T-mainFormListLayout-modulebox mainFormListLayout-modulebox">
    <div class="mmc">
      <slot name="topTap"></slot>
      <div class="mmc-toolbar-search">
        <div class="mmc-toolbar">
          <slot name="topTabPane"></slot>
        </div>
        <div class="mmc-search">
          <slot name="query"></slot>
        </div>
      </div>
      <div
        :class="leftVisible !== undefined ? 'show-mmc-left' : 'hide-mmc-left'"
        class="mmc-formlist"
      >
        <BsSplitPane
          :min-percent="0"
          :max-percent="50"
          :default-percent="leftVisible ? curSplitPaneLeftWidth : 0"
          split="vertical"
          @resize="onSplitPaneResize"
          @onAsideChange="asideChange"
        >
          <template slot="paneL">
            <div
              class="mmc-left-box relative"
              :class="
                leftVisible
                  ? 'show-fmc-left-visible-btn'
                  : 'hide-fmc-left-hidden-btn'
              "
            >
              <aside class="mmc-left">
                <slot name="mainTree"></slot>
              </aside>
              <div class="mmc-left-visible-control fn-inline absolute">
                <div class="fn-inline height-all w1"></div>
                <div
                  class="fn-inline mmc-visible-control"
                  @click="leftVisible = !leftVisible"
                >
                  <div class="mmc-control-bg pointer">
                    <i class="mmc-control-ico fn-inline"> </i>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template slot="paneR">
            <main class="mmc-right">
              <slot name="mainForm"></slot>
            </main>
          </template>
        </BsSplitPane>
      </div>
    </div>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane'

export default {
  name: 'BsLayout',
  props: {
    leftVisible: {
      type: Boolean,
      default() {
        return true
      }
    },
    defaultSplitPaneLeftWidth: {
      type: Number,
      default() {
        return 20
      }
    }
  },
  components: {
    BsSplitPane: splitPane
  },
  data() {
    return {
      timer300: '',
      curSplitPaneLeftWidth: 0
    }
  },
  computed: {},
  methods: {
    asideChange() {},
    onSplitPaneResize(leftWidth) {
      // if (leftWidth > 0) {
      //   this.leftVisible = true
      // }
      // if (leftWidth < 10) {
      //   this.curSplitPaneLeftWidth = 10
      // } else if (leftWidth > 80) {
      //   this.curSplitPaneLeftWidth = 80
      // } else {
      //   this.curSplitPaneLeftWidth = leftWidth
      // }
      if (leftWidth > 1) {
        this.curSplitPaneLeftWidth = leftWidth
        this.leftVisible = true
      } else {
        this.leftVisible = false
      }
    }
  },
  mounted() {
    this.curSplitPaneLeftWidth = this.defaultSplitPaneLeftWidth
  },
  watch: {
    leftVisible(newValue) {
      this.$emit('update:leftVisible', newValue)
    },
    defaultSplitPaneLeftWidth(newValue) {
      this.curSplitPaneLeftWidth = newValue
    }
  }
}
</script>

<style lang='scss' scoped>
.T-mainFormListLayout-modulebox {
  height: 100%;
  box-sizing: border-box;
  font-size: 0;
  padding: 12px 24px;
  flex-flow: column;
  .mmc {
    height: 100%;
    display: flex;
    flex-flow: column;
  }
  .mmc-toolbar-search {
    background: #fff;
    padding-bottom: 12px;

    .mmc-toolbar {
      max-height: 48px;
      background: #fff;
    }
  }
  .vxe-grid--toolbar-wrapper .vxe-button--wrapper {
    text-align: left;
  }
  .table-toolbar-left {
    font-size: 0;
  }
  .toolbar-slot-custom-slot {
    margin-right: 16px;
    font-size: 0;
  }

  .mmc-formlist {
    flex: 1;
    background: #fff;

    .vue-splitter-container {
      .splitter-paneL {
        width: 100%;
        padding-right: 0px !important;
      }

      .splitter-pane-resizer {
        width: 5px !important;
        background: #eef1f5;
        height: 100%;
        opacity: 1;
        margin-left: 0px;
        border: none !important;
      }

      .splitter-pane-resizer:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      .splitter-paneR {
        width: 100%;
        padding: 0px 0 0 0px !important;
      }
    }
    .mmc-left-box {
      overflow: hidden;
      height: 100%;
    }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
    .mmc-left {
      display: flex;
      height: 100%;
      flex-flow: column;
      .mmc-left-tree {
        display: flex;
        flex-flow: column;
        overflow-y:hidden;
      }
      .mmc-left-tree-body {
        height:calc(100% - 44px);
        overflow:auto;
        .boss-tree__base {
          height: 100%;
        }
      }
      .is-expanded > .el-tree-node__content {
        background: #f5f5f5;
      }
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: #cbe2fe;
      }
    }

    .mmc-right {
      display: flex;
      flex-flow: column;
      height: 100%;
      padding: 0 24px 0 20px;
    }
  }
  .mmc-formlist.hide-mmc-left {
    .vue-splitter-container {
      .splitter-paneL {
        display: none;
      }
      .splitter-pane-resizer {
        display: none;
      }
    }
  }
}
</style>

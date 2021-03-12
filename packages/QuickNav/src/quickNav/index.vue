<!--  快速导航  Author:Titans@2396757591@qq.com -->
<template>
  <div v-ClickOutside="setIsShowNavFalse" class="quick-nav-box">
    <div
      class="quick-nav-btn"
      :class="isShowNavIn ? 'active' : ''"
      @click.stop="setIsShowNav(undefined)"
    >
      <i class="fn-inline"></i>
      <span class="fn-inline">菜单</span>
    </div>
    <div v-show="isShowNavIn" id="quickNavAll" class="quick-nav" @click="setIsShowNav(false)">
      <div class="quick-nav-main fn-inline" @click.stop>
        <div class="quick-nav-menu fn-inline">
          <leftMenu
            :nav-data="leftNavData"
            @onNavClick="onNavClick"
            @onMouseenter="onMouseenter"
          />
        </div>
        <div v-if="isRenderRightNav" id="quickNavRight" class="quick-nav-right fn-inline" @mousewheel="handlerMouserScroll">
          <ul id="insideMenu" class="list-group">
            <li
              v-for="(item1, index1) in rightNavDate"
              :key="index1"
              class="list-group-item fn-inline"
              :class="!hasChildren(item1) ? 'list-group-item-nochild' : ''"
            >
              <div
                v-if="item1.isTitle"
                id="right-quick-navgation"
                class="list-group-item-level1 pointer"
                :class="
                  item1.name.length > 14
                    ? 'list-group-item-level1-twoline'
                    : 'list-group-item-level1-oneline'
                "
                @click="onRightNavClick(item1, index1)"
              >
                <i class="fn-inline"></i>
                <span class="fn-inline">{{ item1.name }}</span>
              </div>
              <dl v-if="!item1.isTitle" class="list-group-level2">
                <dd
                  id="right-quick-navgation1"
                  class="list-group-level2-item pointer"
                  @click="onRightNavClick(item1, index1)"
                >
                  {{ item1.name }}
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leftMenu from '../leftNav/LeftNav.vue'
import ClickOutside from './clickOutside.js'
import userBehaviorMonitor from 'boss-lib/src/utils/behaviorcollector'
export default {
  name: 'QuickNav',
  components: {
    leftMenu
  },
  directives: {
    ClickOutside
  },
  props: {
    defaultTop: {
      type: String,
      default: '0px'
    },
    value: {
      type: Boolean,
      default: false
    },
    navData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      documentObj: null,
      isShowNav: false,
      isRenderRightNav: false,
      leftNavData: [],
      leftNavDataTestData: [
        // {
        //   name: '一级 1',
        //   fontIcoClass: 'el-icon-menu',
        //   children: [
        //     {
        //       name: '二级 1-1',
        //       children: [
        //         {
        //           name: '三级 1-1-1',
        //           children: [
        //             {
        //               name: '四级 1-1-1-1'
        //             },
        //             {
        //               name: '四级 1-1-1-2'
        //             },
        //             {
        //               name: '四级 1-1-1-3'
        //             },
        //             {
        //               name: '四级 1-1-1-4'
        //             }
        //           ]
        //         },
        //         {
        //           name: '三级 1-1-2'
        //         },
        //         {
        //           name: '三级 1-1-3'
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   name: '一级 2',
        //   fontIcoClass: 'el-icon-menu',
        //   children: [
        //     {
        //       name: '二级 2-1',
        //       children: [
        //         {
        //           name: '三级 2-1-1'
        //         }
        //       ]
        //     },
        //     {
        //       name: '二级 2-2',
        //       children: [
        //         {
        //           name: '三级 2-2-1'
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   name: '一级 3',
        //   fontIcoClass: 'el-icon-menu',
        //   children: [
        //     {
        //       name: '二级 3-1',
        //       children: [
        //         {
        //           name: '三级 3-1-1'
        //         }
        //       ]
        //     },
        //     {
        //       name: '二级 3-2',
        //       children: [
        //         {
        //           name: '三级 3-2-1'
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      rightNavDate: [],
      defaultProps: {
        children: 'children',
        name: 'name'
      }
    }
  },
  computed: {
    isShowNavIn() {
      return this.isShowNav
    }
  },
  methods: {
    deepCopy(obj) {
      // 深拷贝通用方法
      let me = this
      if (typeof obj !== 'object' || obj === null) return obj
      let newObj = obj instanceof Array ? [] : {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] =
            typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
        }
      }
      return newObj
    },
    hasChildren(item) {
      // 是否有孩子
      return Array.isArray(item.children) && item.children.length
    },
    getChildren(item) {
      // 获取孩子
      return Array.isArray(item.children) ? item.children : []
    },
    deepEachTraversalArr(data, cb) {
      // 深度递归遍历新增嵌套索引关系
      deepEachTraversalArrFn(data)
      return data
      function deepEachTraversalArrFn(root, nestedId, cb) {
        if (Array.isArray(root) && root.length) {
          root.forEach((item, index) => {
            item.sortIndex = index
            item.nestedPid = nestedId === undefined ? 0 : nestedId
            item.nestedId =
              nestedId !== undefined
                ? nestedId + '_' + (index + 1)
                : index + 1 + ''
            cb && typeof cb === 'function' && cb(root)
            if (item.children && item.children.length) {
              deepEachTraversalArrFn(item.children, item.nestedId)
            }
          })
        }
      }
    },
    setIsShowNavFalse() {
      // 关闭
      this.setIsShowNav(false)
    },
    setIsShowNav(isShowNav) {
      if (isShowNav === undefined) {
        this.isShowNav = !this.isShowNav
      } else {
        this.isShowNav = isShowNav
      }
      this.$emit('input', isShowNav)
    },
    onNavClick(obj) {
      // leftnav click
      // if (this.hasChildren(obj)) {
      //   this.rightNavDate = this.getChildren(obj)
      // } else {
      //   this.setIsShowNav(false)
      // this.$emit('onNavClick', obj)
      // }
      if (obj.url && !this.hasChildren(obj)) {
        this.setIsShowNav(false)
        this.$emit('onNavClick', obj)
      }
    },
    onMouseenter(obj, hasChildren) {
      let self = this
      let copyArry = []
      this.rightNavDate = this.getChildren(obj)
      this.rightNavDate.forEach(item => {
        copyArry.push(
          {
            isTitle: true,
            ...item
          })
        if (this.hasChildren(item)) {
          item.children.forEach(items => {
            copyArry.push(
              {
                isTitle: false,
                ...items
              })
          })
        }
      })
      this.rightNavDate = copyArry
      this.isRenderRightNav = false
      // this.$nextTicck(()=>{
      //    self.isRenderRightNav = hasChildren
      // })
      setTimeout(() => {
        self.isRenderRightNav = hasChildren
        this.documentObj = null
      }, 0)
    },
    onRightNavClick(obj) {
      // 右侧nav点击事件
      if (!this.hasChildren(obj)) {
        this.setIsShowNav(false)
        this.$emit('onNavClick', obj)
        userBehaviorMonitor.initClickMonitor()
      }
    },
    handlerMouserScroll (event) {
      if (!this.documentObj) this.documentObj = document.getElementById('quickNavRight') // 获取DOM元素节点
      let detail = event.wheelDelta || event.detail
      let moveForwardStep = -1
      let moveBackStep = 1
      let step = 0
      step = detail > 0 ? moveForwardStep * 100 : moveBackStep * 100
      this.documentObj.scrollLeft = this.documentObj.scrollLeft + step
    },
    transJson(str) {
      if (!str) return
      var params = str.split(',')
      var result = {}
      if (params && params.length > 0) {
        for (var i = 0; i < params.length; i++) {
          var map = params[i].split('=')
          result[map[0]] = map[1]
        }
      }
      return result
    },
    init() {
      // this.leftNavData = this.deepEachTraversalArr(this.leftNavData)
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  watch: {
    value: {
      handler(newValue) {
        this.isShowNav = newValue
      },
      immediate: true
    },
    navData: {
      handler() {
        this.leftNavData = this.deepEachTraversalArr(this.navData)
      },
      immediate: true
    },
    isRenderRightNav: {
      handler() {
        setTimeout(() => {
          let allView = document.getElementById('quickNavAll')
          let outsideView = document.getElementById('quickNavRight')
          let insideView = document.getElementById('insideMenu')
          if (outsideView && insideView && allView &&
            insideView.clientWidth !== outsideView.clientWidth &&
            insideView.clientWidth < allView.clientWidth) {
            // outsideView.style.width = insideView.clientWidth + 'px'
          }
        }, 0)
      },
      immediate: true
    }
  }
}
</script>

<style lang='scss'>
.quick-nav-box {
  position: fixed;
  top: 0px;
  left: 0;
  .quick-nav-btn {
    width: 100px;
    line-height: 48px;
    text-align: center;
    position: fixed;
    top: 0px;
    left: 0;
    z-index: 1000;
    background: rgb(62,125,220);
    i {
      height: 24px;
      width: 24px;
      background: url('./img/icon-menu-btn-df.svg');
      background-size: 100% 100%;
    }
    span {
      margin-left: 4px;
      font-size: 14px;
      color: #fff;
    }
  }
  .quick-nav-btn.active {
    i {
      background: url('./img/icon-menu-btn-ac.svg');
      background-size: 100% 100%;
    }
    span {
      font-weight: bold;
      color: #fff
    }
  }
}
.quick-nav {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  border-top: solid 1px #dddddd;
  background: rgba(0, 0, 0, 0.35);
  font-size: 0;

  .quick-nav-main {
    height: 100%;
    max-width: 100%;
  }
  .quick-nav-menu {
    width: 280px;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    overflow-y: auto;
    overflow-x: hidden;
    background: #3762bf;
  }
  .quick-nav-right {
    width: calc(100% - 280px);
    overflow: auto;
    height: 100%;
    background: #fff;
    padding: 10px 0;
    box-sizing: border-box;
  }
  .list-group {
    writing-mode: vertical-lr;
    // .list-group-item-level1-twoline {
    //   height: 40px;
    // }
    // .list-group-item-level1-oneline {
    //   height: 20px;
    // }
    .list-group-item {
      // writing-mode: horizontal-tb;
      writing-mode: lr-tb;
      margin: 0 40px 0 20px;
      line-height: 20px;
      width: 260px;
    }
    .list-group-item-level1 {
      // height: 40px;
      width: 260px;
      padding: 15px 0 10px 0;
      line-height: 20px;
      // writing-mode: horizontal-tb;
      border-bottom: solid 1px rgba(0, 0, 0, 0.04);
      i {
        height: 8px;
        width: 8px;
        margin: 0 10px 0 16px;
        background: #2a8bfd;
      }
      span {
        font-size: 16px;
        color: #2a8bfd;
        max-width: 225px;
        line-height: 20px;
      }
    }
    .list-group-item.active {
      i {
        background: #3762bf;
      }
      span {
        color: #3762bf;
      }
    }
    .list-group-item:hover {
      i {
        background: #3762bf;
      }
      span {
        color: #3762bf;
      }
    }
    .list-group-item-nochild {
      margin: 0px 40px 0px 20px;
      .list-group-item-level1 {
        border-bottom: none;
        padding: 10px 0;
      }
    }
    .list-group-level2 {
      writing-mode: horizontal-tb;
      padding: 5px 0px 5px 0;
      line-height: 40px;
      dd {
        font-size: 14px;
        line-height: 20px;
        color: #0d1c28;
        padding: 5px 16px;
        line-height: 20px;
      }
      .list-group-level2-item:hover {
        color: #2a8bfd;
        background: #f5f5f5;
      }
    }
  }
}
</style>

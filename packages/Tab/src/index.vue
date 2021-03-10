<!--  tab切换组件   Author:Titans@2396757591@qq.com -->
<template>
  <div ref="tabCon" class="Ttab-con" :class="typeClass + ' ' + tabClass + ' ' + tabMainClass">
    <div
      class="fn-inline pointer left offset"
      :style="{ visibility: isHidePrev ? 'hidden' : 'visible' }"
      @click="onPrev"
    >
      <i class="fn-inline base-font baseqiehuanqizuo"></i>
    </div>
    <div v-if="canRenderTab" class="tab-con-list fn-inline">
      <ul>
        <li
          v-for="(item,index) in tabListIn"
          :key="index"
          class="fn-inline pointer"
          :class="item.isHide ? 'hidden' : curTabSelect.label === item.label ? 'active' : ''"
          @click="onTabElClick(item,index,true)"
        >
          <template v-if="isToolBar">
            <el-tooltip v-if="item.labelNum && (item.labelNum.length > 7)" :content="`${item.label}(${item.num})`" placement="top">
              <div class="tab-li">
                <span class="fn-inline olh">{{ item.label }}
                  <span v-if="showNum && topTip && (item.num || (showZero ? item.num === 0 : null))" class="label-num__topTip">
                    {{ item.num }}
                  </span>
                </span>
              </div>
            </el-tooltip>
            <div v-if="item.labelNum && (item.labelNum.length <= 7)" class="tab-li">
              <span class="fn-inline olh">{{ item.label }}
                <span v-if="showNum && (item.num || (showZero ? item.num === 0 : null))">
                  <span v-if="topTip" class="label-num__topTip">
                    {{ item.num }}
                  </span>
                  <span v-else>
                    (<span class="span-red">{{ item.num }}</span>)
                  </span>
                </span>
              </span>
            </div>
          </template>
          <template v-if="!isToolBar">
            <el-tooltip v-if="item.label.length > 6" :content="item.label" placement="top">
              <div class="tab-li">
                <span class="fn-inline olh">{{ item.label }}</span>
                <em
                  v-if="canClear"
                  class="fn-inline base-font basebaseline-close-px"
                  @click.stop="onTabElEditClick('remove',item,index)"
                ></em>
                <div v-if="item.inforCount !== undefined" class="tabLi-infor">
                  <span class="fn-inline tabLi-infor-count">{{ item.inforCount }}</span>
                </div>
              </div>
            </el-tooltip>
            <div v-if="item.label.length <= 6" class="tab-li">
              <span class="fn-inline olh">{{ item.label }}</span>
              <em
                v-if="canClear"
                class="fn-inline base-font basebaseline-close-px"
                @click.stop="onTabElEditClick('remove',item,index)"
              ></em>
              <div v-if="item.inforCount !== undefined" class="tabLi-infor">
                <span class="fn-inline tabLi-infor-count">{{ item.inforCount }}</span>
              </div>
            </div>
          </template>

        </li>
      </ul>
    </div>
    <div
      class="fn-inline pointer next offset"
      :style="{ visibility: isHideNext ? 'hidden' : 'visible' }"
      @click="onNext"
    >
      <i class="fn-inline base-font baseqiehuanqiyou"></i>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BsTab',
  props: {
    canClear: {
      type: Boolean
      // default: true
    },
    showNum: {
      type: Boolean
    },
    topTip: {
      type: Boolean
    },
    showZero: {
      type: Boolean
    },
    isToolBar: {
      type: Boolean
    },
    tabClass: {
      type: String,
      default() {
        return ''
      }
    },
    type: {
      type: String,
      default() {
        return 'default'
      }
    },
    tabList: {
      type: [Array, Object],
      default() {
        return [
          {
            // label: 'title',
            // id: '',
            // tableConlums: [],
            // tableData: []
          }
        ]
      }
    },
    defaultSelect: {
      // defaultSelect
      type: [Object],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      canRenderTab: false,
      firstel: '',
      lastel: '',
      isHidePrev: true,
      isHideNext: false,
      tabListCp: [],
      defultTabIndex: 0,
      curSelectIndex: 0,
      isOne: false,
      tabCount: 0,
      navWidth: 'auto',
      tabMainClass: '',
      curTabSelect: {},
      typeClassMap: {
        default: 'default',
        button: 'button'
      },
      typeClass: 'default',
      tabListIn: [
        {
          label: 'level1',
          img: '',
          acimg: ''
        }
      ]
    }
  },
  methods: {
    getbasicDataType(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1)
    },
    Arrmovebit: function (arr, movedirection, movebit) {
      // 数组偏移
      // 数组偏移
      for (var i = 0; i < movebit; i++) {
        if (movedirection === 'right') {
          arr.unshift(arr.pop())
        } else {
          arr.push(arr.shift())
        }
      }
      return arr
    },
    getIndexOf(arr, obj, key) {
      // 按key值获取索引
      let indexOf = -1
      if (!Array.isArray(arr)) return -1
      let someof = arr.some((item, index) => {
        indexOf = index
        return item[key] === obj[key]
      })
      if (someof) {
        return indexOf
      }
      return -1
    },
    onPrev() {
      // 左偏移
      this.isHidePrev = false
      this.isHideNext = false
      this.tabListCp = this.Arrmovebit(this.tabListCp, 'right', 1)
      this.tabListIn = this.tabListCp.slice(0, this.tabCount)
      if (this.tabListIn[0] === this.firstel) {
        this.isHidePrev = true
      }
    },
    onNext() {
      // 右偏移
      this.isHidePrev = false
      this.isHideNext = false
      this.tabListCp = this.Arrmovebit(this.tabListCp, 'left', 1)
      this.tabListIn = this.tabListCp.slice(0, this.tabCount)
      if (this.tabListIn[this.tabCount - 1] === this.lastel) {
        this.isHideNext = true
      }
    },
    setNavCount() {
      // 设置默认显示菜单个数
      let tabCount = 0
      let singWidth = this.type === 'button' ? (this.isToolBar ? 100 : 60) : 150
      let tabConWidth = this.$refs.tabCon.offsetWidth
      if (Math.floor((tabConWidth - 12) / singWidth) >= this.tabListCp.length) {
        this.tabMainClass = 'w100'
        this.tabCount = this.tabListCp.length
        this.tabListIn = this.tabListCp
        this.activeDefault(this.defultTabIndex)
      } else {
        if (this.type === 'button') {
          let tabListWidth = tabConWidth - 72
          tabCount = Math.floor(tabListWidth / singWidth)
          this.tabMainClass = 'w-button-offset'
        } else {
          let tabListWidth = tabConWidth - 82
          tabCount = Math.floor(tabListWidth / singWidth)
          this.tabMainClass = 'w-default-offset'
        }
        this.tabCount = tabCount
        if (this.tabListCp.length <= this.tabCount) {
          this.tabCount = this.tabListCp.length
        }
        this.setNavDefaultIn()
      }
    },
    setNavDefaultIn() {
      // 设置渲染数据
      // try {
      this.firstel = this.tabListCp[0]
      this.lastel = this.tabListCp[this.tabListCp.length - 1]
      if (this.tabListCp.length <= this.tabCount) {
        this.isHidePrev = true
        this.isHideNext = true
      }
      if (this.tabListCp.length === 1) {
        this.isOne = true
        this.defultTabIndex = 0
      }
      if (
        this.defultTabIndex >= 0 &&
        this.defultTabIndex < this.tabListCp.length
      ) {
        if (this.defultTabIndex > this.tabCount - 1) {
          let count = this.defultTabIndex - this.tabCount + 1
          while (count > 0) {
            this.onNext()
            count--
          }
        } else {
          this.tabListIn = this.tabListCp.slice(0, this.tabCount)
        }
        if (
          this.tabListIn[this.tabListIn.length - 1] === this.lastel ||
          this.tabListCp.length <= this.tabCount
        ) {
          this.isHideNext = true
        }
        this.activeDefault(this.defultTabIndex)
      }
      // } catch (e) {
      //   debugger
      // }
    },
    activeDefault(index) {
      // try {
      let defaultActive = this.tabListIn[index]
      if (defaultActive) {
        this.onTabElClick(this.tabListIn[index], index)
      }
      // } catch (e) {
      //   debugger
      // }
    },
    onTabElClick(obj, index, isClick) {
      if (
        this.getbasicDataType(this.curTabSelect) === 'Object' &&
        obj.label !== this.curTabSelect.label
      ) {
        this.curTabSelect = Object.assign({}, obj)
        this.$emit('onTabClick', obj, isClick)
      }
    },
    onTabElEditClick(action, item) {
      window.event.stopPropagation()
      if (action === 'remove') {
        let indexOf = this.getIndexOf(this.tabListCp, item, 'label')
        // let delectIndexOf = this.curTabIndex >= 1 ? this.curTabIndex - 1 : this.tabListCp.length - 2
        if (indexOf <= this.curTabSelect) {
          this.$emit('onClearClick', this.tabListCp.splice(indexOf, 1), this.tabListCp)
          if (this.tabListCp.length > 0) {
            this.curTabIndex -= 1
          }
          this.tabListIn = this.tabListCp.slice(0, this.tabCount)
          this.activeDefault(this.curTabIndex)
        } else {
          this.$emit('onClearClick', this.tabListCp.splice(indexOf, 1), this.tabListCp)
          this.tabListIn = this.tabListCp.slice(0, this.tabCount)
        }
      }
      this.$emit('update:tabList', [...this.tabListCp])
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
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // 判断属性值的类型，如果是对象递归调用深拷贝
          newObj[key] =
            typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
        }
      }
      return newObj
    },
    init() {
      //  this.defultTabIndex = this.defaultSelect
      // this.tabListCp = JSON.parse(JSON.stringify(this.tabList))
      this.tabListCp = this.deepCopy(this.tabList) // 修复上面的深度copy 方法丢失问题
      let defultTabIndex = this.getIndexOf(
        this.tabListCp,
        this.defaultSelect,
        'label'
      )
      this.defultTabIndex = defultTabIndex < 0 ? 0 : defultTabIndex
      this.tabListIn = this.tabListCp
      this.setNavCount()
    }
  },
  mounted() {
    console.log('5', this.showZero)
    this.canRenderTab = true
    this.init()
    this.typeClass = this.typeClassMap[this.type]
  },
  watch: {
    tabList: {
      handler() {
        this.init()
      },
      deep: true,
      immediately: true
    },
    type: {
      handler() {
        this.typeClass = this.typeClassMap[this.type]
      },
      immediately: true
    },
    curTabSelect: {
      handler() {},
      deep: true,
      immediately: true
    },
    defaultSelect: {
      handler(newVal) {
        this.onTabElClick(newVal)
      },
      immediately: true
    },
    tabListIn: {
      handler() {
        console.log(55, this.isToolBar, this.tabListIn)
      },
      immediately: true
    }
  }

}
</script>
<style lang="scss">
// Tab组件
.Ttab-con {
  font-size: 0;
  text-align: left;
  box-sizing: border-box;
  width: auto;
  background: #f4faff;
  padding: 0 10px;
  border-bottom: solid 1px #e4e7ed;

  .tab-con-list {
    width: calc(100% - 70px);
  }

  .hidden {
    display: none;
  }

  li {
    width: 150px;
    cursor: pointer;
    text-align: center;

    .tab-li {
      line-height: 37px;
      position: relative;
      border-bottom: solid 2px transparent;

      span {
        font-size: 16px;
        color: #333;
        max-width: 125px;
      }

      em {
        margin-left: 10px;
        display: none;
        font-size: 14px;
        color: #333;
      }

      .tabLi-infor {
        .tabLi-infor-count {
          position: absolute;
          right: -5px;
          top: -10px;
          box-sizing: border-box;
          border-radius: 10px;
          font-size: 12px;
          line-height: 20px;
          min-width: 20px;
          background: red;
          color: #fff;
          padding: 0 5px;
        }
      }
    }
  }

  li.active {
    .tab-li {
      border-bottom: solid 2px #1890ff;

      span {
        color: #1890ff;
      }

      .tabLi-infor {
        .tabLi-infor-count {
          color: #fff;
        }
      }
    }
  }

  li:hover {
    .tab-li {

      // border-bottom: solid 2px #1890ff;
      span {
        color: #1890ff;
      }

      em {
        display: inline-block;
        color: #ed4014;
      }

      .tabLi-infor {
        .tabLi-infor-count {
          color: #fff;
        }
      }
    }
  }

  .offset {
    padding: 10px;

    i {
      color: #333;
      font-size: 14px;
    }
  }

  .offset:hover {
    i {
      color: #1890ff;
    }
  }
}

.Ttab-con.button {
  font-size: 0;
  text-align: left;
  background: transparent;
  border: none;

  .tab-con-list {
    width: calc(100% - 70px);
    padding: 6px 0;
    text-align: center;
  }

  li {
    cursor: pointer;
    width: auto;
    text-align: center;

    .tab-li {
      margin: 0px 3px;
      line-height: 32px;
      max-width: 50px;
      padding: 0 8px;
      border: solid 1px #ddd;
      background: #fff;

      span {
        font-size: 14px;
        font-weight: normal;
        color: #333;
      }
    }
  }

  li.active {
    .tab-li {
      border: solid 1px #2a8bfd;

      span {
        color: #2a8bfd;
      }

      .tabLi-infor {
        .tabLi-infor-count {
          color: #fff;
        }
      }
    }
  }

  li:hover {
    .tab-li {
      box-shadow: 0px 0px 2px #1890ff;
      border: solid 1px transparent;

      span {
        color: #2a8bfd;
      }

      .tabLi-infor {
        .tabLi-infor-count {
          color: #fff;
        }
      }
    }
  }

  li.active:hover {
    .tab-li {
      box-shadow: 0px 0px 2px #1890ff;
      border: solid 1px #2a8bfd;

      span {
        color: #2a8bfd;
      }

      .tabLi-infor {
        .tabLi-infor-count {
          color: #fff;
        }
      }
    }
  }
}

.Ttab-con.w100 {
  .tab-con-list {
    width: 100%;
    text-align: left;
  }

  .offset {
    display: none;
  }
}

.Ttab-con.w-button-offset {
  .tab-con-list {
    width: calc(100% - 70px);
  }

  .offset {
    padding: 5px;
  }
}

.Ttab-con.w-default-offset {
  .tab-con-list {
    width: calc(100% - 70px);
  }

  .offset {
    padding: 10px;
  }
}
</style>

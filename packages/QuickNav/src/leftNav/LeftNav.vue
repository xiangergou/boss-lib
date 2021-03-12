<!--  三级菜单  Author:Titans@2396757591@qq.com -->
<template>
  <div class="leftnav" :class="navClass">
    <div v-for="(item,index) in navDataIn" :key="index" class="menu-ml">
      <div
        class="level1 levelobj"
        :class="equePrefixLevel(index) ? 'active' : ''"
        @click="onClick(index,item)"
      >
        <i :class="'fn-inline basic-font el-icon-menu ' + item.fontCode"></i>
        <span class="fn-inline line-ellipsis" :title="item.name">{{ item.name }}</span>
        <em v-if="hasChildren(item)" class="fn-inline base-font basexiala"></em>
      </div>
      <transition name>
        <ul
          v-if="hasChildren(item)"
          v-show="equePrefixLevel(index) ? true : false"
          class="level2list"
        >
          <li v-for="(item1,index1) in getchildren(item)" :key="index + '-' + index1">
            <div
              class="level2 levelobj"
              :class="equePrefixLevel(index + '-' + index1) ? 'active' : ''"
              @click="onClick(index + '-' + index1,item1)"
              @mouseenter="onMouseenter(index + '-' + index1,item1)"
            >
              <i class="fn-inline el-icon-menu"></i>
              <span class="fn-inline line-ellipsis" :title="item1.name">{{ item1.name }}</span>
              <em v-if="hasChildren(item1)" class="fn-inline base-font basexiala"></em>
            </div>
            <!-- <transition name>
              <dl
                v-if="hasChildren(item1)"
                v-show="('-' + index + '-' + index1 === level1) ? true : false"
                class="level3list"
              >
                <dt
                  v-for="(item2,index2) in getchildren(item1)"
                  :key="index + '-' + index1 + '-' + index2"
                >
                  <div
                    class="level3 levelobj"
                    :class="('-' + index + '-' + index1 + '-' + index2 === level2 || curlevel === '-' + index + '-' + index1 + '-' + index2) ? 'active' : ''"
                    @click="onClick(index,index1,index2)"
                  >
                    <i class="fn-inline" :class="item2.fontCode ? item2.fontCode : ''"></i>
                    <em class="fn-inline"></em>
                    <span class="line-ellipsis fn-inline" :title="item2.name">{{ item2.name }}</span>
                  </div>
                </dt>
              </dl>
            </transition>-->
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EpLeftNav',
  components: {},
  props: {
    navClass: {
      // 菜单class
      type: String, // leftnav菜单Class
      default() {
        return ''
      }
    },
    navData: {
      // leftnav数据
      type: Array,
      default() {
        return []
      }
    },
    defaultActiveNav: {
      // 默认选择嵌套索引
      type: Array,
      default() {
        return []
      }
    },
    activeRouterObj: {
      // 默认选中菜单对象
      type: [Object, Boolean],
      default() {
        return false
      }
    }
  },
  data() {
    return {
      navDataIn: this.deepCopy(this.navData || []),
      level: [],
      argLevel: '',
      curlevel: 'curlevel'
    }
  },
  computed: {
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
    getchildren(item) {
      // 获取children
      return Array.isArray(item.children) ? item.children : []
    },
    hasChildren(item) {
      // 是否children
      return (
        item.hasOwnProperty('children') &&
        Array.isArray(item.children) &&
        item.children.length > 0
      )
    },
    equePrefixLevel(arg = '') {
      // console.log(this.curlevel, '' + arg, this.curlevel.startsWith('' + arg))
      let curlevel = this.curlevel.split('-')
      let argLevel = ('' + arg).split('-')
      return argLevel.every((item, index) => {
        return curlevel[index] === argLevel[index]
      })
    },
    setEmitCurNav(obj) {
      // 当前菜单点击后下一步操作
      let self = this
      self.$emit('onNavClick', obj, false)
      this.curSelectObj = obj
    },
    onClick(arg, obj) {
      // 菜单点击事件
      arg = '' + arg
      let self = this
      let str = ''
      let crumbsArr = []
      self.level = []
      self.curlevel = arg
      self.navDataIn.length > 0 &&
        arg.split('-').forEach(function (item, index) {
          if (item >= 0) {
            self.level.push(item)
            str = str + '-' + item
            self['leveldata' + index] = str
            if (index === 0) {
              obj = self.navDataIn[item] ? self.navDataIn[item] : obj
              crumbsArr.push(obj)
            } else if (obj.children && obj.children.length) {
              obj = obj.children[item]
              crumbsArr.push(obj)
            } else {
            }
          }
        })
      // obj.crumbsdata = crumbsArr
      if (crumbsArr.length > 0) {
        this.setEmitCurNav(obj)
      }
    },
    onMouseenter(arg, obj) {
      this.curlevel = '' + arg
      if (this.hasChildren(obj)) {
        this.$emit('onMouseenter', obj, true)
      } else {
        this.$emit('onMouseenter', obj, false)
      }
    },
    isInit() {
      // 判断是否初始化
      let obj = {}
      try {
        for (let i = 0; i < this.defaultActiveNav.length; i++) {
          if (i === 0) {
            obj = this.navData[this.defaultActiveNav[i]]
          } else {
            obj = obj.children[this.defaultActiveNav[i]]
          }
        }
      } catch (e) {
        obj = {}
        console.log(e)
      }
      if (obj && obj.remark) {
        return true
      } else {
        return false
      }
    },
    initLeftNav() {
      // 初始化
      this.navDataIn = this.deepCopy(this.navData || [])
      if (
        (this.navData.length > 0 &&
        this.defaultActiveNav.length > 0 &&
        this.defaultActiveNav.length <= 3) ||
        (this.navData.length > 0 && this.activeRouterObj.nestId)
      ) {
        if (this.activeRouterObj.nestId) {
          this.onClick(...this.activeRouterObj.nestId.split('_'))
        } else {
          this.onClick(...this.defaultActiveNav)
        }
      }
    }
  },
  mounted() {
    this.initLeftNav()
  },
  watch: {
    navData: {
      handler(newvalue) {
        this.initLeftNav()
      },
      immediate: true
    },
    defaultActiveNav: {
      handler(newvalue) {
        this.initLeftNav()
      },
      immediate: true
    },
    navClass: {
      handler(newvalue) {},
      immediate: true
    },
    activeRouterObj: {
      handler(newvalue) {},
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang='scss'>
.leftnav {
  font-size: 0;
  .menu-ml {
    .line-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .level1 {
      height: 40px;
      box-sizing: border-box;
      padding: 10px 0px 10px 0px;
      color: #fff;
      opacity: 0.75;
      cursor: pointer;
      a {
        display: block;
      }
      img {
        width: 14px;
        margin: 0 10px 0 24px;
        display: none;
      }
      i {
        width: 14px;
        font-size: 14px;
        margin: 0 10px 0 24px;
        vertical-align: middle;
      }
      span {
        width: 200px;
        font-size: 14px;
      }
      em {
        font-size: 12px;
      }
    }
    .level1.active {
      opacity: 1;
      em {
        transform-origin: center center;
        transform: rotate(180deg);
        font-weight: 600;
      }
      span {
        font-weight: 600;
      }
    }
    .level2 {
      height: 40px;
      line-height: 40px;
      padding: 0 10px 0 0px;
      background: #3259af;
      color: #fff;
      opacity: 0.75;
      cursor: pointer;
      a {
        padding: 0 10px 0 27px;
        display: block;
        margin: 0 -10px 0 -27px;
      }
      i {
        width: 14px;
        font-size: 14px;
        margin: 0 10px 0 24px;
        opacity: 0;
        vertical-align: middle;
      }
      span {
        font-size: 14px;
        width: 200px;
      }
      em {
        transform-origin: center center;
        transform: rotate(-90deg) scale(0.85);
        font-size: 12px;
      }
    }
    .level2:hover {
      background: #2a8bfd;
      opacity: 1;
      span {
        font-weight: 600;
      }
      em {
        font-weight: 600;
      }
    }
    .level2.active {
      background: #2a8bfd;
      opacity: 1;
      span {
        font-weight: 600;
      }
      em {
        font-weight: 600;
      }
    }
    dl {
      margin: 9px 0;
    }
    .level3 {
      height: 40px;
      padding: 10px 0 10px 47px;
      position: relative;
      line-height: 20px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      a {
        display: block;
        margin-left: -47px;
        padding-left: 47px;
      }
      i {
        width: 10px;
        height: 10px;
      }
      em {
        height: 26px;
        width: 2px;
        font-size: 12px;
      }
      span {
        margin-left: 5px;

        max-width: 105px;
      }
    }
    dl dt:last-child em {
      display: none;
    }
    .level3.active {
      padding-left: 47px;
      position: relative;
      span {
        color: #fff;
      }
    }
  }
  .level2list,
  .level3list {
    background: #3259af;
    transform-origin: top;
  }
}

.dropdown-height-enter-active {
  animation: transitionDropIn 0.3s running ease-in-out;
}

.dropdown-height-leave-active {
  animation: transitionDropOut 0.3s running ease-in-out;
}

@keyframes transitionDropIn {
  0% {
    opacity: 0;
    // transform: scaleY(0);
    height: 0;
  }

  100% {
    opacity: 1;
    // transform: scaleY(1);
    height: auto;
  }
}

@keyframes transitionDropOut {
  0% {
    opacity: 1;
    height: auto;
    // transform: scaleY(1);
  }

  100% {
    opacity: 0;
    height: 0;
    // transform: scaleY(0);
  }
}
</style>

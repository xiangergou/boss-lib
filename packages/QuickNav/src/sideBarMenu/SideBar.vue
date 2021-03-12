<!--  slidbar  Author:Titans@2396757591@qq.com -->
<template>
  <div class="sidebar-container ">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        unique-opened
        :router="false"
        mode="vertical"
        text-color="#fff"
        @select="handleSelect"
      >
        <SidebarItem v-for="menu in menuListIn" :key="menu.nestedId" :item="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import SidebarItem from './SidebarItem'
export default {
  name: 'Sidebar',
  components: { SidebarItem },
  props: {
    navData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      menuListIn: []
    }
  },
  methods: {
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
                ? nestedId + '-' + (index + 1)
                : index + 1 + ''
            cb && typeof cb === 'function' && cb(root)
            if (item.children && item.children.length) {
              deepEachTraversalArrFn(item.children, item.nestedId)
            }
          })
        }
      }
    },
    handleSelect(key, keyPath) {
      let self = this
      let navlevel = key.split('-')
      let obj = {}
      let crumbsArr = []
      navlevel.forEach(function (item, index) {
        if (index === 0) {
          obj = self.menuListIn[item - 1]
          crumbsArr.push(obj)
        } else {
          obj = obj.children[item - 1]
          crumbsArr.push(obj)
        }
      })
      this.$emit('onNavClick', obj, crumbsArr)
    }
  },
  mounted() {
    this.menuListIn = this.deepEachTraversalArr(this.navData)
  },
  watch: {
    navData: {
      handler() {
        this.menuListIn = this.deepEachTraversalArr(this.navData)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss">
.sidebar-container {
  height:100%;
  transition: width 0.28;
  .scrollbar-wrapper,.el-scrollbar{
    padding: 0;
    height: 100%
  }
  .scrollbar-wrapper{
    margin: 0!important;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-menu-item:focus{
    background: transparent;
  }
  .el-menu-item:hover{
    background: #1f8cfb;
  }
  .el-menu-item.is-active{
    color: #fff;
    background: #1f8cfb;
    font-weight: bold;
  }
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }
  .is-horizontal,
  .is-vertical {
    display: none;
  }
  .el-icon-arrow-down:before {
    color: rgba(255, 255, 255, 1);
  }
  .el-menu {
    background: #3259af;
    .el-icon-arrow-down {
      transform: rotate(-90deg);
    }
    .el-menu-item{
      padding:0;

    }
  }
  .el-menu {
    border: none;
    background-color: #3762bf;
    .el-menu-item,
    .el-submenu__title {
      height: 40px;
      line-height: 40px;
      font-size: 0;
      i.el-submenu__icon-arrow {
        color: #fff;
        font-size: 14px;
        transform: rotate(-90deg);
      }
      span {
         width: 90%;
        opacity: 0.75;
        margin: 0 10px;
        font-size: 14px;
        color: #ffffff;
      }
    }
    .nav-level-title-1{
      .ico{
        color: #ffffff;
        font-size: 14px;
        font-family: element-icons!important;
      }
      .ico:before {
       content: "\e798";
      }
    }
    // .nav-level-title-1{
    //   span{
    //     width: 185px;
    //   }
    // }
    // .nav-level-title-2{
    //   span{
    //     width: 180px;
    //   }
    // }
    // .nav-level-title-3{
    //   span{
    //     width: 165px;
    //   }
    // }
    // .nav-level-title-4{
    //   span{
    //     width: 160px;
    //   }
    // }
    // .nav-level-4{
    // span{
    //     width: 160px;
    //   }
    // }
    .is-opened>.el-submenu__title{
      i.el-submenu__icon-arrow {
        color: #fff;
        transform: rotate(0deg);
      }
      span {
        opacity: 1;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }

  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }
}
</style>

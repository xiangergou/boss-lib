<template>
  <!-- 操作日志 -->
  <el-drawer
    style="z-index:5000;"
    :visible.sync="showLogViews"
    :append-to-body="true"
    :show-close="true"
    size="40%"
    :with-header="false"
    @closed="colse"
  >
    <div class="drawer-title">
      <p>操作日志</p>
    </div>
    <div class="drawer-block">
      <ul>
        <li
          v-for="log in logsDatas"
          :key="log.logid"
        >
          <div class="drawer-circular"></div>
          <div class="drawer-straight">{{ log.actionName }}</div>
          <div class="drawer-right">
            <div class="journal">
              <p>{{ log.nodeName }}</p>
              <p>操作人员：{{ log.actionUser }}&nbsp;&nbsp;&nbsp;&nbsp;{{ log.actionTime }}</p>
            </div>
            <div class="journal-buttom">
              <p>{{ log.dutyName }}</p>
            </div>
          </div>
        </li>
      </ul>

      <button v-if="isShow" class="Morebutton" @click="showMore">展开更多&nbsp; <img src="./imgs/drop-down-arrow.svg" alt=""></button>

    </div>
  </el-drawer>
</template>
<script>
export default {
  name: 'bs-operation-log',
  props: {
    showLogView: {
      type: Boolean,
      default() {
        return false
      }
    },
    logsData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      logsDatas: [],
      allLogsData: [],
      showLogViews: this.showLogView,
      isShow: true
    }
  },
  computed: {},
  methods: {
    colse() {
      this.$parent.showLogView = false
    },
    showMore() {
      this.showMoreList = !this.showMoreList
      let deepValue = this.deepCopy(this.allLogsData)
      if (this.showMoreList) {
        this.logsDatas = deepValue
      } else {
        this.logsDatas.splice(3, this.logsDatas.length - 3)
      }
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
    }
  },
  created() {
  },
  mounted() {},
  watch: {
    logsData: {
      handler(newValue) {
        this.allLogsData = this.deepCopy(newValue)
        this.logsDatas = this.deepCopy(newValue)
        if (newValue.length > 3) {
          this.isShow = true
          console.log(this.logsDatas.length - 3)
          this.logsDatas.splice(3, this.logsDatas.length - 3)
          // console.log(deepValue, deepValue.splice(3, deepValue.length + 1), deepValue.length + 1)
        } else {
          this.isShow = false
          this.logsDatas = newValue
        }
        this.allLogsData = this.deepCopy(newValue)
      },
      deep: true,
      immediate: true
    },
    showLogView: {
      handler(newValue) {
        this.showLogViews = newValue
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss">
.el-drawer{
  overflow-y:auto;
}
.drawer-title{
  height:48px;
  width:100%;
  border-bottom: 1px solid #E8E8E8;
  p{
    font-size: 16px;
    line-height: 48px;
    color:#1D1F25;
    padding-left:14px;
    font-weight: bold;
  }
}
.drawer-block{
  .Morebutton{
    img{
      position: relative;
      top: -3px;
      left: 5px;
    }
    padding-right: 7px;
    width:96px;
    height:32px;
    font-size: 12px;
    line-height: 22px;
    border:1px solid #CCD2D8;
    border-radius: 5%;
    margin-left: 12px;
    background:#fff;
    color:rgb(57, 57, 61);
  }
  ul{
    margin-bottom: -10px;
    li:first-child{
      margin-top:24px;
      .drawer-circular{
        margin-left:15px;
        width: 20px;
        height: 20px;
        background:url(./imgs/提交节点icon.svg);
        border-radius: 50%;
      }
      .drawer-straight{
        position: relative;
        left: 30px;
        top:-20px;
        height: 20px;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        // border-left: 2px solid #E4E7ED;
      }
      .drawer-right{
        top:-17px;
      }
    }
    li:last-child{
      .drawer-right{
        padding-bottom: 24px;
        .journal{
          margin-top:5px;
        }
      }
    }
    li{
      .drawer-circular{
        margin-left:20px;
        width: 8px;
        height: 8px;
        // position: absolute;
        background:rgb(121, 124, 131);
        border-radius: 50%;
      }
      .drawer-straight{
        margin-left:21px;
        position: relative;
        left: 30px;
        top:-15px;
        height: 20px;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        color:#2E3133;
      }
      .drawer-right{
        box-sizing:border-box;
        padding-bottom: 10px;
        border-left: 2px solid #E4E7ED;
        left: 24px;
        position: relative;
        padding-left: 24px;
        top: -10px;
        .journal{
          margin-right: 48px;
          margin-top:5px;
          p{
            font-size: 12px;
            line-height: 17px;
            color:#5C6166
          }
          display: flex;
          justify-content: space-between;
        }
        .journal-buttom{
          margin-right: 48px;
          height:40px;
          p{
            padding:12px 0 0 16px;
            font-size: 12px;
            line-height: 17px;
            color:#5C6166
          }
          background: #E3F2FE 100%
        }
      }
    }
  }
}
</style>

<template>
  <div class="card-menu-extend__content">
    <div
      v-for="(item, index) in agentItems"
      v-show="hasData"
      :key="index"
      class="fn-inline menu-extend__item"
      :class=" [(index + 1) % allowNumIn === 0 ? 'extend-last-child' : '',
                ((index + 1) % allowNumIn === 1) ? 'extend-first-child' : '',
                (index + 1) <= allowNumIn ? 'extend-row-top' : '',
                (agentItems.length - (index + 1)) < (agentItems.length % allowNumIn) ? 'extend-row-bottom' : '',

      ]"
    >
      <div class="fn-inline extend-title">
        <div class="title-tip fn-inline olh" :title="item.title">{{ item.title }}</div>
        <div v-if="item.num" class="num-color fn-inline">{{ item.num }}个</div>
      </div>
      <button class="extend-btn" @click.stop="onClickBtn(item)">{{ item.button.label }}</button>
    </div>
    <div v-show="!hasData" class="no-data__content">
      暂无数据
    </div>

  </div>
</template>

<script>
import { extend } from '../utils'
export default {
  name: 'PoperExtend',
  props: {
    cardBtns: {
      type: Object,
      default() {
        return {}
      }
    },
    cur: {
      type: Object,
      default() {
        return {}
      }
    },
    allowNum: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    let agentItemTemp = []
    if (this.cur.currentCard && this.cur.currentBtn && this.cardBtns[this.cur.currentCard]) {
      agentItemTemp = extend(true, [], this.cardBtns[this.cur.currentCard][this.cur.currentBtn])
    }
    return {
      agentItems: agentItemTemp,
      cardBtnsIn: extend(true, {}, this.cardBtns),
      currentCard: this.cur.currentCard || '',
      currentBtn: this.cur.currentBtn || '',
      allowNumIn: this.allowNum
    }
  },
  computed: {
    hasData() {
      return this.agentItems.length
    }
  },
  methods: {
    // 业务按钮组点击
    onClickBtn(obj = {}) {
      // 按钮触发，事件回调
      Object.assign(obj, { type: this.currentCard })
      this.bsCardPoperClickEvent(obj)
    },

    // 点击事件回调
    bsCardPoperClickEvent(obj) {
      let self = this
      let methods = this.cardBtnsIn.globalConfig.methods
      if (typeof obj.callback === 'function') {
        // 方式一: 工具栏按钮点击事件回调
        obj.callback(obj, self)
      } else {
        // 方式二: toolbar事件代理
        typeof methods.bsCardPoperClickEvent === 'function' &&
          methods.bsCardPoperClickEvent(obj, self)
      }
    },

    initAgentItems() {
      if (this.currentCard && this.currentBtn) {
        if (!this.cardBtnsIn[this.currentCard]) {
          this.agentItems = []
          return
        }
        this.agentItems = extend(true, [], this.cardBtnsIn[this.currentCard][this.currentBtn])
      }
    }
  },
  created() {

  },
  mounted() {

  },
  watch: {
    cardBtns: {
      handler(newValue, oldValue) {
        this.cardBtnsIn = extend(true, {}, newValue)
        this.initAgentItems()
      },
      deep: true,
      immediate: true
    },
    cur: {
      handler(newValue, oldValue) {
        this.currentCard = newValue.currentCard
        this.currentBtn = newValue.currentBtn
        this.initAgentItems()
      },
      deep: true,
      immediate: true
    },
    allowNum(newValue) {
      this.allowNumIn = newValue
    }
  }
}
</script>

<style scoped lang="scss">
  .card-menu-extend__content{
    position: relative;
    padding: 8px 0;
    .no-data__content{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #dFE1E2;
      height: 120px;
    }
    .menu-extend__item{
      width: 466px;
      height: 40px;
      padding: 8px 50px;
      box-sizing: border-box;
      display: inline-flex;
      justify-content: space-between;
      font-size: 14px;
      color: #2E3133;
      border-right: solid 1px #DFE1E2;
      margin: 0 0 0 10px;
      .extend-title{
        margin-top: 2px;
        .title-tip{
          max-width: 150px;
        }
        .num-color{
          color: #FFA522;
          margin-left: 5px;
        }
      }
      .extend-btn{
        height: 24px;
        box-sizing: border-box;
        padding: 2px 8px;
        border-radius: 2px;
        font-weight: 300;
        font-size: 12px;
      }
      .olh {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .extend-last-child{
      margin-left: 0px;
      border-right: unset;
    }
    .extend-first-child{
      margin-left: 0px;
    }
    .menu-extend__item::after{
      padding:0;margin:0;display:block;
      content: "";
      width:50%;
      height:1.1px;
      background-color:white;
      position: absolute;
      right:0;
      top:-1px;
    }
    .extend-row-bottom::after{
      padding:0;margin:0;display:block;
      content: "";
      width:50%;
      height:1.1px;
      background-color:white;
      position: absolute;
      right:0;
      top:-1px;
    }
    .extend-btn{
      color: #409EFF;
      background: #ecf5ff;
      border-color: #b3d8ff;
    }
    .extend-btn:focus, .extend-btn:hover, .extend-btn:active{
      background-color: #409EFF;
      border-color: #409EFF;
      color: #fff;
    }

  }
</style>

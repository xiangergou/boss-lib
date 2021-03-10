<template>
  <div class="card-content">
    <img :src="cardMenuIn.bgUrl" class="content-bg">
    <div class="card-title">
      <i
        class="fn-inline base-font base-base-info-icon custom-title-icon"
        :class="cardMenuIn.title.icon"
        :style="{ color: cardMenuIn.iconColor }"
      ></i>
      <span class="custom-title">{{ cardMenuIn.title.title }}</span>
    </div>
    <div class="card-btns">
      <el-button
        v-for="(item, index) in cardMenuIn.buttons"
        :key="index"
        class="card-btn"
        :class="[cardMenuIn.btnHoverColorName, activeBtn === `${cardMenuIn.type}-${item.code}` ? 'btn-active' : '']"
        :style="{ '--btn-btnColor': cardMenuIn.btnColor, '--btn-iconColor': cardMenuIn.iconColor }"
        @click.stop="onClickBtn(item)"
      >
        <i
          class="fn-inline base-font"
          :class="[item.icon, cardMenuIn.iconColorName]"
        ></i>
        <span>{{ item.title }}</span>
        <span v-if="item.num" class="btn-num">{{ item.num }}条</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { extend } from '../utils'
import { defaultCardConfig, defaultCardData } from './config/config'
export default {
  name: 'Card',
  props: {
    cardGlobal: {
      type: Object,
      default() {
        return {}
      }
    },
    cardMenu: {
      type: Object,
      default() {
        return {}
      }
    },
    bsMenuClickEvent: {
      type: Function,
      default: function(obj, $this) {}
    },
    rowNo: {
      type: String,
      default() {
        return ''
      }
    },
    activeBtn: {
      type: String,
      default() {
        return ''
      }
    },
    seq: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      cardGlobalIn: extend(true, {}, this.cardGlobal),
      cardMenuIn: extend(true, {}, this.cardMenu),
      rowNumber: this.rowNo,
      seqIn: this.seq
    }
  },
  computed: {

  },
  methods: {

    // card按钮点击事件
    onClickBtn(obj = {}) {
      // 按钮触发，事件回调
      Object.assign(obj, { type: this.cardMenuIn.type, rowNo: this.rowNumber, seq: this.seqIn })
      this.bsCardClickEvent(obj)
    },

    // 点击事件回调
    bsCardClickEvent(obj) {
      let self = this
      let methods = this.cardMenuIn.methods
      if (typeof obj.callback === 'function') {
        // 方式一: 工具栏按钮点击事件回调
        obj.callback(obj, self)
      } else {
        // 方式二: toolbar事件代理
        typeof methods.bsCardClickEvent === 'function' &&
          methods.bsCardClickEvent(obj, self)
      }
    },

    initCardMenu() {
      let menuCp = extend(true, {}, this.cardMenuIn)
      let cardMenuInTemp = extend(true, defaultCardConfig, defaultCardData, this.cardMenuIn)
      if (menuCp.buttons && menuCp.buttons.length) {
        cardMenuInTemp.buttons = menuCp.buttons
      }

      this.cardMenuIn = extend(true, {}, cardMenuInTemp)
      // console.log('77', { ...this.cardMenuIn })
    }
  },
  created() {

  },
  mounted() {
  },
  watch: {
    cardGlobal: {
      handler(newValue, oldValue) {
        this.cardGlobalIn = Object.assign({}, this.cardGlobalIn, newValue)
      },
      deep: true,
      immediate: true
    },
    cardMenu: {
      handler(newValue, oldValue) {
        this.cardMenuIn = extend(true, {}, newValue)
        this.initCardMenu()
      },
      deep: true,
      immediate: true
    },
    rowNo(newValue) {
      this.rowNumber = newValue
    },
    seq(newValue) {
      this.seqIn = newValue
    }
  }
}
</script>

<style  lang="scss">
  .card-content{
    // width: 356px;
    // height: 224px;
    background: #FFFFFF;
    box-shadow: 0 0 12px 0 #A7CEE3;
    border-radius: 2px;
    padding: 0 5px 10px 5px;
    color: #2E3133;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    overflow: hidden;
    margin: 20px 0 0 0;
    .content-bg{
      width: 240px;
      height: 240px;
      position: absolute;
      right: -42px;
      top: -89px;
    }
    .card-title{
      height: 60px;
      padding: 22px 19px 12px 19px;
      .custom-title-icon{
        width: 60px;
        height: 60px;
        font-size: 60px;
        line-height: 60px;
      }
      .custom-title{
        font-size: 22px;
        color: #2E3133;
        letter-spacing: 0;
        text-align: left;
        margin-left: 13px;
      }
    }

    .card-btns{
      display: grid;
      grid-template-columns: 1fr 1fr;
      font-size: 0;
      .base-font{
        font-size: 18px;
      }
      .card-btn{
        min-width: 163px;
        height: 50px;
        background: #E3F2FE;
        padding: 15px 24px;
        font-size: 16px;
        color: #2E3133;
        text-align: left;
        font-weight: unset;
        border-radius: 0px;
        position: relative;
        margin: 10px 5px 0px 5px;
        .btn-num{
          position: absolute;
          right: 24px;
          font-size: 14px;
          line-height: 19px;
        }
      }
      .icon-class{
        margin-top: -3px;
        color: var(--btn-iconColor);
      }

      .btn-hover__class{
        background-color: var(--btn-btnColor);
        border-color: var(--btn-btnColor);
      }
      .btn-hover__class:hover, .btn-hover__class:active, .btn-active{
        background-color: var(--btn-iconColor);
        border-color: var(--btn-iconColor);
        color: #fff;
        .icon-class{
          color: #fff;
        }
      }
    }
  }
</style>

<!--
 * @Author: 轻语
 * @Date: 2021-03-09 21:16:36
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 21:20:09
 * @Description: 
-->
<!-- 卡片菜单 by comer-->
<template>
  <div ref="cardContent" class="card-menu__content">
    <div v-for="(item, index) in uiCardMenu" :key="index" class="menu-panel">
      <div ref="cardMenu" class="card-menu__card" :style="{ width: cardWidth, 'margin-left': marginWidth, 'margin-right': marginWidth, '--top-item-nums': allowNumIn }">
        <Card
          v-for="(card, idx) in item.cardMenu"
          :key="idx"
          :style="{ minWidth: '356px', minHeight: '224px' }"
          :card-global="cardGlobal"
          :card-menu="card"
          :row-no="item.rowNo"
          :active-btn="activeBtn"
          :seq="item.cardMenu.length === allowNumIn ? (idx === 0 ? 'first' : ((idx + 1) === item.cardMenu.length ? 'end' : 'middle')) : 'first'"
          :class="(idx === item.cardMenu.length - 1 ) ? 'row-last-card' : ''"
        />
      </div>
      <div v-show="curExtend === item.rowNo" ref="cardExtend" class="card-menu__extend" :style="{ width: extendWidth, 'margin-left': marginWidth, 'margin-right': marginWidth }">
        <div class="arrow" :class="arrowDirectClass"></div>
        <div class="extend-child">
          <PoperExtend v-if="(currentBtn === 'agentItem' || currentBtn === 'doneItem')" :card-btns="cardBtns" :cur="cur" :allow-num="allowNumIn" />
          <CardMenuTree v-if="currentBtn === 'funMenu'" />
          <CardVideo v-if="currentBtn === 'oprateGuide'" />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Card from './card/card'
import PoperExtend from './poper/poper'
import CardMenuTree from './other/menuTree'
import CardVideo from './other/video'
import data from './config/data'
// import databf from './config/databf'

import { extend } from './utils'

export default {
  name: 'bs-card-menu',
  // mixins: [databf],
  mixins: [data],
  components: {
    Card,
    PoperExtend,
    CardMenuTree,
    CardVideo
  },
  props: {

  },
  data() {
    return {
      uiCardMenu: {},
      curExtend: false, // 当前展开的行
      currentBtn: '', // 当前card上点击的按钮
      currentCard: '', // 当前card模块
      activeBtn: '',
      extendWidth: '0px',
      cardWidth: '0px',
      allowNumIn: 0,
      arrowDirectClass: 'arrow-left',
      marginWidth: '50px'
    }
  },
  computed: {
    cur() {
      return {
        currentBtn: this.currentBtn,
        currentCard: this.currentCard,
        allowNum: this.allowNumIn,
        arrowDirectClass: this.arrowDirectClass
      }
    }
  },
  methods: {
    // 生存配置项
    generateConfig() {
      // 1. 动态生成配置数据
      this.generateCardMenu()
      this.generateCardBtns()
      // 1. 加载本地图片
      this.getImageUrl()
      // 3. 自适应缩放
      this.resize()
    },
    // card上按钮，事件回调
    bsCardClickEvent(obj, $this) {
      // console.log(55, '回调方式333', obj, $this.$options)
      // 同一行的，同一个模块，同一按钮点击如果已经展开，第二次点击则收
      if (this.curExtend === obj.rowNo && this.currentCard === obj.type && this.currentBtn === obj.code && this.curExtend) {
        this.curExtend = false
        this.activeBtn = ''
        return
      }
      switch (obj.seq) {
        case 'first':
          this.arrowDirectClass = 'arrow-left'
          break
        case 'middle':
          this.arrowDirectClass = 'arrow-middle'
          break
        case 'end':
          this.arrowDirectClass = 'arrow-right'
          break
        default:
          this.arrowDirectClass = 'arrow-left'
      }
      this.activeBtn = `${obj.type}-${obj.code}` // 激活的按钮，全局只有一个
      this.curExtend = obj.rowNo
      this.currentBtn = obj.code
      this.currentCard = obj.type
    },

    // 展开面板，按钮回调
    bsCardPoperClickEvent(obj, $this) {
      console.log(56, '回调方式444', obj, $this.$options)
    },

    // 缩放
    resize() {
      let allowNum = 0
      if (this.$refs.cardContent.offsetWidth >= '1440') {
        allowNum = 4
      } else {
        allowNum = 3
      }
      let rows = []
      let menus = {}
      if (allowNum > 0) {
        // 将一个数组，按照几个元素一起分寸多个子数组
        for (let i = 0, len = this.cardMenu.length; i < len; i += allowNum) {
          rows.push(this.cardMenu.slice(i, i + allowNum))
        }

        this.extendWidth = (this.$refs.cardContent.offsetWidth - 100) + 'px'
        this.cardWidth = (this.$refs.cardContent.offsetWidth - 100) + 'px'
        this.allowNumIn = allowNum
      }

      rows.map((item, index) => {
        menus[`row${index + 1}`] = {
          rowNo: `row${index + 1}`,
          cardMenu: item
        }
      })

      this.uiCardMenu = extend(true, {}, menus)
    }
  },
  created() {

  },
  mounted() {
    window.addEventListener('resize', this.resize)
    this.generateConfig()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>

<style scoped lang="scss">
  .card-menu__content{
    // text-align: left;
    .card-menu__card{
      display: grid;
      grid-template-columns: repeat(var(--top-item-nums), 1fr);
      grid-column-gap: 24px;
      .row-last-card{
        margin-right: 0px;
      }
    }
    .card-menu__extend{
      // position: relative;
      // min-height: 139px;
      max-height: 400px;
      margin: 16px 10px 0 10px;
      background: #ffffff;
      border-radius: 2px;
      display: grid;
      grid-template-columns: 1fr;
      .arrow{
        position: absolute;
        width: 0px;
        height: 0px;
        border: 12px solid transparent;
        border-bottom-color: #fff;
        top: -23px;
        left: 36px;
      }
      .arrow-middle{
        left: 48%;
        right: unset;
      }
      .arrow-left{
        left: 36px;
        right: unset;
      }
      .arrow-right{
        right: 36px;
        left: unset;
      }
      .extend-child{
        width: 100%;
        // min-height: 139px;
        max-height: 400px;
        overflow: auto;
      }
    }
  }
</style>

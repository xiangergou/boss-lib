<template>
  <ul class="suc-steps">
    <li v-for="(item,index) in stepList" :key="index" :class="index < current || index === current ? 'active' : ''">
      <div class="icon-bg">
        <i class="icon" :class="'icon' + (index + 1)"></i>
      </div>
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>
<script>
export default {
  name: "bs-article-steps",
  data() {
    return {
      // steplen: this.stepName.length
    }
  },
  props: {
    current: {
      type: Number,
      default: 0
    },
    stepList: {
      type: Array,
      default() {
        return [{name: 'fuck'}, {name: 'shit'}]
      }
    }
  }
}
</script>

<style lang="scss">
.suc-steps {
  width: 705px;
  margin: 30px auto;
  display: flex;
  justify-content: space-between;
  li {
    width: 62px;
    text-align: center;
    &:nth-child(2) {
      .icon::after {
        position: absolute;
        content: '';
        left: -120px;
        top: 9px;
        height: 8px;
        width: 101px;
        background-color: #d8d8d8;
      }
    }
    &:nth-child(3) {
      .icon::after {
        position: absolute;
        content: '';
        left: -119px;
        top: 9px;
        height: 8px;
        width: 101px;
        background-color: #d8d8d8;
      }
    }
    &:nth-child(n + 4) {
      .icon::after {
        position: absolute;
        content: '';
        left: -116px;
        top: 9px;
        height: 8px;
        width: 101px;
        background-color: #d8d8d8;
      }
    }
    .icon-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 62px;
      height: 62px;
      background: url('./img/no-select-bg.svg') no-repeat;
    }
    .icon {
      position: relative;
      display: inline-block;
    }
    .icon1 {
      width: 22px;
      height: 26px;
      background: url('./img/icon1.svg') no-repeat;
    }
    .icon2 {
      width: 22px;
      height: 26px;
      background: url('./img/icon2.svg') no-repeat;
    }
    .icon3 {
      width: 25px;
      height: 25px;
      background: url('./img/icon3.svg') no-repeat;
    }
    .icon4 {
      width: 30px;
      height: 25px;
      background: url('./img/icon4.svg') no-repeat;
    }
    .icon5 {
      width: 30px;
      height: 25px;
      background: url('./img/icon5.svg') no-repeat;
    }
    span {
      display: inline-block;
      line-height: 14px;
      font-size: 14px;
      color: #333;
    }
  }
  .active {
    span {
      color: #1b7ad9;
    }
    &:nth-child(n + 2) {
      .icon::after {
        background-color: #1890ff;
      }
    }
    .icon-bg{
       background: url('../../images/select-bg.svg') no-repeat;
    }
  }
}
</style>

<!--  面包屑组件  Author:Titans -->
<template>
  <div class="crumbs" :class="crumbsClass">
    <i class="fn-inline crumbsico"></i>
    <div
      v-for="(item,index) in crumbsdatain"
      :key="index"
      class="fn-inline btn"
      :class="active(index) ? 'active' : ''"
      @click="onCrumbsClick(index)"
    >
      <span class="fn-inline">{{ item.name }}</span>
      <i v-show="!active(index)" class="fn-inline jtico"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bs-crumbs',
  props: {
    crumbsClass: {
      // 面包屑class
      type: String,
      default() {
        return ''
      }
    },
    crumbsdata: {
      // 面包屑数据
      type: Array,
      default() {
        return [{ name: '首页' }]
      }
    }
  },
  data() {
    return {
      crumbsdatain: this.crumbsdata,
      crumbsdatainlength: this.crumbsdata.length - 1
    }
  },
  methods: {
    active(index) {
      return this.crumbsdatainlength === index
    },
    onCrumbsClick(index) {
      this.$emit('onCrumbsClick', this.crumbsdatain, index) // 面包屑点击事件
    },
    setCrumbsDataIn() {
      this.crumbsdatain = this.crumbsdata
      this.crumbsdatainlength = this.crumbsdata.length - 1
    }
  },
  mounted() {
    this.setCrumbsDataIn()
  },
  watch: {
    crumbsdata: {
      handler() {
        this.setCrumbsDataIn()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.crumbs {
  padding: 0 24px;
  text-align: left;
  line-height: 40px;
  font-size: 0;
  background: #fff;
  border-bottom: solid 1px #DCDFE6;
  .crumbsico {
    height: 18px;
    width: 18px;
    background: url(./img/localico.svg);
    background-size: 100% 100%;
    margin-right: 5px;
  }
  .jtico {
    height: 20px;
    width: 12px;
    margin: 0 5px 0 8px;
    background: url(./img/arrow-right.svg);
    background-size: 100% 100%;
    line-height: 9px;
    color: #dcdcdd;
    font-size: 9px;
  }
  span {
    font-size: 14px;

    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .btn:hover {
    cursor:pointer;
    outline: 0;
    box-shadow: none;
    border-color: transparent;
    span {
      color: rgba(23, 128, 227, 1);
    }
  }
  .btn:focus {
    outline: 0;
    box-shadow: none;
    border-color: transparent;
  }
  .active {
    .jtico {
      display: inline-block;
    }
    span {
      color: rgba(23, 128, 227, 1);
    }
  }
}
</style>

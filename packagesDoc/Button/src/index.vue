<!--
 * @Author: 轻语
 * @Date: 2021-03-09 16:44:01
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-15 09:33:23
 * @Description: 
-->
<template>
 <div class="button-wrap">
    <!-- <el-button>fuck</el-button> -->
    <!-- <vxe-modal v-model="visible"></vxe-modal> -->
    <div class="icon-bg"></div>
 </div>
</template>

<script>

 import vdom from 'boss-lib/src/utils/vdom.js'
 /**
   * The only true button.
   * @displayName Best Button
   */
 export default {
  name: "bs-button",
   components: {},
   computed: {},
   data () {
     return {
       visible: true
     }
   },
   methods: {},
   created() {
   },
  mounted() {
    console.log(vdom, 'vdom')
  }
 }
</script>

<style lang="scss" scoped>

.button-wrap{
  width: 100vw;
  height: 100vh;
  background: pink;
  .icon-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 62px;
      height: 62px;
      background: url('./assets/no-select-bg.svg') no-repeat;
    }
}
 
</style>

<!--
 * @Author: 轻语
 * @Date: 2021-03-09 16:44:01
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-09 18:28:52
 * @Description: 
-->
<template>
 <div>
   <img :src="avatar" alt="">
   <!-- <img :src="png" alt=""> -->
  <el-button>fuck</el-button>
 </div>
</template>

<script>
// import avatar from '@/imgs/2.jpeg'
import avatar from '@/assets/logo.png'

 export default {
  name: "Button",
   components: {},
   computed: {},
   data () {
     return {
       avatar
      //  png
     }
   },
   methods: {},
   created() {
   },
   mounted() {
   },
 }
</script>

<style>

 
</style>

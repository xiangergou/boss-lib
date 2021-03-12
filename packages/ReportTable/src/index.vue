<!--  ReportTable   Author:Titans@2396757591@qq.com -->

<template>
  <div class="T-report-table height-all">

    <div class="excel-main">
      <div class="excel-header">
      </div>
      <div class="excel-index">
      </div>
    </div>
  </div>
</template>

<script>
import data from './util/data'
import methods from './util/methods'
import watch from './util/watch'
export default {
  data,
  props: {
  },
  methods: {
    ...methods
  },
  created() {
    this.initCreated()
  },
  mounted() {
    this.initMounted()
  },
  watch: {
    ...watch
  }
}
</script>

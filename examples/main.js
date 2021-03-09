import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'


Vue.use(Element)
Vue.use(VXETable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

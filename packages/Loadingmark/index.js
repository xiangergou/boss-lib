/*
 * @Author: 轻语
 * @Date: 2021-03-10 14:42:03
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-10 14:53:39
 * @Description: 
 */

import Loadingmark from './src/index.vue'
import Vue from 'vue'
Loadingmark.newloadingmark = () => {
  const loadingmark = (tip) => {
    return new Vue({
      data: {},
      render(h) {
        return h(Loadingmark, {
          props: {
            tip: tip
          }
        })
      }
    })
  }
  const component = loadingmark('加载中......').$mount()
  // const loading_bar = loadingmark.$children[0];
  return {
    showLoadingMark(el) {
      if (el && document.getElementById(el)) {
        document.getElementById(el).appendChild(component.$el)
        // document.getElementById(el).getElementsByTagName("iframe").style.filter = 'blur(15px)'
      } else {
        document.body.appendChild(component.$el)
        // document.body.getElementById("maincontent").style.filter = 'blur(10px)'
      }
    },
    getLoadingMark() {
      return component.$el
    },
    removeLoadingMark(el) {
      for (let i = 0; i < document.getElementsByClassName('markloading').length; i++) {
        if (document.getElementById(el)) {
          document.getElementById(el).removeChild(document.getElementsByClassName('markloading')[i])
          // document.getElementById(el).getElementsByTagName("iframe").style.filter = 'none'
        } else {
          document.body.removeChild(document.getElementsByClassName('markloading')[i])
          // document.body.getElementById("maincontent").style.filter = 'none'
        }
      }
    }
  }
}
export default Loadingmark.newloadingmark()

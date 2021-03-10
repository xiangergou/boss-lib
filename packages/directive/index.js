import { trigger, scrollTo } from './directions'

const directives = {
  trigger,
  scrollTo
}

export default {
  install (Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}

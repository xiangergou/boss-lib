/**
 * 让滚动条滚动到指定的位置
 * 接受自定义的top y值和left x值， 默认值 0
 * eg.
 * 每次列表更新时将滚动条滚动到列表顶部
 * v-scrollTop="{update : boolean,  x: 0, y: 0}" || v-scrollTop="update"
 */
/* eslint-disable */
const scrollTo = {
  update(el, binding) {
    const value = binding.value
    let isUpdate = false
    let x = 0
    let y = 0
    if (typeof value === 'object' && typeof binding.oldValue === 'object') {
      isUpdate = value.update !== binding.oldValue.update
      x = value.x || 0
      y = value.y || 0
    } else {
      /* istanbul ignore next */
      isUpdate = value !== binding.oldValue
    }
    if (isUpdate) {
      el.scrollTop = y || 0
      el.scrollLeft = x || 0
    }
  }
}

const trigger = {
  inserted(el, binging) {
    el.click()
  }
}

export {
  trigger,
  scrollTo
}

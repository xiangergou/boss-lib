const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

/**
 * 实现对象复制
 * @return {object}
 */
function extend() {
  let target = arguments[0] || {}
  let index = 1
  let deep = false
  if (typeof target === 'boolean') {
    deep = target
    index++
    target = arguments[1] || {}
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }
  let len = arguments.length
  for (; index < len; index++) {
    let source = arguments[index]
    if (source !== null) {
      for (let k in source) {
        let src = target[k]
        let copy = source[k]
        if (copy === target) {
          continue
        }
        let isArray = Array.isArray(copy)
        if (deep && (isPlainObject(copy) || isArray)) {
          let clone
          if (isArray) {
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[k] = extend(deep, clone, copy)
        } else if (typeof copy !== 'undefined') {
          target[k] = copy
        }
      }
    }
  }
  return target
}

export {
  isPlainObject,
  extend
}

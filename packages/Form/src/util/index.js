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

const deepObjCopy = (obj) => {
  // 深拷贝通用方法
  // var new_arr = JSON.parse(JSON.stringify(arr)) // 不仅可拷贝数组还能拷贝对象（ 但不能拷贝函数）
  // 只拷贝对象
  let me = this
  if (typeof obj !== 'object' || obj === null) return obj
  // 根据obj的类型判断是新建一个数组还是一个对象
  let newObj = obj instanceof Array ? [] : {}
  for (let key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] =
        typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}

export {
  isPlainObject,
  deepObjCopy,
  extend
}

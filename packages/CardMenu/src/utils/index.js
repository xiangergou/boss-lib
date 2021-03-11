const ArraySlice = Array.prototype.slice

/**
 * 克隆对象(深克隆)
 * 如果对象或数组中有function，该方法无效
 * @param {Any} value
 * @returns {Any}
 */
const objectClone = value => JSON.parse(JSON.stringify(value))

let uid = 1

/**
 * uuid
 * @param {String} prefix
 * @returns {String}
 */
const uuid = prefix => {
  uid++
  return (prefix || '') + uid
}

const isPlainObject = obj => typeof obj === 'object' && obj !== null && Object.prototype.toString.call(obj) === '[object Object]'

const HASOWN = Object.prototype.hasOwnProperty

const hasKey = (key, object) => HASOWN.call(object, key)

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

// 去掉px取出整形，比如'24px'--->24
const getInt = value => {
  if (typeof (value) === 'number') {
    return value
  } else {
    return parseInt(value.substr(0, value.indexOf('px')))
  }
}

const toArray = arrayLike => ArraySlice.call(arrayLike)

const uniqueArray = arr => Array.from(new Set(arr))

/**
 * 比较两个json对象
 * @param {*} a
 * @param {*} b
 */
const compareJson = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/**
 * 比较两个Arr
 * @param {*} a
 * @param {*} b
 */
const compareArr = (a, b) => JSON.stringify(a.sort()) === JSON.stringify(b.sort())

const isString = value => typeof value === 'string'

const isArray = Array.isArray

const isObject = value => value !== null && typeof value === 'object'

const isElement = value => isObject(value) && value.nodeType === 1 && !isPlainObject(value)

/**
 * 校验传入值是否是布尔类型
 * @param {*} value
 * @returns {Boolean}
 */
const isBoolean = value => typeof value === 'boolean'

/**
 * 校验传入值是否是函数
 * @param {*} value
 * @returns {Boolean}
 */
const isFunction = value => typeof value === 'function'
/**
 * 对象混合
 * arg1 :
 *  Boolean: 是否深拷贝
 *  Object: targe
 * arg2, arg2, ..., argn: source
 * @returns {Object}
 */
function mixins() {
  let target = arguments[0] || {}
  let i = 0
  let deep = false
  let len = arguments.length
  if (isBoolean(target)) {
    deep = target
    target = arguments[1] || {}
    i = 1
  }
  if (!isObject(target) && !isFunction(target)) {
    target = {}
  }
  while (i++ < len) {
    let source = arguments[i]
    if (source) {
      for (let k in source) {
        let src = target[k]
        let copy = source[k]
        // 防止引用自身，造成死循环
        if (copy === target) {
          continue
        }
        let _isArray = isArray(copy)
        if (deep && (_isArray || isPlainObject(copy))) {
          let clone
          if (_isArray) {
            clone = src && isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[k] = mixins(deep, clone, copy)
        } else if (copy !== 'undefined') {
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
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] =
        typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}

const fn = () => {}

/**
 * 通过name查找父组件
 * @param {*} vueIns
 * @param {*} name
 */
const findParentComponent = (vueIns, name) => {
  let parent = vueIns.$parent
  while (parent) {
    let componentName = parent.$options.componentName || parent.$options.name
    if (componentName !== name) {
      parent = parent.$parent
    } else {
      return parent
    }
  }
  return false
}

export {
  objectClone,
  uuid,
  isPlainObject,
  getInt,
  toArray,
  hasKey,
  compareJson,
  compareArr,
  uniqueArray,
  isString,
  isArray,
  isElement,
  mixins,
  deepObjCopy,
  extend,
  fn,
  findParentComponent

}

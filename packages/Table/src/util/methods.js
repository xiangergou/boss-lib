// methods   Author:Titans@2396757591@qq.com
/* eslint-disable no-eval */
import { tableColumns, filterTypeMap } from '../config/tableDefaultConfig'
import formatters from './formatter'
const util = {
  getbasicDataType(obj) {
    // 获取数据类型
    return Object.prototype.toString.call(obj).slice(8, -1)
  },
  hyphenate(str) {
    // 小驼峰转成连字符
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
  },
  smallHump(str) {
    // 连字符转成小驼峰
    return str.replace(/(\w*)-(\w*)/g, function($1, $2, $3) {
      return $2 + $3[0].toUpperCase() + $3.slice(1)
    })
  },
  deepCopy(obj) {
    // 深拷贝通用方法
    let me = this
    if (typeof obj !== 'object' || obj === null) return obj
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
      }
    }
    return newObj
  },
  transToNumber(number, digits = 0) {
    // 输入实时判断转换为数字
    let lastKey = number.substr(number.length - 1, 1)
    let hasNumber = number.substr(0, number.length - 1)
    let numberArr = number.split('.')
    if (numberArr.length > 2) {
      number = hasNumber
    } else if (numberArr[0] === '') {
      number = '0' + number
    } else if (!(/[0-9]/ig).test(lastKey)) {
      number = hasNumber
    } else if (numberArr[1] && (digits === 0 || numberArr[1].length > digits)) {
      number = hasNumber
    } else {
    }
    return number.split('').filter((item, index) => {
      return (/[0-9]|./ig).test(item)
    }).join('')
  },
  digitUppercase(money) {
    money = (money + '').replace(/undefined|null|,|NaN/ig, '')
    // 汉字的数字
    let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    // 基本单位
    let cnIntRadice = ['', '拾', '佰', '仟']
    // 对应整数部分扩展单位
    let cnIntUnits = ['', '万', '亿', '兆']
    // 对应小数部分单位
    let cnDecUnits = ['角', '分', '毫', '厘']
    // 整数金额时后面跟的字符
    let cnInteger = '整'
    // 整型完以后的单位
    let cnIntLast = '元'
    // 最大处理的数字
    let maxNum = 999999999999999.9999
    // 金额整数部分
    let integerNum
    // 金额小数部分
    let decimalNum
    // 输出的中文金额字符串
    // 分离金额后用的数组，预定义
    let parts
    if (money === '') { return '' }
    let chineseStr = money < 0 ? '欠' : ''
    money = Math.abs(money) + ''
    if (money >= maxNum) {
      // 超出最大处理数字
      return ''
    }
    if (money === 0) {
      chineseStr = chineseStr + (cnNums[0] + cnIntLast + cnInteger)
      return chineseStr
    }
    // 转换为字符串
    if (money.indexOf('.') === -1) {
      integerNum = money
      decimalNum = ''
    } else {
      parts = money.split('.')
      integerNum = parts[0]
      decimalNum = parts[1].substr(0, 4)
    }
    // 获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      let zeroCount = 0
      let IntLen = integerNum.length
      for (let i = 0; i < IntLen; i++) {
        let n = integerNum.substr(i, 1)
        let p = IntLen - i - 1
        let q = p / 4
        let m = p % 4
        if (n === '0') {
          zeroCount++
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0]
          }
          // 归零
          zeroCount = 0
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
        }
        if (m === 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q]
        }
      }
      chineseStr += cnIntLast
    }
    // 小数部分
    if (decimalNum !== '') {
      let decLen = decimalNum.length
      for (let i = 0; i < decLen; i++) {
        let n = decimalNum.substr(i, 1)
        if (n !== '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i]
        }
      }
    }
    if (chineseStr === '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger
    } else if (decimalNum === '') {
      chineseStr += cnInteger
    }
    return chineseStr
  },
  // digitUppercase_old(n) {
  //   /* 现金额大写 */
  //   if (typeof n === 'number') {
  //     n = String(n)
  //   };
  //   n = n.replace(/,/g, '') // 替换tomoney()中的“,”
  //   n = n.replace(/ /g, '') // 替换tomoney()中的空格
  //   n = n.replace(/￥/g, '') // 替换掉可能出现的￥字符
  //   // if (isNaN(n)) { //验证输入的字符是否为数字
  //   //     //alert("请检查小写金额是否正确");
  //   //     return "";
  //   // };
  //   let fraction = ['角', '分']
  //   let digit = [
  //     '零', '壹', '贰', '叁', '肆',
  //     '伍', '陆', '柒', '捌', '玖'
  //   ]
  //   let unit = [
  //     ['元', '万', '亿', '万', '亿'],
  //     ['', '拾', '佰', '仟']
  //   ]
  //   let head = n < 0 ? '欠' : ''
  //   n = Math.abs(n)
  //   let s = ''
  //   for (let i = 0; i < fraction.length; i++) {
  //     s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  //   }
  //   s = s || '整'
  //   n = Math.floor(n)
  //   for (let i = 0; i < unit[0].length && n > 0; i++) {
  //     let p = ''
  //     for (let j = 0; j < unit[1].length && n > 0; j++) {
  //       p = digit[n % 10] + unit[1][j] + p
  //       n = Math.floor(n / 10)
  //     }
  //     s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  //   }
  //   return head + s.replace(/(零.)*零元/, '元')
  //     .replace(/(零.)+/g, '零')
  //     .replace(/^整$/, '零元整')
  // },
  // digitUppercase(num, type) {
  //   /* 将阿拉伯数字翻译成中文的大写数字 */
  //   if (typeof num === 'number') {
  //     num = num + ''
  //   };
  //   num = num.replace(/,/g, '') // 替换tomoney()中的“,”
  //   num = num.replace(/ /g, '') // 替换tomoney()中的空格
  //   num = num.replace(/￥/g, '') // 替换掉可能出现的￥字符
  //   let rel = num < 0 ? (type === 'number' ? '负' : '欠') : ''
  //   num = num < 0 ? -(num) : num
  //   let AA = type === 'number' ? ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'] : ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  //   let BB = type === 'number' ? ['', '十', '百', '千', /* "萬", "億", */ '万', '亿', '点', ''] : ['', '拾', '佰', '仟', '万', '亿', '元', '', '角', '分']
  //   let a = ('' + num).replace(/(^0*)/g, '').split('.')
  //   let k = 0
  //   let re = ''
  //   for (let i = a[0].length - 1; i >= 0; i--) {
  //     switch (k) {
  //       case 0:
  //         re = BB[7] + re
  //         break
  //       case 4:
  //         if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$')
  //           .test(a[0])) {
  //           re = BB[4] + re
  //         }
  //         break
  //       case 8:
  //         re = BB[5] + re
  //         BB[7] = BB[5]
  //         k = 0
  //         break
  //     }
  //     if (k % 4 === 2 && a[0].charAt(i + 2) !== 0 && a[0].charAt(i + 1) === 0) {
  //       re = AA[0] + re
  //     }
  //     if (a[0].charAt(i) !== 0) {
  //       re = AA[a[0].charAt(i)] + BB[k % 4] + re
  //     }
  //     k++
  //   }
  //   if (a.length > 1) { // 加上小数部分(如果有小数部分)
  //     re += BB[6]
  //     for (let i = 0; i < a[1].length; i++) {
  //       re += AA[a[1].charAt(i)] + (BB[i + 8] ? BB[i + 8] : '')
  //     }
  //   } else {
  //     if (type !== 'number') {
  //       re += '元整'
  //     }
  //   }
  //   if (re === '一十') {
  //     re = '十'
  //   }
  //   if (re.match(/^一/) && re.length === 3) {
  //     re = re.replace('一', '')
  //   }
  //   return rel + re
  // },
  each: function(object, callback) {
    /* js原生each方法 */
    let type = (function(obj) {
      switch (obj.constructor) {
        case Object:
          return 'Object'
        case Array:
          return 'Array'

        case NodeList:
          return 'NodeList'
        default:
          return 'null'
      }
    })(object)
    // 为数组或类数组时, 返回: index, value
    if (type === 'Array' || type === 'NodeList') {
      // 由于存在类数组NodeList, 所以不能直接调用every方法
      [].every.call(object, function(v, i) {
        return callback.call(v, i, v) !== false
      })
    } else if (type === 'Object') {
      // 为对象格式时,返回:key, value
      for (let i in object) {
        if (callback.call(object[i], i, object[i]) === false) {
          break
        }
      }
    }
  },
  isObj(x) {
    let type = typeof x
    return x !== null && (type === 'object' || type === 'function')
  },
  toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    return Object(val)
  },
  assignKey(to, from, key) {
    let self = this
    let hasOwnProperty = Object.prototype.hasOwnProperty
    let val = from[key]
    if (val === undefined || val === null) {
      return
    }
    if (hasOwnProperty.call(to, key)) {
      if (to[key] === undefined || to[key] === null) {
        throw new TypeError('Cannot convert undefined or null to object (' + key + ')')
      }
    }
    if (!hasOwnProperty.call(to, key) || !self.isObj(val)) {
      to[key] = val
    } else {
      to[key] = self.assign(Object(to[key]), from[key])
    }
  },
  assign(to, from) {
    let self = this
    let propIsEnumerable = Object.prototype.propertyIsEnumerable
    if (to === from) {
      return to
    }
    from = Object(from)
    for (let key in from) {
      if (hasOwnProperty.call(from, key)) {
        self.assignKey(to, from, key)
      }
    }
    if (Object.getOwnPropertySymbols) {
      let symbols = Object.getOwnPropertySymbols(from)
      for (let i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          self.assignKey(to, from, symbols[i])
        }
      }
    }
    return to
  },
  deepAssign(target) {
    // 深度合并
    // deepAssign({ a: { b: 0 } }, { a: { b: 1, c: 2 } }, { a: { c: 3 } })
    let self = this
    target = self.toObject(target)
    for (let s = 1; s < arguments.length; s++) {
      self.assign(target, arguments[s])
    }
    return target
  },
  setMoneyUnitCp(Unitlevel, oldUnitlevel) {
    // 设置金额单位 废弃
    if (Unitlevel === '') {
      return
    }
    let xGrid = this.$refs.xGrid
    if (!xGrid) {
      return
    }
    // let fullData = this.getData()
    let fullData = xGrid.getTableData().fullData
    let fullDataCp = Object.freeze(JSON.parse(JSON.stringify(fullData)))
    let conlums = xGrid.getTableColumn().fullColumn
    fullData.forEach((row, rowIndex) => {
      conlums.forEach((column, conlumIndex) => {
        if (column.own.fieldType) {
          let value = (typeof (row[column.own.field]) === 'number' || typeof (row[column.own.field]) === 'string') ? parseFloat(row[column.own.field].toString().split(',').join('')) : 0
          console.log('处理前', value)
          value = isNaN(value) ? 0 : value
          value = value * oldUnitlevel / Unitlevel
          console.log('处理前', value)
          // eslint-disable-next-line no-useless-escape
          row[column.own.field] = parseFloat(value.toFixed(2))
          row[column.own.field] = Number(row[column.own.field].toFixed(2)).toLocaleString()
        }
      })
    })
    console.log(fullData, conlums, fullDataCp)
    xGrid.reloadData(fullData).then().catch()
  },
  transformMoneyByUnit(data, conlums, type = 'big', unit, rendererList = ['$moneyRender']) {
    // 循环转化金额数据
    let self = this
    let dataCp = [...data]
    console.log(dataCp)
    dataCp.forEach((row, rowIndex) => {
      self.transformRowMoneyByUnit(row, conlums, type, unit, rendererList)
    })
    return dataCp
  },
  transformRowMoneyByUnit(row, conlums, type, unit, rendererList) {
    // 递归转化单条数据
    let self = this
    conlums.forEach((conlum, conlumIndex) => {
      let itemRender = conlum.cellRender || conlum.editRender || conlum.contentRender
      if (itemRender && rendererList.indexOf(itemRender.name) >= 0 && !conlum.children) {
        if (type === 'big') {
          row[conlum.field] = (parseFloat(row[conlum.field]) / unit).toFixed(2)
        } else {
          row[conlum.field] = (parseFloat(row[conlum.field]) * unit).toFixed(2)
        }
      }
      if (Array.isArray(conlum.children) && conlum.children.length) {
        self.transformRowMoneyByUnit(row, conlum.children, type, unit, rendererList)
      }
    })
  }
}
const sortMethods = {
  arrSortGloabal({ $table, data, column, property, order, rTypeSuffix }) {
    // 通用 排序
    data.sort(function (a, b) {
      if (!(a[property] !== undefined && b[property] !== undefined)) {
        if (order === 'asc') {
          return true
        } else {
          return false
        }
      }
      if (order === 'asc') {
        if (isNaN(Number(a[property]))) {
          return (String(a[property])).localeCompare(String(b[property]))
        }
        return a[property] - b[property]
      } else {
        if (isNaN(Number(a[property]))) {
          return (String(b[property])).localeCompare(String(a[property]))
        }
        return b[property] - a[property]
      }
    })
    return data
  },
  // 调整 废弃结束
  // arrSortTreeString({ $table, data, column, property, order }) {
  //   // tree 排序
  //   data.sort(function (a, b) {
  //     if (!(a[property] !== undefined && b[property] !== undefined)) {
  //       if (order === 'asc') {
  //         return true
  //       } else {
  //         return false
  //       }
  //     }
  //     let valueA = a[property].split('##')
  //     let valueB = b[property].split('##')
  //     valueA.shift()
  //     valueA = valueA.join('-')
  //     valueB.shift()
  //     valueB = valueB.join('-')
  //     if (order === 'asc') {
  //       return String(valueA).localeCompare(String(valueB))
  //     } else {
  //       return String(valueB).localeCompare(String(valueA))
  //     }
  //   })
  //   return data
  // },
  // arrSortTreeData({ $table, data, column, property, order }) {
  //   data.sort(function(a, b) {
  //     if (!(a[property] !== undefined && b[property] !== undefined)) {
  //       if (order === 'asc') {
  //         return true
  //       } else {
  //         return false
  //       }
  //     }
  //     let valueA = a[property]
  //     let valueB = b[property]
  //     if (order === 'asc') {
  //       return String(valueA).localeCompare(String(valueB))
  //     } else {
  //       return String(valueB).localeCompare(String(valueA))
  //     }
  //   })
  //   return data
  // },
  // arrSortNumberOption({ $table, data, column, property, order }) {
  //   // options 排序
  //   let render = column.own && (column.own.editRender || column.own.cellRender || column.own.contentRender)
  //   if (render && render.name) {
  //     let options = render.options || []
  //     data.sort(function (a, b) {
  //       if (!(a[property] !== undefined && b[property] !== undefined)) {
  //         if (order === 'asc') {
  //           return true
  //         } else {
  //           return false
  //         }
  //       }
  //       let valueA = ''
  //       let valueB = ''
  //       options.forEach((item, index) => {
  //         if (item.value === a[property]) {
  //           valueA = item.label
  //         }
  //         if (item.value === b[property]) {
  //           valueB = item.label
  //         }
  //       })
  //       if (order === 'asc') {
  //         return (valueA).localeCompare(valueB)
  //       } else {
  //         return (valueB).localeCompare(valueA)
  //       }
  //     })
  //     return data
  //   } else {
  //     return this.arrSortGloabal({ $table, data, column, property, order })
  //   }
  // },
  // arrSortNumberCheckbox({ $table, data, column, property, order, rTypeSuffix }) {
  //   // checkbox 排序
  //   // let render = column.own && (column.own.editRender || column.own.cellRender || column.own.contentRender)
  //   // if (render && render.name) {
  //   //   let options = render.options || []
  //   //   data.sort(function (a, b) {
  //   //     a[property] = Array.isArray(a[property]) ? a[property] : []
  //   //     b[property] = Array.isArray(b[property]) ? b[property] : []
  //   //     let valueA = []
  //   //     let valueB = []
  //   //     options.forEach((item, index) => {
  //   //       let indexOfA = a[property].indexOf(item.value)
  //   //       let indexOfB = b[property].indexOf(item.value)
  //   //       if (indexOfA >= 0) {
  //   //         valueA[indexOfA] = item.label
  //   //       }
  //   //       if (indexOfB >= 0) {
  //   //         valueA[indexOfB] = item.label
  //   //       }
  //   //     })
  //   //     if (order === 'asc') {
  //   //       return (valueA.join('')).localeCompare(valueB.join(''))
  //   //     } else {
  //   //       return (valueB.join('')).localeCompare(valueA.join(''))
  //   //     }
  //   //   })
  //   //   return data
  //   // } else {
  //   //   return this.arrSortGloabal({ $table, data, column, property, order })
  //   // }
  //   data.sort(function (a, b) {
  //     if (!(a[property] !== undefined && b[property] !== undefined)) {
  //       if (order === 'asc') {
  //         return true
  //       } else {
  //         return false
  //       }
  //     }
  //     if (order === 'asc') {
  //       return (a[property + rTypeSuffix]).localeCompare(b[property + rTypeSuffix])
  //     } else {
  //       return (b[property + rTypeSuffix]).localeCompare(a[property + rTypeSuffix])
  //     }
  //   })
  //   return data
  // },
  // arrSort_old({ $table, data, column, property, order }) {
  //   // 排序
  //   let self = this
  //   let render = column.own && (column.own.editRender || column.own.cellRender || column.own.contentRender)
  //   if (render && render.name) {
  //     switch (render.name) {
  //       case '$vxeSelect':
  //         if (render.props.multiple) {
  //           return self.arrSortNumberCheckbox({ $table, data, column, property, order, rTypeSuffix: '_select_sort' })
  //         } else {
  //           return self.arrSortNumberOption({ $table, data, column, property, order, rTypeSuffix: '_select_sort' })
  //         }
  //       case '$vxeCheckbox':
  //         return self.arrSortNumberCheckbox({ $table, data, column, property, order, rTypeSuffix: '_checkbox_sort' })
  //       default:
  //         return self.arrSortGloabal({ $table, data, column, property, order })
  //       case '$vxeTree':
  //         return self.arrSortTreeData({ $table, data, column, property, order })
  //       case '$vxeRadio':
  //         return self.arrSortNumberOption({ $table, data, column, property, order })
  //       case '$treeinput':
  //         return self.arrSortTreeString({ $table, data, column, property, order })
  //       case '$treeText':
  //         return self.arrSortTreeString({ $table, data, column, property, order })
  //       case '$span':
  //         return self.arrSortString({ $table, data, column, property, order })
  //       case '$href':
  //         return self.arrSortString({ $table, data, column, property, order })
  //       case '$EditDownTextarea':
  //         return self.arrSortString({ $table, data, column, property, order })
  //       case '$EditDownConditions':
  //         return self.arrSortString({ $table, data, column, property, order })
  //       case '$moneyRender':
  //         return self.arrSortNumber({ $table, data, column, property, order })
  //       case '$calculateRender':
  //         return self.arrSortNumber({ $table, data, column, property, order })
  //       case '$vxeDays':
  //         return self.arrSortNumber({ $table, data, column, property, order })

  //       case '$vxeTime':
  //         return self.arrSortNumber({ $table, data, column, property, order })
  //       case '$vxeMoney':
  //         return self.arrSortNumber({ $table, data, column, property, order })
  //       case '$select':
  //         return self.arrSortNumberOption({ $table, data, column, property, order })
  //     }
  //   } else {
  //     data.sort(function(a, b) {
  //       if (order === 'asc') {
  //         if (isNaN(Number(a[property]))) {
  //           return (a[property].toString()).localeCompare(b[property].toString())
  //         }
  //         return a[property] - b[property]
  //       } else {
  //         if (isNaN(Number(a[property]))) {
  //           return (b[property].toString()).localeCompare(a[property].toString())
  //         }
  //         return b[property] - a[property]
  //       }
  //     })
  //   }
  //   return data
  // },
  // 调整 废弃结束
  arrSortString({ $table, data, column, property, order }) {
    // 字符 排序
    data.sort(function(a, b) {
      if (order === 'asc') {
        return (String(a[property])).localeCompare(String(b[property]))
      } else {
        return (String(b[property])).localeCompare(String(a[property]))
      }
    })
    return data
  },
  arrSortNumber({ $table, data, column, property, order }) {
    // 数字 排序
    data.sort(function(a, b) {
      if (order === 'asc') {
        return a[property] - b[property]
      } else {
        return b[property] - a[property]
      }
    })
    return data
  },
  arrSortStringSuffix({ $table, data, column, property, order, rTypeSuffix }) {
    // 通用 排序 new
    data.sort(function(a, b) {
      if (order === 'asc') {
        return (String(a[property])).localeCompare(String(b[property]))
      } else {
        return (String(b[property])).localeCompare(String(a[property]))
      }
    })
    return data
  },
  arrSortNumberSuffix({ $table, data, column, property, order, rTypeSuffix }) {
    // 通用 排序 new
    data.sort(function(a, b) {
      if (order === 'asc') {
        return parseFloat(a[property]) - parseFloat(b[property])
      } else {
        return parseFloat(b[property]) - parseFloat(a[property])
      }
    })
    return data
  },
  arrSort({ $table, data, column, property, order }) {
    // 排序
    let self = this
    const sortTypeMap = {
      // number类型排序
      $vxeMoney: 'arrSortNumberSuffix',
      $vxeDays: 'arrSortNumberSuffix',
      $vxeCalculate: 'arrSortNumberSuffix',
      // 字符类型排序
      $vxeTree: 'arrSortStringSuffix',
      $vxeInput: 'arrSortStringSuffix',
      $vxeSelect: 'arrSortStringSuffix',
      $vxeEditDownTextarea: 'arrSortStringSuffix',
      $vxeTime: 'arrSortStringSuffix',
      $vxeRadio: 'arrSortStringSuffix',
      $vxeCheckbox: 'arrSortStringSuffix',
      $$vxeEditDownJson: 'arrSortStringSuffix',
      $vxeEditDownConditions: 'arrSortStringSuffix',
      $vxeInterlet: 'arrSortStringSuffix'
    }
    let render = column.own && (column.own.editRender || column.own.cellRender || column.own.contentRender)
    if (render && render.name && sortTypeMap[render.name]) {
      return self[sortTypeMap[render.name]]({ $table, data, column, property, order, rTypeSuffix: '__viewSort' })
    } else {
      data.sort(function(a, b) {
        if (order === 'asc') {
          if (isNaN(Number(a[property]))) {
            return (a[property].toString()).localeCompare(b[property].toString())
          }
          return a[property] - b[property]
        } else {
          if (isNaN(Number(a[property]))) {
            return (b[property].toString()).localeCompare(a[property].toString())
          }
          return b[property] - a[property]
        }
      })
    }
    return data
  }
}
const registFn = {
  registGlobleFormatters(obj) {
    let self = this
    Object.keys(obj).forEach((item, index) => {
      self.$VXETable.formats.add(item, obj[item].bind(self))
    })
  },
  registGloableConlumsConfig(arr = []) {
    // 注册列格式化，渲染器，过滤项目等全局函数
    let self = this
    function reverRegistGloableConlumsConfig(arrc) {
      arrc.forEach((item, index) => {
        self.registSingelRowConfig(arrc, item, index)
        if (Array.isArray(item.children) && item.children.length) {
          self.registGloableConlumsConfig(item.children)
        }
      })
    }
    reverRegistGloableConlumsConfig(arr)
  },
  registSingelRowConfig(arr, item, index) {
    // 注册 单条数据配置项
    let self = this
    arr[index] = self.registSingelRowFilter(item)
    // self.registSingelRowFormater(item)
    // self.registSingelRowSorts(item)
    // self.registSingelRowRenderer(item)
    // self.registSingRowCalcRenderer(item)
  },
  registSingRowCalcRenderer(item) {
    // 注册单条数据计算渲染器
    if (item.formula && !item.editRender) {
      item.editRender = {
        name: '$vxeCalculate'
      }
    }
  },
  registSingelRowFilter_old(item) {
    // 绑定单条列过滤器配置
    if (Array.isArray(item.children)) {
      return
    }
    if (item.filters !== undefined || item.filters || item.filterRender !== undefined || item.filterRender) {
      // if (item.filters === false) {
      //   delete item.filters
      //   delete item.filterRender
      //   delete item.filterMethod
      // }

      // type+editable
      // { value: '$vxeInput', label: '输入框' },
      // { value: '$vxeSelect', label: '下拉选择' },
      // { value: '$vxeCalculate', label: '计算' },
      // { value: '$vxeMoney', label: '金额' },
      // { value: '$vxeEditDownTextarea', label: '文本输入框' },
      // { value: '$vxeDays', label: '天数' },
      // { value: '$vxeTime', label: '时间' },
      // { value: '$vxeRadio', label: '单选' },
      // { value: '$vxeCheckbox', label: '复选' },
      // { value: '$treeinput', label: '下拉树' },
      // { value: '$EditDownJson', label: 'JSON' },
      // { value: '$href', label: '链接' }
      return
    }
    let self = this
    let itemRender = item.cellRender || item.editRender || item.contentRender
    if (item.filters === undefined || item.filters === true) {
      if (item.field && self.tableConfigCp.filters[item.field]) {
        item.filters = self.tableConfigCp.filters[item.field].filters ? self.tableConfigCp.filters[item.field].filters : [{ data: '' }]
        if (typeof (self.tableConfigCp.filters[item.field].filterMethod) === 'function') {
          item.filterMethod = self.tableConfigCp.filters[item.field].filterMethod ? self.tableConfigCp.filters[item.field].filterMethod : ({ option, row, column }) => {
            return row[column.property] === Number(option.data)
          }
        }
      } else if (item.field && itemRender) {
        switch (itemRender.name) {
          case '$select':
            item.filters = Array.isArray(itemRender.options) ? itemRender.options : []
            item.filterMultiple = true
            break
          case '$vxeSelect':
            item.filters = Array.isArray(itemRender.options) ? itemRender.options : []
            item.filterMultiple = true
            break
          case '$calculateRender':
            item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'float' } }]
            item.filterRender = { name: 'FilterComplex' }
            break
          case '$vxeCalculate':
            item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'float' } }]
            item.filterRender = { name: 'FilterComplex' }
            break
          case '$moneyRender':
            item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'float' } }]
            item.filterRender = { name: 'FilterComplex' }
            break
          case '$vxeMoney':
            item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'float' } }]
            item.filterRender = { name: 'FilterComplex' }
            break
          case '$href':
            item.filters = [{ data: '' }]
            item.filterRender = { name: 'FilterInput' }
            break
          case '$vxeRadio':
            item.filters = Array.isArray(itemRender.options) ? itemRender.options : []
            item.filterMultiple = true
            break
          case '$vxeCheckbox':
            item.filters = [{ data: { vals: [], sVal: '' } }]
            item.filterRender = { name: 'FilterChoose' }
            break
          case '$vxeInput':
            // text, search, number, integer, float, password, date, datetime, week, month, year
            if (this.getbasicDataType(itemRender.props) === 'Object' && itemRender.props.type) {
              switch (itemRender.props.type) {
                case 'text':
                  item.filters = [{ data: { vals: [], sVal: '' } }]
                  item.filterRender = { name: 'FilterContent' }
                  break
                case 'float':
                  item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'float' } }]
                  item.filterRender = { name: 'FilterComplex' }
                  break
                case 'number':
                  item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'number' } }]
                  item.filterRender = { name: 'FilterComplex' }
                  break
                case 'year':
                  item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'year' } }]
                  item.filterRender = { name: 'FilterComplex' }
                  break
                case 'date':
                  item.filters = [{ data: { type: 'has', isCase: false, value: '', dataType: 'date' } }]
                  item.filterRender = { name: 'FilterComplex' }
                  break
                default:
                  if (itemRender.name === '$optionSort' || itemRender.name === 'optionRow') {
                    delete item.filters
                    delete item.filterRender
                    delete item.filterMethod
                  } else {
                    item.filters = [{ data: '' }]
                    item.filterRender = { name: 'FilterInput' }
                  }
                  break
              }
            } else {
              item.filters = [{ data: '' }]
              item.filterRender = { name: 'FilterInput' }
            }
            break
          case '$EditDownTextarea':
            item.filters = [{ data: { vals: [], sVal: '' } }]
            item.filterRender = { name: 'FilterContent' }
            break
          case '$vxeEditDownTextarea':
            item.filters = [{ data: { vals: [], sVal: '' } }]
            item.filterRender = { name: 'FilterContent' }
            break
          case '$treeinput':
            item.filters = [{ data: { vals: [], sVal: '' } }]
            item.filterRender = { name: 'FilterContent' }
            break
          default:
            if (['seq', 'checkbox', 'dragSort', 'radio', 'optionRow'].indexOf(item.type)) {
              delete item.filters
              delete item.filterRender
              delete item.filterMethod
            } else {
              item.filters = [{ data: '' }]
              item.filterRender = { name: 'FilterInput' }
            }
            break
        }
      } else {
        item.filters = [{ data: '' }]
        item.filterRender = { name: 'FilterInput' }
      }
    }
  },
  registSingelRowFilter(item) {
    // 绑定单条列过滤器配置
    if (Array.isArray(item.children)) {
      return item
    }
    try {
      let itemRender = item.cellRender || item.editRender
      if (itemRender && ((item.filters + '' === 'true') || item.filters + '' === 'undefined')) {
        if (itemRender.name && filterTypeMap[itemRender.name]) {
          if (itemRender.name === '$vxeInput') {
            if (this.getbasicDataType(itemRender.props) === 'Object' && filterTypeMap['$vxeInput'][itemRender.name + itemRender.props.type]) {
              item = Object.assign({}, item, filterTypeMap['$vxeInput'][itemRender.name + itemRender.props.type])
            } else {
              item = Object.assign({}, item, filterTypeMap['$vxeInput'][itemRender.name + 'global'])
            }
          } else {
            item = Object.assign({}, item, filterTypeMap[itemRender.name])
          }
        } else {
          const { options } = itemRender
          switch (itemRender.name) {
            case '$vxeSelect':
              item.filters = Array.isArray(options) ? options : []
              item.filterMultiple = true
              break
            case '$vxeRadio':
              item.filters = Array.isArray(itemRender.options) ? itemRender.options : []
              item.filterMultiple = true
              break
            case '$vxeCheckbox':
              item.filters = [{ data: { vals: [], sVal: '' } }]
              item.filterRender = { name: 'FilterSelect' }
              break
            default:
              if (['seq', 'checkbox', 'dragSort', 'radio', 'optionRow'].indexOf(item.type)) {
                delete item.filters
                delete item.filterRender
                delete item.filterMethod
              } else {
                item.filters = [{ data: '' }]
                item.filterRender = { name: 'FilterInput' }
              }
              break
          }
        }
      } else if (!(typeof item.filters === 'object')) {
        item.filters = false
      } else {
      }
    } catch (e) {
      throw (e)
    }
    return item
  },
  registSingelRowFormater(item) {
    // 绑定单条列格式化配置 废弃
    let self = this
    if (item.field && self.tableConfigCp.formatters[item.field]) {
      item.formatter = self.tableConfigCp.formatters[item.field]
    }
  },
  registSingelRowRenderer(item) {
    // 绑定单条列渲染器配置 废弃
    let self = this
    let itemRender = item.cellRender || item.editRender || item.contentRender
    if (item.field && self.tableConfigCp.cellRenderConfig[item.field] && !itemRender) {
      item[self.tableConfigCp.cellRenderConfig[item.field].type] = self.tableConfigCp.cellRenderConfig[item.field]
    }
  },
  registSingelRowSorts(item) {
    // 绑定单条列排序配置
    if (!item.children && item['sortable'] === undefined) {
      item['sortable'] = item['sortable'] || true
    }
  },
  registRenderers(arr = []) {
    // 初始化绑定列渲染器
    let self = this
    function reverRegistRenderers(arrc) {
      arrc.forEach((item, index) => {
        reverRegistRenderers(item)
        if (Array.isArray(item.children) && item.children.length) {
          self.registRenderers(item.children)
        }
      })
    }
    reverRegistRenderers(arr)
  },
  registFilters(arr = []) {
    // 初始化绑定列过滤器函数 废弃
    let self = this
    arr.forEach((item, index) => {
      self.registSingelRowFilter(item)
      if (Array.isArray(item.children) && item.children.length) {
        self.registFormatters(item.children)
      }
    })
  },
  registFormatters(arr = []) {
    // 初始化绑定列格式化函数 废弃
    let self = this
    arr.forEach((item, index) => {
      self.registSingelRowFormater(item)
      if (Array.isArray(item.children) && item.children.length) {
        self.registFormatters(item.children)
      }
    })
  },
  registTableRender(renderers) {
    // 注册渲染器
    for (let i in renderers) {
      this.$VXETable.renderer.add(i, renderers[i])
    }
  }
}
const initMethods = {
  initCreated() {
    // 初始化Created
    // 即将废弃
    // this.registTableRender(defaultRenderers)
    // this.registGlobleFormatters(defaultFormatters)
  },
  initMounted() {
    // 初始化Mounted
    this.moneyUnit = this.defaultMoneyUnit
    this.initFirst()
  },
  initFirst() {
    // 组件初始化
    this.initTableGlobalConfig()
    this.initContextMenuConfig()
    this.initSeqConfig()
    this.initExpandConfig()
    this.initToolbar()
    this.initEditConfig()
    this.initTableFormConfig()
    this.initCalculateConstraintConfig()
    this.initTableConfig()
    this.initEditRules()
    this.initTable()
    this.initTableData()
  },
  initTable() {
    this.initTableConlums()
    this.setPagerConfig()
  },
  initTableGlobalConfig() {
    // 初始化全局配置
    this.tableGlobalConfigIn = Object.assign({}, this.tableGlobalConfigIn, this.tableGlobalConfig)
  },
  initTableConfig() {
    // 初始化表格列和渲染器配置
    this.tableConfigCp = Object.assign({}, this.tableConfigCp, this.tableConfig)
    this.registTableRender(this.tableConfigCp.renderers)
  },
  initTableConlums() {
    // 初始化列配置
    this.calculateConstraintConfigIn = Object.assign({}, this.calculateConstraintConfigIn, {
      colFormulaConfig: { // 列公式配置
      }
    })
    this.generateCalcColFormulaMap(this.tableColumnsConfig)
    this.tableColumnsConfigIn = this.unidirectionalData ? this.deepCopy(this.generateTableConlums(this.tableColumnsConfig, this.tableConfigCp.globalConfig)) : this.generateTableConlums(this.tableColumnsConfig, this.tableConfigCp.globalConfig)
    return this.tableColumnsConfigIn
  },
  generateTableConlums(conlums, globalConfig) {
    // 生成表头
    let tableColumnsConfigIn = []
    if (globalConfig.checkType) {
      tableColumnsConfigIn.push(tableColumns[globalConfig.checkType])
    }
    if (globalConfig.seq) {
      tableColumnsConfigIn.push(tableColumns['seq'])
    }
    tableColumnsConfigIn = [...tableColumnsConfigIn, ...conlums]
    if (globalConfig.optionSort) {
      tableColumnsConfigIn.push(tableColumns['optionSort'])
    }
    this.registGloableConlumsConfig(tableColumnsConfigIn)
    return tableColumnsConfigIn
  },
  generateOptionRow(tableColumnsConfigIn, globalConfig) {
    // 初始化操作列 废弃
    if (globalConfig.hasOptionRow) {
      let optionRow = tableColumns['optionRow']
      if (this.getbasicDataType(this.tableConfigCp.cellRenderConfig.optionRow) === 'Object') {
        let cellRender = optionRow.cellRender
        cellRender = Object.assign({}, this.tableConfigCp.cellRenderConfig.optionRow)
        optionRow[this.tableConfigCp.cellRenderConfig.optionRow.type] = cellRender
      }
      tableColumnsConfigIn.push(optionRow)
    }
    return tableColumnsConfigIn
  },
  initCalculateConstraintConfig() {
    // 初始化计算和约束配置
    this.calculateConstraintConfigIn = Object.assign({}, this.calculateConstraintConfigIn, this.calculateConstraintConfig)
  },
  initToolbar() {
    // 初始化工具栏
    if (this.getbasicDataType(this.toolbarConfig) === 'Boolean') {
      this.toolbarConfigIn = undefined
      this.toolbarConfigInCopy = {}
    } else {
      this.toolbarConfigIn = Object.assign({}, this.toolbarConfigInCp, this.toolbarConfig)
      this.toolbarConfigInCopy = this.toolbarConfigIn
      if (this.toolbarConfigInCopy.yearlist.length) {
        this.formSearchData.year = this.toolbarConfigInCopy.yearlist[0]
      }
    }
  },
  initTableData(data) {
    let self = this
    this.initCalculateConstraintConfig()
    // 初始化表格数据
    this.selection = []
    if (this.$refs.xGrid) {
      this.$refs.xGrid.$refs.xTable.tableSourceData = []
      this.$refs.xGrid.removeCheckboxRow()
    }
    let calclataResult = this.reductionRowFormula(this.calculateConstraintConfigIn.rowformulaConfig, this.addMissingFieldsAndCalcColFormula(data || this.tableData), this.id)
    calclataResult = this.reductionRowCodeFormula(this.calculateConstraintConfigIn.rowCodeFormulaConfig, calclataResult, this.id)
    this.tableDataIn = this.unidirectionalData ? this.deepCopy(calclataResult) : calclataResult
    this.$nextTick().then(() => {
      if (self.$refs.xGrid) {
        self.$refs.xGrid.reloadData(self.tableDataIn).then(() => {
          self.$refs.xGrid.clearFilter().then(() => {
            self.$refs.xGrid.$refs.xTable.tableSourceData = self.deepCopy(self.getTableData().fullData)
            self.$refs.xGrid.$refs.xTable.handleDefaults()
          })
        })
      }
    })
    return this.tableDataIn
  },
  initTableFormConfig() {
    if (this.getbasicDataType(this.tableFormConfig) === 'Boolean') {
      this.tableFormConfigIn = undefined
    } else {
      this.tableFormConfigIn = Object.assign({}, this.tableFormConfig)
    }
  },
  initSeqConfig(startIndex = 0) {
    // 初始化序号配置项
    let self = this
    this.seqConfig = {
      startIndex: 1, // 设置序号的起始值 number0
      seqMethod({ row, $rowIndex, rowIndex, column, columnIndex, seq, $seq }) {
        if (self.pagerConfigIn && !self.treeConfig) {
          return (self.pagerConfigIn.pageSize > 0 ? self.pagerConfigIn.pageSize : 20) * ((self.pagerConfigIn.currentPage > 0 ? self.pagerConfigIn.currentPage : 1) - 1) + seq
        } else {
          return $seq === '' || $seq === undefined ? seq : $seq + '.' + seq
        }
      }
    }
  },
  initEditConfig() { // 编辑配置
    // 暂时性方案，后期调整
    if (this.getbasicDataType(this.editConfig) === 'Boolean') {
      // this.editConfigIn = false
      this.editConfigIn = {
        trigger: 'dblclick',
        mode: 'cell',
        activeMethod: ({ row, rowIndex, column, columnIndex }) => {
          return false
        },
        showStatus: false
      }
    } else if (this.getbasicDataType(this.editConfig) === 'Object') {
      if (this.editConfig.editable !== false) {
        this.editConfigIn = Object.assign(this.editConfigInCp, this.editConfig)
      } else {
        this.editConfigIn = {
          trigger: 'dblclick',
          mode: 'cell',
          activeMethod: ({ row, rowIndex, column, columnIndex }) => {
            return false
          },
          showStatus: false
        }
      }
    }
  },
  refreshTableIsEdit() {
    // 重新渲染刷新表格

  },
  initExpandConfig() {
    // 编辑展开配置
    if (this.getbasicDataType(this.expandConfig) === 'Undefined' || this.getbasicDataType(this.expandConfig) === 'Boolean') {
      this.expandConfigIn = {
        expandAll: false
      }
    } else {
      this.expandConfigIn = Object.assign({}, this.expandConfig)
    }
  },
  initContextMenuConfig() {
    // 更新右键配置
    if (this.getbasicDataType(this.contextMenuConfig) === 'Undefined' || this.getbasicDataType(this.contextMenuConfig) === 'Boolean') {
      this.contextMenuConfigIn = {}
    } else {
      this.contextMenuConfigIn = Object.assign({}, this.contextMenuConfigIn, this.contextMenuConfig)
    }
  },
  initTreeConfig() {
    // 表格树配置
    if (this.getbasicDataType(this.treeConfig) === 'Boolean') {
      this.treeConfigIn = this.treeConfig
    } else {
      this.treeConfigIn = Object.assign({
        dblExpandAll: false, // 双击展开当前节点树形数据
        onlyDblTreeNodeExpand: false, // 在不允许编辑模式下是否仅仅双击树列才允许执行展开
        dblExpand: false, // 是否执行双击展开树形数据
        children: 'children',
        accordion: true,
        iconOpen: 'fa fa-minus-square-o',
        iconClose: 'fa fa-plus-square-o'
      }, this.treeConfig)
    }
  },
  initFooterConfig() {
    // 更新footer配置
    this.footerConfigIn = Object.assign({}, this.footerConfigIn, this.footerConfig)
  },
  initEditRules() {
    // 编辑校验规则
    this.editRulesIn = Object.assign({}, this.editRulesIn, this.addTreeReg({ ...this.editRules }))
  }
}
const tableOptionFn = {
  tableOptionFn() {
    // 全局表格组件xgrid调用实例
    return this.$refs.xGrid
  },
  updateFooter() {
    // 更新表尾
    return this.$refs.xGrid.updateFooter()
  },
  exportData(obj) {
    // 导出数据
    this.$refs.xGrid.openExport({
      // 默认勾选源
      original: true
    })
  },
  importDataEvent() {
    // 导入数据
    this.$refs.xGrid.importData()
  },
  setAllCheckboxRow() {
    // 设置所有选中
    this.$refs.xGrid.setAllCheckboxRow(true)
    this.updateFooter().then(() => { }).catch(() => { })
  },
  clearCheckboxRow() {
    // 清除所有选中
    this.$refs.xGrid.clearCheckboxRow()
    this.updateFooter().then(() => {}).catch(() => {})
  },
  removeCheckboxRow() {
    // 删除选中行操作
    let self = this
    this.$XModal.confirm('您确定要删除所选中数据吗?').then(type => {
      if (type === 'confirm') {
        self.$refs.xGrid.removeCheckboxRow()
      }
    })
  },
  revertEvent() {
    // 撤销操作
    this.$XModal.confirm('您确定要还原数据吗?').then(type => {
      if (type === 'confirm') {
        // this.$refs.xGrid.revertData()
        this.reLoadTable()
      }
    })
  },
  deleteRowData(rows) {
    // 删除选中行操作
    let self = this
    this.$XModal.confirm('您确定要删除所选中数据吗?').then(type => {
      if (type === 'confirm') {
        self.$refs.xGrid.removeCheckboxRow(rows)
      }
    })
  },
  async copySelectionRowData(obj = {}) {
    // 复制选中行数据
    let self = this
    return new Promise((resolve, reject) => {
      const { rowIndexTo, data } = obj
      let rowTo = rowIndexTo === undefined ? -1 : rowIndexTo
      let newRowSelectionsData = data || self.$refs.xGrid.getCheckboxRecords()
      if (newRowSelectionsData.length) {
        newRowSelectionsData.forEach((item, index) => {
          Object.assign({}, item, {
            insertMark: '新数据',
            date: new Date().format('YYYY-MM-DD hh:mm:ss:c'),
            isNew: true,
            _XID: ''
          })
        })
        self.$refs.xGrid.insert(newRowSelectionsData).then(({ row, rows }) => {
          self.$refs.xGrid.setActiveCell(rowTo).then(() => {
            resolve({ tableData: self.getTableData, row: row }, self)
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject(e)
        })
      } else {
        reject(new Error('请先选择新增数据的模版!'))
        self.$XModal.message({ message: '请先选择新增数据的模版!' })
      }
    })
  },
  async copyRowData(obj = {}) {
    // 复制行
    let self = this
    const { rowSource, rowIndexTo } = obj
    let rowSourceData = rowSource === undefined ? 0 : rowSource
    let rowTo = rowIndexTo === undefined ? -1 : rowIndexTo
    // 复制行
    let newRowDataObj = { ...self.$refs.xGrid.getData(rowSourceData) }
    newRowDataObj = Object.assign({}, newRowDataObj, {
      insertMark: '新数据',
      date: new Date().format('YYYY-MM-DD hh:mm:ss:c'),
      isNew: true,
      _XID: ''
    })
    let { row } = await self.$refs.xGrid.insert(newRowDataObj, rowTo)
    await self.$refs.xGrid.setCurrentRow(row)
    await self.$refs.xGrid.setActiveCell(row)
    await self.$refs.xGrid.validate(row).catch(errMap => errMap)
    // this.$XModal.message({ message: `复制单条数据完成，行号为 ${rowTo + 1}` })
  },
  async insertRowData(obj = {}) {
    // 新增行
    let self = this
    return new Promise((resolve, reject) => {
      const { data, rowIndexTo } = obj
      let rowTo = rowIndexTo === undefined ? -1 : rowIndexTo
      let dataObj = Object.assign({}, data === undefined ? {} : data, {
        insertMark: '新数据',
        date: new Date().format('YYYY-MM-DD hh:mm:ss:c'),
        isNew: true,
        _XID: ''
      })
      self.$refs.xGrid.insertAt(dataObj, rowTo).then(({ row }) => {
        self.$refs.xGrid.setCurrentRow(row).then(() => {
          self.$refs.xGrid.setActiveCell(row).then(() => {
            self.$refs.xGrid.validate(row).then(() => {
              resolve({ tableData: self.getTableData, row: row }, self)
            }).catch(errMap => {
              console.log('validate', errMap)
              resolve({ tableData: self.getTableData, row: row, errMap: errMap }, self)
            })
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
    // await this.$refs.xGrid.fullValidate(row).catch(errMap => {
    //   console.log('fullValidate', errMap)
    //   return errMap
    // })
    // this.$XModal.message({ message: `复制单条数据完成，行号为 ${rowTo + 1}` })
  },
  reLoadTable() {
    let self = this
    let xGrid = this.$refs.xGrid
    this.initTable()
    // xGrid.reloadData(xGrid.getTableData().fullData)
    xGrid.reloadColumn(self.initTableConlums())
    xGrid.reloadData(self.initTableData()).then().catch()
  },
  reLoadTableData() {
    let xGrid = this.$refs.xGrid
    // xGrid.reloadData(xGrid.getTableData().fullData)
    xGrid.reloadData(this.initTableData()).then().catch()
  },
  refreshTable(data) {
    // 重新加载所有
    if (data) {
      // 重新加载数据刷新视图 调整 即将废弃
      let xGrid = this.$refs.xGrid
      // xGrid.reloadData(xGrid.getTableData().fullData)
      xGrid.reloadData(data || this.tableDataIn).then().catch()
    } else {
      this.initMounted()
      this.ifRenderTable = false
      this.$nextTick(() => {
        this.ifRenderTable = true
      })
    }
  },
  reloadTableConlums(conlums) {
    // 重加载表头
    this.$refs.xGrid.reloadColumn(conlums ? this.generateTableConlums(conlums, this.tableConfigCp.globalConfig) : self.initTableConlums()).then().catch()
  },
  reloadTableRenderData(data = []) {
    // 重加载渲染数据
    let xGrid = this.$refs.xGrid
    xGrid.reloadData(data)
    this.selection = []
    if (xGrid) {
      xGrid.removeCheckboxRow()
    }
  },
  reCalcAndReLoadTableData(data = []) {
    // 重新计算tableData并刷新视图
    let self = this
    return new Promise((resolve, reject) => {
      self.calcTableData(data)
      self.updateFooter().then(() => {
        resolve(self.getTableData())
      }).catch((e) => {
        reject(e)
      })
    })
  },
  clearDataRenderField(data) {
    // 删除viewSort字段
    let self = this
    return data.map((item, index) => {
      let itemN = Object.assign({}, item)
      Object.keys(itemN).forEach((key, ki) => {
        if (key.indexOf('__viewSort') >= 0 || key.indexOf('__sort') >= 0) {
          delete itemN[key]
        }
        if (Array.isArray(itemN.children) && itemN.children.length) {
          itemN.children = self.clearDataRenderField(itemN.children)
        }
      })
      return itemN
    })
  },
  getTableData() {
    // 获取表格数据
    const listData = this.getListData()
    const insertRecords = this.$refs.xGrid.getInsertRecords()
    const updateRecords = this.$refs.xGrid.getUpdateRecords()
    const removeRecords = this.$refs.xGrid.getRemoveRecords()
    const { keepSource, tableSourceData } = this.$refs.xGrid.$refs.xTable
    const { fullData, visibleData, tableData, footerData } = this.$refs.xGrid.getTableData()
    const selection = this.$refs.xGrid.getCheckboxRecords()
    const { tableColumnsConfig, editRules } = this
    return { keepSource, tableSourceData, fullData, visibleData, tableData, footerData, tableColumnsConfig, selection, editRules, listData, insertRecords, removeRecords, updateRecords }
  },
  getPureTableData() {
    // 获取表格纯净数据
    const listData = this.getListData()
    const insertRecords = this.$refs.xGrid.getInsertRecords()
    const updateRecords = this.$refs.xGrid.getUpdateRecords()
    const removeRecords = this.$refs.xGrid.getRemoveRecords()
    const { keepSource, tableSourceData } = this.$refs.xGrid.$refs.xTable
    const { fullData, visibleData, tableData, footerData } = this.$refs.xGrid.getTableData()
    const selection = this.$refs.xGrid.getCheckboxRecords()
    const { tableColumnsConfig, editRules } = this
    return { keepSource, tableSourceData: this.clearDataRenderField(tableSourceData), fullData: this.clearDataRenderField(fullData), visibleData: this.clearDataRenderField(visibleData), tableData: this.clearDataRenderField(tableData), footerData, tableColumnsConfig, selection: this.clearDataRenderField(selection), editRules, listData: this.clearDataRenderField(listData), insertRecords: this.clearDataRenderField(insertRecords), updateRecords: this.clearDataRenderField(updateRecords), removeRecords: this.clearDataRenderField(removeRecords) }
  },
  getOptionData() {
    // 获取当前操作数据
    return this.$refs.xGrid.getRecordset()
  },
  getInsertRowData() {
    // 获取新增行
    return this.$refs.xGrid.getInsertRecords()
    // this.$XModal.alert(insertRecords.length)
  },
  getSelectionData() {
    // 获取选中
    return this.$refs.xGrid.getCheckboxRecords()
    // this.$XModal.alert(selectRecords.length)
  },
  getData(rowIndex = []) {
    return this.$refs.xGrid.getData(rowIndex)
  },
  validate(row = true) {
    return this.$refs.xGrid.validate(row)
  },
  async validEvent(row = true) {
    // 校验
    const errMap = await this.$refs.xGrid.validate(row).catch(errMap => errMap)
    if (errMap) {
      this.$XModal.message({ status: 'error', message: '校验不通过！' })
    } else {
      this.$XModal.message({ status: 'success', message: '校验成功！' })
    }
  },
  async fullValidEvent(row = true) {
    // 所有校验
    const errMap = await this.$refs.xGrid.fullValidate(row).catch(errMap => errMap)
    if (errMap) {
      let msgList = []
      Object.values(errMap).forEach(errList => {
        errList.forEach(params => {
          let { rowIndex, column, rules } = params
          rules.forEach(rule => {
            msgList.push(`第 ${rowIndex} 行 ${column.title} 校验错误：${rule.message}`)
          })
        })
      })
      this.$XModal.message({
        status: 'error',
        message: () => {
          return [
            <div class="red" style="max-height: 400px;overflow: auto;">
              {
                msgList.map(msg => <div>{ msg }</div>)
              }
            </div>
          ]
        }
      })
    } else {
      this.$XModal.message({ status: 'success', message: '校验成功！' })
    }
  },
  async selectValidEvent() {
    // 选中校验
    let selectRecords = this.$refs.xGrid.getCheckboxRecords()
    if (selectRecords.length > 0) {
      const errMap = await this.$refs.xGrid.validate(selectRecords).catch(errMap => errMap)
      if (errMap) {
        this.$XModal.message({ status: 'error', message: '校验不通过！' })
        return false
      } else {
        this.$XModal.message({ status: 'success', message: '校验成功！' })
        return true
      }
    } else {
      this.$XModal.message({ status: 'warning', message: '未选中数据！' })
    }
  },
  insertEvent(row, column) {
    // 插入数据
    let xTable = this.$refs.xTable
    xTable.insertAt(null, row)
      .then(({ row }) => xTable.setActiveCell(row, column.property))
  }
}
const tableEventFn = {
  setColumnDrop() {
    let Sortable = this.$Sortable
    this.$nextTick(() => {
      let xTable = this.$refs.xGrid
      this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
        handle: '.vxe-header--column:not(.col--expand)',
        onEnd: ({ newIndex, oldIndex }) => {
          let tableColumn = xTable.getColumns()
          let currRow = tableColumn.splice(oldIndex, 1)[0]
          tableColumn.splice(newIndex, 0, currRow)
          xTable.loadColumn(tableColumn)
        }
      })
    })
  },
  onContextMenuClick({ menu, row, column, columnIndex, rowIndex }, event) { // 右键菜单
    event = event || window.event
    let self = this
    let xGrid = this.$refs.xGrid
    switch (menu.code) {
      case 'hideColumn':// 隐藏当前列
        xGrid.hideColumn(column)
        break
      case 'showAllColumn': // 显示所有列
        xGrid.resetColumn()
        break
      case 'recover_all': // 显示所有列
        self.reloadTableConlums(self.tableColumnsConfig)
        break
      case 'resetColumn': // 重新加载
        xGrid.resetColumn({ visible: true, resizable: true })
        break
      case 'toggleAllCheckboxRow': // 重新加载
        xGrid.toggleAllCheckboxRow()
        break
      case 'reload': // 重新加载
        break
      case 'insertAt': // 插入数据
        self.insertRowData({})
        break
      case 'remove': // 移除数据
        xGrid.remove(row)
        break
      case 'clear': // 清除单元格数据
        xGrid.clearData(row, column.property)
        break
      case 'verify': // 校验并定位到第一个错误
        // this.validate().catch(errMap => console.log(errMap))
        this.validEvent()
        break
      case 'maximize': // 表格最大化
        xGrid.maximize()
        break
      case 'revert': // 表格还原
        self.revertEvent()
        break
      case 'zoom': // 切换表格最大化
        xGrid.zoom()
        break
      // case 'copy': // 复制文本
      //   if (self.$XEClipboard.copy(row[column.property])) {
      //     self.$XModal.message({ message: '已复制到剪贴板！', status: 'success' })
      //   }
      //   break
      // case 'paste': // 复制文本
      //   debugger
      //   let clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
      //   debugger
      //   row[column.property] = clipboardData
      //   break
      //  case 'save':
      //  self.$XModal.message({ message: '保存成功', status: 'success' })
      //  break
      case 'exportDataXlsx':
        console.log('this.$Export', this, this.$Export)
        this.triggerExportOption()
        // this.$Export.exportExcel({
        //   columns: this.tableColumnsConfig,
        //   datas: this.getTableData().fullData
        // })
        // xGrid.openExport({
        //   filename: 'export',
        //   sheetName: 'Sheet1',
        //   type: 'xlsx',
        //   isPrint: true
        // })
        break
      case 'print':
        xGrid.print({
          filename: 'printData',
          mode: 'current',
          isHeader: true,
          isFooter: true
        })
        break
      case 'logCurrentData':
        console.log(row[column.property], row, column, columnIndex, rowIndex)
        console.log(this.getTableData())
        break
      case 'exportDataPdf':
        xGrid.exportData({
          filename: '导出',
          type: 'pdf'
        })
        break
      case 'clearSort':
        xGrid.clearSort()
        break
      case 'sortAsc':
        xGrid.sort(column.property, 'asc')
        break
      case 'sortDesc':
        xGrid.sort(column.property, 'desc')
        break
    }
    return false
  },
  triggerReverseCheck() {
    // 反选
    let self = this
    let xGrid = self.$refs.xGrid
    return new Promise((resolve, reject) => {
      // let selectionNew = []
      let selection = xGrid.getCheckboxRecords()
      let { tableData } = xGrid.getTableData()
      // tableData.forEach((row, rowIndex) => {
      //   if (!selection.some((item, index) => {
      //     return row._XID === item._XID
      //   })) {
      //     selectionNew.push(row)
      //   }
      // })
      // xGrid.clearCheckboxRow().then(() => {
      xGrid.setCheckboxRow(tableData, true).then(() => {
        xGrid.setCheckboxRow(selection, false).then(() => {
          self.selection = xGrid.getCheckboxRecords()
          resolve(self.selection)
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
      // }).catch(e => {
      //   reject(e)
      // })
    })
  },
  handleCheckboxChange(obj, e) {
    // 多选选中或去选某一条事件
    this.selection = obj.records
    this.updateFooter().then(() => {
      this.$emit('checkboxChange', obj, e)
      this.$emit('ProxyEvent', 'checkboxChange', obj, this, this.$refs.xGrid)
    }).catch(() => { })
  },
  handleCheckboxAllChange(obj, e) {
    // 全选选中或去选某一条事件
    this.selection = obj.records
    this.updateFooter().then(() => {
      this.$emit('checkboxAll', obj, e)
      this.$emit('ProxyEvent', 'checkboxAll', obj, this, this.$refs.xGrid)
    }).catch(() => {})
  },
  onOptionRowClick(obj) {
    // 操作列点击事件
    this.$emit('onOptionRowClick', obj, this)
    this.$emit('ProxyEvent', 'onOptionRowClick', obj, this, this.$refs.xGrid)
    let methods = this.tableConfigCp.methods
    typeof (methods.onOptionRowClick) === 'function' && methods.onOptionRowClick(obj, this)
  },
  onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType }) {
    switch (optionType) {
      case 'upSort':
        if ($rowIndex > 0) {
          let temp = data[$rowIndex - 1]
          data[$rowIndex - 1] = data[$rowIndex]
          data[$rowIndex] = temp
          // [data[$rowIndex - 1]], data[$rowIndex]] = [data[$rowIndex], data[$rowIndex-1]] ts
        }
        break
      case 'downSort':
        if ($rowIndex < data.length - 1) {
          let temp = data[$rowIndex + 1]
          data[$rowIndex + 1] = data[$rowIndex]
          data[$rowIndex] = temp
          // [data[$rowIndex + 1]], data[$rowIndex]] = [data[$rowIndex], data[$rowIndex + 1]] ts
        }
        break
      case 'topSort':
        if ($rowIndex > 0) {
          data.unshift(data.splice($rowIndex, 1)[0])
        }
        break
      case 'bottomSort':
        if ($rowIndex < data.length - 1) {
          data.push(data.splice($rowIndex, 1)[0])
        }
        break
      default:
        break
    }
    this.$refs.xGrid.reloadData(data).then().catch()
  }
}
const toolBarEvent = {
  toolbarButtonClickEvent(obj, e) { // toolbar事件代理
    // 工具栏左侧按钮点击事件
    let self = this
    self.$emit('onToolbarBtnClick', obj, this)
    let methods = this.tableConfigCp.methods
    if (typeof (obj.button.callback) === 'function') {
      obj.button.callback(obj, self, e)
    } else {
      typeof (methods.toolbarButtonClickEvent) === 'function' && methods.toolbarButtonClickEvent(obj, self, e)
    }
  },
  onToolbarOperrateClick(code) {
    let self = this
    switch (code) {
      case 'reverseCheck':
        this.triggerReverseCheck().then(() => {
        }).catch(e => {
          console.log(e)
          throw (e)
        })
        break
      case 'refresh':
        this.$emit('onToolbarBtnClick', { context: this, xGrid: this.$refs.xGrid, code: 'refresh' })
        // this.reloadTableConlums(this.tableColumnsConfig)
        // this.refreshTable()
        break
      case 'calculator':
        this.$XModal.message({ status: 'info', message: '此功能正在开发中' })
        break
      case 'zoom':
        this.$refs.xGrid.zoom().then(() => { }).catch(() => {})
        break
      case 'export':
        this.triggerExportOption()
        break
      case 'custom':
        break
      case 'import':
        this.triggerImportOption(
          {
            downloadTemplateCallback(Cb) {
              self.downLoadImportTemplate()
            },
            importSuccessCallback(res) {
              console.log('当前导入数据', res)
            }
          }
        )
        break
    }
  },
  setMoneyUnit(Unitlevel, oldUnitlevel) {
    // 设置金额单位
    let xGrid = this.$refs.xGrid
    if (!xGrid) {
      return
    }
    xGrid.$forceUpdate()
    xGrid.updateFooter().then(() => {}).catch(() => {})
  }
}
const pageEvent = { // 分页事件
  setPagerConfig() {
    // 更新分页配置
    if (this.getbasicDataType(this.pagerConfig) === 'Boolean') {
      this.pagerConfigIn = undefined
    } else {
      this.pagerConfigIn = Object.assign({}, this.pagerConfigIn ? this.pagerConfigIn : this.pagerConfigInCp, this.pagerConfig)
    }
  },
  handlePageChange({ currentPage, pageSize }) {
    // 分页改变事件
    this.pagerConfigIn.currentPage = currentPage
    this.pagerConfigIn.pageSize = pageSize
    this.loadData()
  },
  handleRefresh() {
    // 刷新
    this.formSearchSubmit({ data: {} })
  },
  getColumnsList() {
    let newColumnsList = []
    this.tableColumnsConfig.forEach(v => {
      newColumnsList.push(v.field)
    })
    return newColumnsList
  },
  delSearchfromMain() {
    // 父组件调用此方法清空查询数据
    this.formSearchData.filterValue = ''
  },
  formSearchSubmit({ data, $event }) {
    let newTbleDatas = []
    // this.formSearchData.filterValue
    let search = this.formSearchData.filterValue
    if (search !== '') {
      console.log('this.tableDataIn', this.tableData)
      this.tableDataIn.forEach(dataNews => {
        let newColumnsList = this.tableColumnsFieldArr
        console.log(newColumnsList)
        for (let i = 0; i < Object.keys(dataNews).length; i++) {
          if (newColumnsList.includes(Object.keys(dataNews)[i]) && String(dataNews[Object.keys(dataNews)[i]]).indexOf(search) > -1) {
            newTbleDatas.push(dataNews)
            break
          }
        }
      })
      this.reloadTableRenderData(newTbleDatas)
    } else {
      this.reloadTableRenderData(this.tableDataIn)
    }
  },
  loadData() {
    // 加载数据
    let self = this
    let searchParams = {
      params: this.formSearchData,
      currentPage: this.pagerConfigIn.currentPage,
      pageSize: this.pagerConfigIn.pageSize
    }
    self.$emit('ajaxData', searchParams, this)
  },
  onAdvancedSearchBtnClick() {
    this.$emit('onAdvancedSearchBtnClick', {
      params: this.formSearchData,
      currentPage: this.pagerConfigIn.currentPage,
      pageSize: this.pagerConfigIn.pageSize
    }, this)
  }
}
const proxyFn = {
  // resgistEventProxy() {
  // let arg=[...arguments]
  //   // 注册事件代理
  //   let self = this
  //   Object.keys(self.tableEventIn).forEach((item, index) => {
  //     self.$on(self.hyphenate(item), self.tableEventIn[item].bind(self))
  //   })
  // }
  handleSearch() {
    const filterName = this.$XEUtils.toString(this.filterName).trim().toLowerCase()
    if (filterName) {
      const filterRE = new RegExp(filterName, 'gi')
      const options = { children: 'list' }
      const searchProps = ['name', 'desc', 'type', 'enum', 'defVal']
      const rest = this.$XEUtils.searchTree(this.tableData, item => searchProps.some(key => item[key].toLowerCase().indexOf(filterName) > -1), options)
      this.$XEUtils.eachTree(rest, item => {
        searchProps.forEach(key => {
          item[key] = item[key].replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
        })
      }, options)
      this.apiList = rest
      this.$nextTick(() => {
        if (this.$refs.xTable) {
          this.$refs.xTable.setAllTreeExpand(true)
        }
      })
    } else {
      this.apiList = this.tableData
      this.$nextTick(() => {
        if (this.$refs.xTable) {
          this.$refs.xTable.setTreeExpand(this.defaultExpandRows, true)
        }
      })
    }
  },
  // 调用频率间隔 500 毫秒
  searchEvent() {
    this.$XEUtils.debounce(function () {
      this.handleSearch()
    }, 500, { leading: false, trailing: true })
  }
}
const axiosEvent = {
  async $asyncGet(url, params, cb) { // 使用异步调用，返回结果后再执行
    await this.$http.get(url, params, origin)
  },
  async $asyncPost(url, params, cb) { // 使用异步调用，返回结果后再执行
    await this.$http.post(url, params, origin)
  },
  $post(url, params, origin) {
    let self = this
    return new Promise((resolve, reject) => {
      self.$http.post(url, {
        params: params
      })
        .then(response => {
          if (response.code === 200) {
            resolve(response.data)
          } else {
            resolve([])
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  $get(url, params, origin) {
    let self = this
    return new Promise((resolve, reject) => {
      self.$http.get(url, {
        params: params
      })
        .then(response => {
          if (response.code === 200) {
            resolve(response.data)
          } else {
            resolve([])
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
const tableEvent = {
  cellOptionCallBack() { // 渲染器回调事件
    this.$emit('cellOptionCallBack', ...arguments, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'cellOptionCallBack', ...arguments, this, this.$refs.xGrid)
  },
  // cellChange() { // 渲染器回调事件
  //   this.$emit('cellChange', ...arguments, this, this.$refs.xGrid)
  // },
  keydown(obj) {
    // 添加enter 切换下一个编辑单元格
    // let self = this
    // let event = obj.event || window.event
    // const { xGrid } = self.$refs
    // const { row, rowIndex, column } = xGrid.getActiveRecord()
    // if (event.keyCode === 13 && row !== null) {
    //   const { fullData } = self.getTableData()
    //   let indexof = self.tableColumnsSingEditFieldArr.indexOf(column.property)
    //   if (indexof + 1 < self.tableColumnsSingEditFieldArr.length) {
    //     xGrid.setActiveCell(row, self.tableColumnsSingEditFieldArr[indexof + 1])
    //   } else {
    //     xGrid.setCurrentRow(fullData[rowIndex + 1]).then(() => {
    //       xGrid.setActiveCell(fullData[rowIndex + 1], self.tableColumnsSingEditFieldArr[0])
    //     })
    //   }
    // } else {
    this.$emit('keydown', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'keydown', obj, this, this.$refs.xGrid)
    // }
  }, // 当表格被激活且键盘被按下时会触发的事件  { $event }
  radioChange(obj) {
    this.$emit('radioChange', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'radioChange', obj, this, this.$refs.xGrid)
  }, // 只对 type = radio 有效， 当手动勾选并且值发生改变时触发的事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  cellClick(obj) {
    let self = this
    const { xGrid } = this.$refs
    if (this.tableConfigCp.globalConfig.cellClickCheck) {
      // const { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, triggerRadio, triggerCheckbox, triggerTreeNode, triggerExpandNode, $event } = obj
      const { row, $event, column } = obj
      if (column.type !== 'checkbox') {
        if ($event.shiftKey) {
          // option
        } else {
          xGrid.setCheckboxRow([row], !xGrid.isCheckedByCheckboxRow(row)).then(() => {
            self.selection = this.$refs.xGrid.getCheckboxRecords()
            self.updateFooter().then(() => {
              xGrid.setCurrentRow(row).then(() => {

              })
            }).catch(() => {})
          })
        }
      }
    }
    this.$emit('cellClick', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'cellClick', obj, this, this.$refs.xGrid)
  }, // 单元格被点击时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  cellDblclick(obj) {
    const { row, column } = obj
    if (this.treeConfigIn && this.treeConfigIn.dblExpand) {
      if (this.editConfigIn && column.treeNode) {
        if (this.treeConfigIn.dblExpandAll) {
          this.dblRowExpandAll(row)
        } else {
          this.tableOptionFn().toggleTreeExpand(row).then(() => {})
        }
      } else if (!this.editConfigIn && this.treeConfigIn.onlyDblTreeNodeExpand && column.treeNode) {
        if (this.treeConfigIn.dblExpandAll) {
          this.dblRowExpandAll(row)
        } else {
          this.tableOptionFn().toggleTreeExpand(row).then(() => {})
        }
      } else if (!this.editConfigIn) {
        if (this.treeConfigIn.dblExpandAll) {
          this.dblRowExpandAll(row)
        } else {
          this.tableOptionFn().toggleTreeExpand(row).then(() => {})
        }
      } else {

      }
    } else {
      this.$emit('cellDblclick', obj, this, this.$refs.xGrid)
      this.$emit('ProxyEvent', 'cellDblclick', obj, this, this.$refs.xGrid)
    }
  }, // 单元格被双击时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  dblRowExpandAll(row) {
    let self = this
    self.tableOptionFn().toggleTreeExpand(row).then((res) => {
      if (Array.isArray(row[this.treeConfigIn.children]) && row[this.treeConfigIn.children].length) {
        row[this.treeConfigIn.children].forEach((item, index) => {
          self.dblRowExpandAll(item)
        })
      }
    })
  },
  cellContextMenu(obj) {
    this.$emit('cellContextMenu', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'cellContextMenu', obj, this, this.$refs.xGrid)
  }, // 只对 context - menu 配置时有效， 单元格被鼠标右键时触发该事件 { type, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  cellMouseenter(obj) {
    this.$emit('cellMouseenter', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'cellMouseenter', obj, this, this.$refs.xGrid)
  }, // 当单元格 hover 进入时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  cellMouseleave(obj) {
    this.$emit('cellMouseleave', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'cellMouseleave', obj, this, this.$refs.xGrid)
  }, // 当单元格 hover 退出时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  headerCellClick(obj) {
    this.$emit('headerCellClick', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'headerCellClick', obj, this, this.$refs.xGrid)
  }, // 表头单元格被点击时会触发该事件 { $rowIndex, column, columnIndex, $columnIndex, triggerResizable, triggerSort, triggerFilter, $event }
  headerCellDblclick(obj) {
    this.$emit('headerCellDblclick', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'headerCellDblclick', obj, this, this.$refs.xGrid)
  }, // 表头单元格被双击时会触发该事件 { $rowIndex, column, columnIndex, $columnIndex, $event }
  // headerCellContextMenu(obj) {
  //   this.$emit('headerCellContextMenu', obj, this, this.$refs.xGrid)
  // }, // 只对 context-menu 配置时有效，表头单元格被鼠标右键时触发该事件 { type, column, columnIndex, $event }
  footerCellClick(obj) {
    this.$emit('footerCellClick', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'footerCellClick', obj, this, this.$refs.xGrid)
  }, // 表尾单元格被点击时会触发该事件 // { items, $rowIndex, column, columnIndex, $columnIndex, $event }
  footerCellDblclick(obj) {
    this.$emit('footerCellDblclick', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'footerCellDblclick', obj, this, this.$refs.xGrid)
  }, // 表尾单元格被双击时会触发该事件 { items, $rowIndex, column, columnIndex, $columnIndex, $event }
  footerCellContextMenu(obj) {
    this.$emit('footerCellContextMenu', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'footerCellContextMenu', obj, this, this.$refs.xGrid)
  }, // 只对 context - menu 配置时有效， 表尾单元格被鼠标右键时触发该事件 { type, column, columnIndex, $event }
  sortChange(obj) {
    this.$emit('sortChange', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'sortChange', obj, this, this.$refs.xGrid)
  }, // 当排序条件发生变化时会触发该事件 { column, column.property, order, $event }
  filterChange(obj) {
    this.$emit('filterChange', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'filterChange', obj, this, this.$refs.xGrid)
  }, // 当筛选条件发生变化时会触发该事件 { column, property, values, datas, filters, $event }{ column, property, values, datas, filters, $event }
  resizableChange(obj) {
    this.$emit('resizableChange', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'resizableChange', obj, this, this.$refs.xGrid)
  }, // 当列宽拖动发生变化时会触发该事件 { $rowIndex, column, columnIndex, $columnIndex, $event }
  toggleRowExpand(obj) {
    this.$emit('toggleRowExpand', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'toggleRowExpand', obj, this, this.$refs.xGrid)
  }, // 当行展开或收起时会触发该事件 { expanded, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  toggleTreeExpand(obj) {
    this.$emit('toggleTreeExpand', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'toggleTreeExpand', obj, this, this.$refs.xGrid)
  }, // 当树节点展开或收起时会触发该事件 { expanded, row, column, columnIndex, $columnIndex, $event }
  contextMenuClick(obj) {
    this.$emit('contextMenuClick', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'contextMenuClick', obj, this, this.$refs.xGrid)
  }, // 只对 context-menu 配置时有效，当点击快捷菜单时会触发该事件 { menu, type, row, rowIndex, column, columnIndex, $event }
  currentChange(obj) {
    // this.performTableDataCalculate(obj)
    this.$nextTick(() => {
      this.$emit('currentChange', obj, this, this.$refs.xGrid)
      this.$emit('ProxyEvent', 'currentChange', obj, this, this.$refs.xGrid)
    })
  }, // 只对 highlightCurrentRow 有效，当手动选中行并且值发生改变时触发的事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  editClosed(obj) {
    this.performTableDataCalculate(obj).then((row) => {
      this.$emit('editClosed', Object.assign(obj, { row: row }), this, this.$refs.xGrid)
      this.$emit('ProxyEvent', 'editClosed', obj, this, this.$refs.xGrid)
    })
  }, // 只对 edit-config 配置时有效，单元格编辑状态下被关闭时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }
  editActived(obj) {
    this.$emit('editActived', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'editActived', obj, this, this.$refs.xGrid)
  }, // 只对 edit-config 配置时有效，单元格被激活编辑时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }
  editDisabled(obj) {
    this.$emit('editDisabled', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'editDisabled', obj, this, this.$refs.xGrid)
  }, // 只对 edit-config 配置时有效，当单元格激活时如果是禁用状态时会触发该事件 { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }
  validError(obj) {
    this.$emit('validError', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'validError', obj, this, this.$refs.xGrid)
  }, // 只对 edit-rules 配置时有效，当数据校验不通过时会触发该事件 { rule, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }
  scroll(obj) {
    this.$emit('scroll', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'scroll', obj, this, this.$refs.xGrid)
  }, // 表格滚动时会触发该事件 { type, scrollTop, scrollLeft, isX, isY, $event }
  custom(obj) {
    this.$emit('custom', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'custom', obj, this, this.$refs.xGrid)
  },
  formSubmitInvalid(obj) {
    this.$emit('formSubmitInvalid', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'formSubmitInvalid', obj, this, this.$refs.xGrid)
  }, // 只对 form-config 配置时有效，表单提交时如果校验不通过会触发该事件 { data, errMap, $event }
  formReset(obj) {
    this.$emit('formReset', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'formReset', obj, this, this.$refs.xGrid)
  }, // 只对 form-config 配置时有效，表单重置时会触发该事件 { data, $event }
  formToggleCollapse(obj) {
    this.$emit('formToggleCollapse', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'formToggleCollapse', obj, this, this.$refs.xGrid)
  }, // 只对 form-config 配置时有效，当折叠按钮被手动点击时会触发该事件 { collapse, data, $event }
  zoom(obj) {
    this.$emit('zoom', obj, this, this.$refs.xGrid)
    this.$emit('ProxyEvent', 'zoom', obj, this, this.$refs.xGrid)
  } // 当最大化或还原操作被手动点击时会后触发该事件 { type, $event }
  // checkboxChange(obj) {
  //   this.$emit('checkboxChange', obj,  this, this.$refs.xGrid)
  // } // 只对 type=checkbox 有效，当手动勾选并且值发生改变时触发的事件 { records, reserves, indeterminates, checked, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }
  //  checkboxAll(obj) {
  //    this.$emit('checkboxAll', obj,  this, this.$refs.xGrid)
  //  }, // 只对 type=checkbox 有效，当手动勾选全选时触发的事件 { records, reserves, indeterminates, checked, $event }
  // 如果与工具栏关联， 在自定义列按钮被手动点击后会触发该事件 { type, $event }
  // pageChange(obj) {
  //      this.$emit('pageChange', obj,  this, this.$refs.xGrid)
  // }, // 只对 pager-config 配置时有效，分页发生改变时会触发该事件 { type, currentPage, pageSize, $event }
  // formSubmit (obj) {
  //   this.$emit('formSubmit', obj,  this, this.$refs.xGrid)
  // }, // 只对 form-config 配置时有效，表单提交时会触发该事件 { data, $event }
}
const calculateConstraintTool = {
  addMissingFieldsAndCalcColFormula(tableData) {
    // 添加缺失字段并执行全量列计算
    let self = this
    tableData = Array.isArray(tableData) ? tableData : []
    tableData.forEach((row) => {
      self.tableColumnsFieldArr.forEach((item) => {
        // 遍历配置项生成的前缀数组，并且其前缀在数据包中不存在时，动态给其绑定一个前缀
        row[item] = (typeof (row[item]) !== 'object' && self.getbasicDataType(row[item]) === 'Null') ? (row[item] + '').replace(/null|NaN|undefined/ig, '') : row[item]
      })
      row = this.reductionColFormula(this.calculateConstraintConfigIn.colFormulaConfig, row)
      if (Array.isArray(row.children) && row.children.length && this.treeConfigIn) {
        row.children = self.addMissingFieldsAndCalcColFormula(row.children)
      }
    })
    self.reductionRowCodeFormula(this.calculateConstraintConfigIn.rowCodeFormulaConfig, tableData, self.id)
    return tableData
  },
  calcRowTableData(data = []) {
    // 计算单行数据
    let self = this
    data.forEach((row) => {
      row = self.reductionColFormula(self.calculateConstraintConfigIn.colFormulaConfig, row)
      if (Array.isArray(row.children) && row.children.length && this.treeConfigIn) {
        row.children = self.calcRowTableData(row.children)
      }
    })
  },
  calcTableData(data = []) {
    // 计算tableData
    let self = this
    self.calcRowTableData(data)
    self.reductionRowFormula(self.calculateConstraintConfigIn.rowformulaConfig, data, self.id)
    self.reductionRowCodeFormula(self.calculateConstraintConfigIn.rowCodeFormulaConfig, data, self.id)
    self.reloadTableRenderData(data)
    return data
  },
  reductionColFormula(colFormulaMap, row) {
    // 单条数据计算
    // rowFormulaMap= { "colfield":"{colfield}[运算符]" }
    let colFormulaMapCp = this.deepCopy(colFormulaMap)
    let hasCalcColFormulaMap = {}
    let i = 0
    let ifDoWhile = true
    try {
      while (ifDoWhile) {
        let colFormulaMapArr = Object.keys(colFormulaMapCp)
        if (colFormulaMapArr.length) {
          for (let cmai = 0; cmai < colFormulaMapArr.length; cmai++) {
            i++
            let item = colFormulaMapArr[cmai]
            let formula = colFormulaMapCp[item]
            let regR = new RegExp('({[a-zA-Z0-9_]*})', 'ig')
            let rowsKey = formula.match(regR) === null ? [] : formula.match(regR)
            if (rowsKey.length) {
              for (let keyCF in rowsKey) {
                let keyC = rowsKey[keyCF].replace(/\{|\}/g, '')
                let reg = new RegExp('({' + keyC + '})', 'ig')
                if (row[keyC] !== undefined && !(hasCalcColFormulaMap[keyC] || colFormulaMapCp[keyC])) {
                  colFormulaMapCp[item] = formula.replace(reg, isNaN(parseFloat(row[keyC])) ? 0 : parseFloat(row[keyC]))
                } else if (hasCalcColFormulaMap[keyC]) {
                  colFormulaMapCp[item] = formula.replace(reg, hasCalcColFormulaMap[keyC])
                } else if (!colFormulaMapCp[keyC]) {
                  colFormulaMapCp[item] = formula.replace(reg, 0)
                }
              }
            } else {
              let calcResult = eval(formula)
              hasCalcColFormulaMap[item] = calcResult === Infinity || calcResult === -Infinity || isNaN(calcResult) ? '' : calcResult.toFixed(2)
              delete colFormulaMapCp[item]
            }
          }
        } else {
          ifDoWhile = false
        }
        if (i === 100000) {
          console.log(colFormulaMap, hasCalcColFormulaMap)
          throw (new Error('请检查公式'))
        }
      }
    } catch (e) {
      // console.log(i)
      console.log(colFormulaMap, hasCalcColFormulaMap)
      throw (new Error('请检查公式'))
    }
    // console.log(hasCalcColFormulaMap)
    return Object.assign(row, hasCalcColFormulaMap)
  },
  reductionRowFormula(rowFormulaMap, data, tableId) {
    // 单元格交叉计算
    // rowFormulaMap= { "colField:rowIndex":"{tableId:colField:rowIndex}[运算符]" }
    let rowFormulaMapCp = this.deepCopy(rowFormulaMap)
    let hasCalcrowFormulaMap = {}
    let i = 0
    let ifDoWhile = true
    try {
      while (ifDoWhile) {
        let rowFormulaMapArr = Object.keys(rowFormulaMapCp)
        if (rowFormulaMapArr.length) {
          for (let cmai = 0; cmai < rowFormulaMapArr.length; cmai++) {
            i++
            let item = rowFormulaMapArr[cmai]
            let formula = rowFormulaMapCp[item]
            let regR = new RegExp('({[a-zA-Z0-9_:]*})', 'ig')
            let rowsKey = formula.match(regR) === null ? [] : formula.match(regR)
            if (rowsKey.length) {
              for (let keyCF in rowsKey) {
                let formulaArr = rowsKey[keyCF].replace(/\{|\}/g, '').split(':')
                let reg = new RegExp('({' + formulaArr.join(':') + '})', 'ig')
                if (formulaArr[0] === tableId) {
                  if (data[formulaArr[2]] && data[formulaArr[2]][formulaArr[1]] !== undefined && !(hasCalcrowFormulaMap[formulaArr[1] + ':' + formulaArr[2]] || rowFormulaMapCp[formulaArr[1] + ':' + formulaArr[2]])) {
                    rowFormulaMapCp[item] = formula.replace(reg, isNaN(parseFloat(data[formulaArr[2]][formulaArr[1]])) ? 0 : parseFloat(data[formulaArr[2]][formulaArr[1]]))
                  } else if (hasCalcrowFormulaMap[formulaArr[1] + ':' + formulaArr[2]]) {
                    rowFormulaMapCp[item] = formula.replace(reg, hasCalcrowFormulaMap[formulaArr[1] + ':' + formulaArr[2]])
                  } else if (!rowFormulaMapCp[formulaArr[1] + ':' + formulaArr[2]]) {
                    rowFormulaMapCp[item] = formula.replace(reg, 0)
                  }
                } else {
                  rowFormulaMapCp[item] = formula.replace(reg, 0)
                }
              }
            } else {
              let calcResult = eval(formula)
              hasCalcrowFormulaMap[item] = calcResult === Infinity || calcResult === -Infinity || isNaN(calcResult) ? '' : calcResult.toFixed(2)
              delete rowFormulaMapCp[item]
            }
          }
        } else {
          ifDoWhile = false
        }
        if (i === 1000000) {
          console.log(rowFormulaMap, hasCalcrowFormulaMap)
          throw (new Error('请检查公式'))
        }
      }
    } catch (e) {
      console.log(rowFormulaMap, hasCalcrowFormulaMap)
      throw (new Error('请检查公式'))
    }
    Object.keys(hasCalcrowFormulaMap).forEach((item, index) => {
      let rowCellArr = item.split(':')
      if (data[rowCellArr[1]]) {
        data[rowCellArr[1]][rowCellArr[0]] = hasCalcrowFormulaMap[item] === '0.00' ? '' : hasCalcrowFormulaMap[item]
      }
    })
    return data
  },
  reverDataCodeRowMap(data, codeKey, obj) {
    // 递归生成数据code映射
    let self = this
    obj = obj || {
      dataCodeRowMap: {}
    }
    data.forEach((item, index) => {
      if (Array.isArray(item.children) && item.children.length) {
        self.reverDataCodeRowMap(item.children, codeKey, obj)
      } else {
        if (obj.dataCodeRowMap[item[codeKey]]) {
          obj.dataCodeRowMap[item[codeKey]].push(item)
        } else {
          obj.dataCodeRowMap[item[codeKey]] = [item]
        }
      }
    })
    return obj
  },
  reverCalcRowCodeFormula(reverCalcRowCodeFormula, data, tableId) {
    // 递归进行单元格交叉依赖计算
    let self = this
    Object.keys(reverCalcRowCodeFormula).map((item, index) => {
      return {
        itemcode: item.split(':')[1],
        property: item.split(':')[0]
      }
    }).forEach((item, id) => {
      let formColCalList = self.getFormColCalBack(self.id + item.property + item.itemcode)
      if (Object.keys(formColCalList).length) {
        self.reductionRowCodeFormula(formColCalList, self.$refs.xGrid.getTableData().fullData, self.id)
      }
    })
  },
  getDataCodeRowMapCumulativeResult(dataCodeRowMap, field) {
    // 获取重复itemcode的计算结果
    let result = 0
    dataCodeRowMap.forEach((row, rowIndex) => {
      result += isNaN(parseFloat(row[field])) ? 0 : parseFloat(row[field])
    })
    return result
  },
  reductionRowCodeFormula(rowCodeFormulaMap, data, tableId) {
    // 单元格交叉计算根据行 code
    // rowCodeFormulaMap= { "colField:rowCode":"{tableId:colField:rowCode}[运算符]" }
    let self = this
    const { dataCodeRowMap } = this.reverDataCodeRowMap(data, 'itemcode')
    let rowCodeFormulaMapCp = this.deepCopy(rowCodeFormulaMap)
    let hasCalcrowCodeFormulaMap = {}
    let i = 0
    let ifDoWhile = true
    try {
      while (ifDoWhile) {
        let rowCodeFormulaMapArr = Object.keys(rowCodeFormulaMapCp)
        if (rowCodeFormulaMapArr.length) {
          for (let cmai = 0; cmai < rowCodeFormulaMapArr.length; cmai++) {
            i++
            let item = rowCodeFormulaMapArr[cmai]
            let formula = rowCodeFormulaMapCp[item]
            let regR = new RegExp('({[a-zA-Z0-9_:]*})', 'ig')
            let rowsKey = formula.match(regR) === null ? [] : formula.match(regR)
            if (rowsKey.length) {
              for (let keyCF in rowsKey) {
                let formulaArr = rowsKey[keyCF].replace(/\{|\}/g, '').split(':')
                let reg = new RegExp('({' + formulaArr.join(':') + '})', 'ig')
                if (formulaArr[0] === tableId) {
                  if (dataCodeRowMap[formulaArr[2]] && !(hasCalcrowCodeFormulaMap[formulaArr[1] + ':' + formulaArr[2]] || rowCodeFormulaMapCp[formulaArr[1] + ':' + formulaArr[2]])) {
                    rowCodeFormulaMapCp[item] = formula.replace(reg, self.getDataCodeRowMapCumulativeResult(dataCodeRowMap[formulaArr[2]], formulaArr[1]))
                  } else if (hasCalcrowCodeFormulaMap[formulaArr[1] + ':' + formulaArr[2]]) {
                    rowCodeFormulaMapCp[item] = formula.replace(reg, hasCalcrowCodeFormulaMap[formulaArr[1] + ':' + formulaArr[2]])
                  } else if (!rowCodeFormulaMapCp[formulaArr[1] + ':' + formulaArr[2]]) {
                    rowCodeFormulaMapCp[item] = formula.replace(reg, 0)
                  }
                } else {
                  rowCodeFormulaMapCp[item] = formula.replace(reg, 0)
                }
              }
            } else {
              let calcResult = eval(formula)
              hasCalcrowCodeFormulaMap[item] = calcResult === Infinity || calcResult === -Infinity || isNaN(calcResult) ? '' : calcResult.toFixed(2)
              delete rowCodeFormulaMapCp[item]
            }
          }
        } else {
          ifDoWhile = false
        }
        if (i === 1000000) {
          console.log(rowCodeFormulaMap, hasCalcrowCodeFormulaMap)
          throw (new Error('请检查公式'))
        }
      }
    } catch (e) {
      console.log(rowCodeFormulaMap, hasCalcrowCodeFormulaMap)
      throw (e)
    }
    try {
      let rowCodeFormumaMap = self.checkWhetherExcuteColCalculate(this.deepCopy(hasCalcrowCodeFormulaMap))
      for (let itemCode in rowCodeFormumaMap) {
        dataCodeRowMap[itemCode] && dataCodeRowMap[itemCode].forEach((row, rowIndex) => {
          row = Object.assign(row, rowCodeFormumaMap[itemCode].curRowCodeFormulaMap)
          self.reductionColFormula(rowCodeFormumaMap[itemCode].rowCodeFormulaFieldMap, row)
        })
      }
    } catch (e) {
      throw (e)
    }

    // Object.keys(hasCalcrowCodeFormulaMap).forEach((item, index) => {
    //   let rowCellArr = item.split(':')
    //   if (dataCodeRowMap[rowCellArr[1]]) {
    //     dataCodeRowMap[rowCellArr[1]].forEach((row, rowIndex) => {
    //       row[rowCellArr[0]] = hasCalcrowCodeFormulaMap[item] === '0.00' ? '' : hasCalcrowCodeFormulaMap[item]
    //       row = self.reductionColFormula(, row)
    //     })
    //   }
    // })
    // this.reverCalcRowCodeFormula(rowCodeFormulaMap, data, tableId)
    return data
  },
  checkWhetherExcuteColCalculate(hasCalcrowCodeFormulaMap) {
    // 记录当前数据单元格交叉公式计算字段
    let self = this
    let rowCodeFormumaMap = {}
    Object.keys(hasCalcrowCodeFormulaMap).forEach((item, index) => {
      rowCodeFormumaMap[item.split(':')[1]] = {}
    })
    Object.keys(rowCodeFormumaMap).forEach((itemCode, itemCodeIndex) => {
      let rowCodeFormulaFieldMap = Object.assign({}, self.calculateConstraintConfigIn.colFormulaConfig) // 单元格交叉计算
      let curRowCodeFormulaMap = {}
      Object.keys(hasCalcrowCodeFormulaMap).forEach((item, index) => {
        let rowCellArr = item.split(':')
        if (rowCellArr[1] === itemCode) {
          curRowCodeFormulaMap[rowCellArr[0]] = hasCalcrowCodeFormulaMap[item] === '0.00' ? '' : hasCalcrowCodeFormulaMap[item]
          delete rowCodeFormulaFieldMap[rowCellArr[0]]
        }
      })
      rowCodeFormumaMap[itemCode] = {
        rowCodeFormulaFieldMap: Object.assign({}, self.calculateConstraintConfigIn.colFormulaConfig, rowCodeFormulaFieldMap),
        curRowCodeFormulaMap: curRowCodeFormulaMap
      }
    })
    return rowCodeFormumaMap
  },
  riverColumnsGenerateCalcColFormulaMap(columns, obj) {
    // 递归生成列计算全量映射
    let self = this
    obj = obj || {
      tableColumnsFieldMap: {},
      tableColumnsFieldArr: [],
      tableColumnsSingArr: [],
      tableColumnsTitleFieldMap: {},
      colFormulaConfig: {},
      tableColumnsSingEditFieldArr: []
    }
    columns.forEach((conlum, index) => {
      if (Array.isArray(conlum.children) && conlum.children.length) {
        self.riverColumnsGenerateCalcColFormulaMap(conlum.children, obj)
      } else {
        if (conlum.field) {
          obj.tableColumnsFieldMap[conlum.field] = conlum
          obj.tableColumnsFieldArr.push(conlum.field)
          obj.tableColumnsSingArr.push(conlum)
          obj.tableColumnsTitleFieldMap[conlum.title] = conlum.field
          if (conlum.formula) {
            obj.colFormulaConfig[conlum.field] = conlum.formula
          }
          if (conlum.editRender) {
            obj.tableColumnsSingEditFieldArr.push(conlum.field)
          }
        }
      }
    })
    return obj
  },
  generateCalcColFormulaMap(columns) {
    // 生成列计算公式映射
    let self = this
    let obj = this.riverColumnsGenerateCalcColFormulaMap(columns)
    self.tableColumnsFieldMap = obj.tableColumnsFieldMap
    self.tableColumnsFieldArr = obj.tableColumnsFieldArr
    self.tableColumnsSingArr = obj.tableColumnsSingArr
    self.tableColumnsTitleFieldMap = obj.tableColumnsTitleFieldMap
    self.tableColumnsSingEditFieldArr = obj.tableColumnsSingEditFieldArr
    this.calculateConstraintConfigIn = Object.assign({}, this.calculateConstraintConfigIn, {
      colFormulaConfig: obj.colFormulaConfig
    })
  },
  getFormColCalBack(formulaConditions) {
    // 根据单元格位置查询计算的公式
    // let self = this
    let formColCalList = {}
    let rowFormula = this.calculateConstraintConfigIn.rowFormula
    if (rowFormula) {
      Object.keys(rowFormula).forEach((v, index) => {
        if (v === formulaConditions) {
          rowFormula[v].forEach(j => {
            formColCalList = Object.assign(formColCalList, j)
          })
        }
      })
      return formColCalList
    } else {
      return ''
    }
  },
  performTableDataCalculate({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
    // 行改变事件执行单元格计算并刷新视图
    let self = this
    // let formColCalList = this.getFormColCalBack(this.id + column.property + row.itemcode)
    return new Promise((resolve, reject) => {
      row = self.reductionColFormula(self.calculateConstraintConfigIn.colFormulaConfig, row)
      // self.$refs.xGrid.reloadRow([row]).then((rownew) => {
      // if (Object.keys(self.calculateConstraintConfigIn.rowformulaConfig).length) {
      self.reductionRowFormula(self.calculateConstraintConfigIn.rowformulaConfig, self.$refs.xGrid.getTableData().fullData, self.id)
      self.reductionRowCodeFormula(self.calculateConstraintConfigIn.rowCodeFormulaConfig, self.$refs.xGrid.getTableData().fullData, self.id)
      // self.reductionRowCodeFormula(formColCalList, self.$refs.xGrid.getTableData().fullData, self.id)
      // self.$refs.xGrid.reloadData(reloadData).then(
      self.updateFooter().then(() => {
        self.$refs.xGrid.setSelectCell(row, column.property).then(() => {
          resolve(row)
        }).catch()
      }).catch(() => {})
      // ).catch().catch(e => {})
      // } else {
      //   self.updateFooter().then(() => {
      //     // self.$refs.xGrid.setSelectCell(row, column.property).then(() => {
      //     resolve(row)
      //     // }).catch()
      //   }).catch(() => {})
      // }
      // }).catch(e => {})
    })
  },
  generateColumnsAllMap(columns, obj) {
    // 生成导入view映射数据
    let self = this
    obj = obj || {
      tableColumnsFieldMap: {},
      tableColumnsTitleFieldMap: {},
      viewToSourceMap: {},
      colFormulaConfig: {},
      rowsObjTemp: {},
      tableColumnsTitleMap: {}
    }
    columns.forEach((conlum, index) => {
      if (Array.isArray(conlum.children) && conlum.children.length) {
        self.riverColumnsGenerateCalcColFormulaMap(conlum.children, obj)
      } else {
        if (conlum.formula) {
          obj.colFormulaConfig[conlum.field] = conlum.formula
          obj.tableColumnsFieldMap[conlum.title] = conlum
        }
        if (conlum.field) {
          obj.rowsObjTemp[conlum.field] = ''
          let map = {
            needMap: true,
            options: [],
            multiple: false,
            formula: conlum.formula
          }
          obj.tableColumnsFieldMap[conlum.field] = conlum
          obj.tableColumnsTitleFieldMap[conlum.title] = conlum.field
          let itemRender = conlum.cellRender || conlum.editRender || conlum.contentRender
          if (itemRender) {
            switch (itemRender.name) {
              case '$vxeSelect':
                if (itemRender.props && itemRender.props.multiple) {
                  map = Object.assign({}, map, {
                    needMap: true,
                    name: itemRender.name,
                    options: Array.isArray(itemRender.options) ? itemRender.options : [],
                    multiple: true
                  })
                } else {
                  map = Object.assign({}, map, {
                    needMap: true,
                    name: itemRender.name,
                    options: Array.isArray(itemRender.options) ? itemRender.options : [],
                    multiple: false
                  })
                }
                break
              case '$vxeRadio':
                map = Object.assign({}, map, {
                  needMap: true,
                  name: itemRender.name,
                  options: Array.isArray(itemRender.options) ? itemRender.options : [],
                  multiple: false
                })
                break
              case '$vxeCheckbox':
                map = Object.assign({}, map, {
                  needMap: true,
                  name: itemRender.name,
                  options: Array.isArray(itemRender.options) ? itemRender.options : [],
                  multiple: true
                })
                break
              case '$vxeSwitch':
                map = Object.assign({}, map, {
                  needMap: true,
                  name: itemRender.name,
                  options: Array.isArray(itemRender.options) ? itemRender.options : [],
                  multiple: false
                })
                break
              default:
                map = Object.assign({}, map, {
                  needMap: false,
                  // pattern: ((itemRenderName, itemRenderType) => {
                  //   switch (itemRenderName) {
                  //     case '$vxeInput':
                  //       // text, search, number, integer, float, password, date, time, datetime, week, month, year
                  //       switch (itemRenderType) {
                  //         case 'string':
                  //           return (str) => {
                  //             // 空
                  //             str = str && str.toString()
                  //             return !(str && str.trim() !== '')
                  //           }
                  //         case 'number':
                  //           // 数字
                  //           return (str) => {
                  //             return /^[0-9]*$/.test(str)
                  //           }
                  //         case 'integer':
                  //           // 数字
                  //           return (str) => {
                  //             return /^[1-9]+[0-9]*$/.test(str)
                  //           }
                  //         case 'time':
                  //           // 时间
                  //           return (str) => {
                  //             return /^\d*(?:\.\d{0,2})?$/.test(str)
                  //           }
                  //         case 'year':
                  //           // 年
                  //           return (str) => {
                  //             return /^[1,9]{4}/.test(str)
                  //           }
                  //         case 'float':
                  //           // 2位小叔
                  //           return (str) => {
                  //             return /^-?\d+\.?\d{0,2}$/.test(str)
                  //           }
                  //       }
                  //       break
                  //     case '$vxeMoney':
                  //       return (str) => {
                  //         return /^-?\d+\.?\d{0,2}$/.test(str)
                  //       }
                  //     case '$vxeCalculate':
                  //       return (str) => {
                  //         return /^-?\d+\.?\d{0,2}$/.test(str)
                  //       }
                  //     case '$vxeEditDownTextarea':
                  //       return (str) => {
                  //         str = str && str.toString()
                  //         return !(str && str.trim() !== '')
                  //       }
                  //     case '$vxeDays': {
                  //       return (str) => {
                  //         return /^-?\d+\.?\d{0,2}$/.test(str)
                  //       }
                  //     }
                  //     case '$vxeTime': {
                  //       return (str) => {
                  //         return /^-?\d+\.?\d{0,2}$/.test(str)
                  //       }
                  //     }
                  //     case '$vxeText': {
                  //       return (str) => {
                  //         return /^-?\d+\.?\d{0,2}$/.test(str)
                  //       }
                  //     }

                  //     default:
                  //       break
                  //   }
                  // })(itemRender.name, itemRender.props && itemRender.props.type),
                  name: itemRender.name,
                  options: Array.isArray(itemRender.options) ? itemRender.options : [],
                  multiple: false
                })
                break
            }
          } else {
            map = Object.assign({}, map, {
              needMap: false
            })
          }
          obj.viewToSourceMap[conlum.field] = map
        }
      }
    })
    return obj
  },
  isEditForFormula(row, rowIndex, column, columnIndex) {
    let isForFormulaData = column.property + ':' + row.itemcode
    let isForFormula = true
    let self = this
    if (self.calculateConstraintConfigIn.rowCodeFormulaConfig[isForFormulaData] || self.calculateConstraintConfigIn.colFormulaConfig[column.property]) {
      isForFormula = false
    } else {
      isForFormula = true
    }
    return isForFormula
    // if (this.calculateConstraintConfigIn.constraintConfig === '') {
    //   return true
    // } else {
    //   return false
    // }
  },
  isActiveCellEdit({ row, rowIndex, column, columnIndex }) {
    let isEditForFormula = this.isEditForFormula(row, rowIndex, column, columnIndex)
    return isEditForFormula
  }
}
const otherFn = {
  getListData() {
    // 获取表单数据
    const { fullData } = this.$refs.xGrid.getTableData()
    const data = fullData || []
    return this.dealData(data)
  },
  dealData(data) {
    let newData = []
    data.forEach((item) => {
      const itemVal = Object.assign({}, item)
      Object.keys(itemVal).map((val) => {
        let value = String(itemVal[val]) || ''
        if (value.includes('initId')) {
          const prefix = val.substr(0, val.indexOf('id'))
          itemVal[val] = ''
          itemVal[prefix + 'code'] = ''
          itemVal[prefix + 'name'] = ''
        }
      })
      newData.push(itemVal)
    })
    return newData
  },
  regTreePrefix(item) {
    const reg = /\w*_$/g
    return reg.test(item)
  },
  // 遍历正则对象，给树统一自动添加正则
  addTreeReg(formValidationConfig) {
    const reg = /^(?!initId)/g
    Object.keys(formValidationConfig).forEach((item) => {
      if (this.regTreePrefix(item)) {
        formValidationConfig[item][0].pattern = reg
      }
    })

    return formValidationConfig
  },
  // 遍历，动态给树组件添加双向绑定的前缀
  addTreePrefixKey2(treeData) {
    const reg = /_id$/
    let treeArr = treeData || []
    treeArr.forEach((row) => {
      Object.keys(row).forEach((item) => {
        // 以_id结尾，并且其前缀在数据包中不存在时，动态给其绑定一个前缀
        if (reg.test(item)) {
          const prefix = item.substr(0, item.indexOf('id'))
          if (!row.hasOwnProperty(prefix)) {
            this.$set(row, prefix, '')
          }
        }
      })
    })
    return treeData
  }
}
const batchModify = { // 批量修改
  omBatchModifySureClick({ modifyItem, formData }) {
    // 批量修改确认
    const selection = this.selection
    selection.forEach((row, index) => {
      row = Object.assign(row, formData)
    })
    this.reCalcAndReLoadTableData(this.getTableData().fullData).then(() => {

    })
  }
}
const exportAndImportFn = {
  getPrintOption(exportModalFormData) {
    const checkColumns = []
    this.$XEUtils.eachTree(exportModalFormData.columns, column => {
      const isColGroup = column.children && column.children.length
      if (!isColGroup) {
        checkColumns.push(column)
      }
    })
    return {
      data: exportModalFormData[exportModalFormData.dataType],
      isHeader: true,
      columns: checkColumns
    }
  },
  onPrintClick(obj) {
    this.$refs.xGrid.$refs.xTable.print(Object.assign({}, this.getPrintOption(obj)))
    // this.$VXETable.print()
  },
  triggerExportOption(obj) {
    // 触发导出动作
    let self = this
    const columns = this.deepCopy(this.tableColumnsConfig)
    const { tableData, fullData } = this.getTableData()
    const selection = this.selection
    this.exportModalData = obj || {
      isExportTree: !!self.treeConfigIn,
      saveType: '.xlsx',
      fileName: 'export', // 文件名
      dataType: 'tableData',
      isExportHead: true, // 是否导出表头
      isExportFooter: false, // 是否导出表尾部
      isExportOnlySourceField: false, // 是否只导出数据源表头字段，
      isExportOnlyViewTitle: false, // 是否只导出数据表头名称，
      isExportOriginalData: false, // 是否导出源数据
      isExportData: true, // 是否导出数据
      columns: columns, // 表头配置
      fullData: fullData,
      tableData: tableData,
      datas: [], // 源数据,
      selection: selection, // 选中数据
      index: true, // 是否添加序号,
      ignoreColsTypes: [
        'dragSort',
        'seq',
        'checkbox',
        'radio',
        'optionRow',
        'expand',
        'attach',
        'ach',
        'list',
        'attachlist'
      ], // 忽略导出的列类型
      viewValueFormat(value, row, column) {
        // 视图数据格式化方法
        // return value
      }
    }
    this.exportModalVisible = true
  },
  onExportClick(obj) {
    // 确定导出点击事件
    obj.successCb = () => {
      this.exportModalVisible = false
    }
    this.$Export.exportExcel(obj, this)
  },
  dealExportViewData(obj = {
    conlums: [],
    viewData: []
  }) {
    // 处理 导入数据
    let self = this
    let { viewToSourceMap, tableColumnsTitleFieldMap, rowsObjTemp, colFormulaConfigm, colFormulaConfig } = this.generateColumnsAllMap(obj.conlums)
    return obj.viewData.map((row, rowIndex) => {
      Object.keys(row).map((key, keyIndex) => {
        row[tableColumnsTitleFieldMap[key]] = self.reverseParseViewDataTosource(viewToSourceMap[tableColumnsTitleFieldMap[key]], row[key])
      })
      row = Object.assign({}, rowsObjTemp, row)
      return this.reductionColFormula(colFormulaConfigm, self.reductionColFormula(colFormulaConfig, row))
    })
  },
  deaImportViewData(obj = {
    conlums: [],
    viewData: [],
    valiRules: {}
  }) {
    // 处理 导入数据
    let self = this
    let { viewToSourceMap, tableColumnsTitleFieldMap, tableColumnsFieldMap, rowsObjTemp, colFormulaConfig } = this.generateColumnsAllMap(obj.conlums)
    let validResult = true
    let validResultFieldTitle = []
    // let valiRule = []
    let viewData = obj.viewData.map((row, rowIndex) => {
      Object.keys(row).forEach((key, keyIndex) => {
        let parseViewValue = self.reverseParseViewDataTosource(viewToSourceMap[tableColumnsTitleFieldMap[key]], row[key])
        // const customVal = String(parseViewValue).replace(/null|undefined|\s+/ig, '') !== ''
        if (tableColumnsFieldMap[tableColumnsTitleFieldMap[key.replace('(元)', '')]]) {
          // self.validCellRules({ type: 'all', row, column: tableColumnsFieldMap[tableColumnsTitleFieldMap[key]], val: parseViewValue, valiRules: obj.valiRules })
          //   .then(() => {
          //     if (customVal) {
          row[tableColumnsTitleFieldMap[key.replace('(元)', '')]] = parseViewValue
          if (tableColumnsTitleFieldMap[key.replace('(元)', '')] === 'iname') {
            row['itemcode'] = parseViewValue.split('-')[0].replace(/\s+/ig, '')
          }
          //   }
          // })
          // .catch(({ rule }) => {
          //   validResult = false
          //   valiRule.push(rule)
          //   if (customVal) {
          //     row[tableColumnsTitleFieldMap[key]] = parseViewValue
          //   }
          // })
        } else {
          if (key !== '序号' || key !== 'seqIndex') {
            validResultFieldTitle.push(key)
          }
        }
      })
      row = Object.assign({}, rowsObjTemp, row)
      return this.reductionColFormula(colFormulaConfig, self.reductionColFormula(colFormulaConfig, row))
    })
    self.reductionRowCodeFormula(this.calculateConstraintConfigIn.rowCodeFormulaConfig, viewData, self.id)
    return validResult && !validResultFieldTitle.length && viewData
  },
  reverseParseViewDataTosource(viewToSourceMap, value) {
    // 处理单个 导入数据
    //  needMap: true,
    //  name: itemRender.name,
    //  options: Array.isArray(itemRender.options) ? itemRender.options : [],
    //  multiple: true,
    //  formula: conlum.formula
    if (viewToSourceMap && viewToSourceMap.needMap) {
      let transValue = ''
      let viewValue = typeof (value) === 'string' ? value : ''
      if (viewToSourceMap.multiple) {
        if (viewValue.length) {
          let viewToSourceValueArr = []
          viewToSourceMap.options.forEach((item, index) => {
            if (viewValue.indexOf(item.label) >= 0) {
              viewToSourceValueArr.push(item.value)
            }
          })
          transValue = viewToSourceValueArr.join(',')
        } else {
          transValue = ''
        }
      } else {
        viewToSourceMap.options.forEach((item, index) => {
          if (viewValue.indexOf(item.label) >= 0) {
            transValue = item.value
          }
        })
      }
      return transValue
    } else {
      return value + ''.replace(/null|NaN|undefined|,/ig, '')
    }
  },
  newRule(rule) {
    // 错误规则信息
    return Object.assign({}, {
      $options: rule,
      required: rule.required,
      min: rule.min,
      max: rule.min,
      type: rule.type,
      pattern: rule.pattern,
      validator: rule.validator,
      maxWidth: rule.maxWidth,
      message: rule.message
    })
  },
  validCellRules(argObj) {
    // 校验单元格
    let self = this
    const { type, row, column, val, valiRules } = argObj
    const property = column.field
    const errorRules = []
    const syncVailds = []
    if (property && valiRules) {
      const rules = self.$XEUtils.get(valiRules, property)
      if (rules) {
        const cellValue = val
        // const cellValue = self.$XEUtils.isUndefined(val) ? self.$XEUtils.get(row, property) : val
        rules.forEach(rule => {
          if (type === 'all') {
            if (self.$XEUtils.isFunction(rule.validator)) {
              let customValid
              customValid = rule.validator({
                cellValue,
                rule,
                rules,
                row,
                rowIndex: row.index,
                column,
                $table: this
              })
              if (customValid) {
                if (self.$XEUtils.isError(customValid)) {
                  this.validRuleErr = true
                  errorRules.push(self.newRule({ type: 'custom', message: customValid.message, rule: self.newRule(rule) }))
                } else if (customValid.catch) {
                  // 如果为异步校验（注：异步校验是并发无序的）
                  syncVailds.push(
                    customValid.catch(e => {
                      this.validRuleErr = true
                      errorRules.push(self.newRule({ type: 'custom', message: e ? e.message : rule.message, rule: self.newRule(rule) }))
                    })
                  )
                }
              }
            } else {
              const isNumber = rule.type === 'number'
              const numVal = isNumber ? self.$XEUtils.toNumber(cellValue) : self.$XEUtils.getSize(cellValue)
              if (rule.required && (cellValue === null || cellValue === undefined || cellValue === '')) {
                this.validRuleErr = true
                errorRules.push(self.newRule(rule))
              } else if (
                (isNumber && isNaN(cellValue)) ||
                (!isNaN(rule.min) && numVal < parseFloat(rule.min)) ||
                (!isNaN(rule.max) && numVal > parseFloat(rule.max)) ||
                (rule.pattern && !(rule.pattern.test ? rule.pattern : new RegExp(rule.pattern)).test(cellValue))
              ) {
                this.validRuleErr = true
                errorRules.push(self.newRule(rule))
              }
            }
          }
        })
      }
    }
    return Promise.all(syncVailds).then(() => {
      if (errorRules.length) {
        const rest = { rules: errorRules, rule: errorRules[0] }
        return Promise.reject(rest)
      }
    })
  },
  exportByTempalte(obj = {
    data: [], // 模版数据，只拿第一行导出列配置
    conlums: [] // 所有表头
  }) {
    // 按模版导出
    let exportConlums = []
    let exportConlumsTitle = obj.data[0]
    const { tableColumnsTitleMap } = this.generateColumnsAllMap(obj.conlums)
    exportConlumsTitle.forEach((item, index) => {
      tableColumnsTitleMap[item] && exportConlums.push(tableColumnsTitleMap[item])
    })
    const fullData = this.getTableData().fullData
    const selection = this.selection
    this.$Export.exportExcel({
      isExportTree: true,
      saveType: '.xlsx',
      fileName: 'export', // 文件名
      dataType: 'fullData',
      isExportHead: true, // 是否导出表头
      isExportFooter: false, // 是否导出表尾部
      isExportOnlySourceField: false, // 是否只导出数据源表头字段，
      isExportOnlyViewTitle: false, // 是否只导出数据表头名称，
      isExportOriginalData: false, // 是否导出源数据
      isExportData: true, // 是否导出数据
      columns: exportConlums, // 表头配置
      fullData: fullData,
      datas: [], // 源数据,
      selection: selection, // 选中数据
      index: true // 是否添加序号,
    }, this)
  },
  downLoadImportTemplate(obj, tabPanal) {
    // 下载导入模版
    const tableColumnsConfig = this.tableColumnsConfig
    this.$Export.exportExcel({
      saveType: '.xlsx',
      fileName: '导入模版', // 文件名
      dataType: 'fullData',
      isExportOnlyViewTitle: true, // 是否只导出数据源表头字段，
      columns: tableColumnsConfig, // 表头配置
      index: false // 是否添加序号,
    }, this)
  },
  triggerImportOption(config = {}) {
    // 触发导入
    this.importConfig = config
    this.importModalVisible = true
  },
  triggerDownloadTemplate(obj) {
    this.onDownloadTemplateClick(obj)
  },
  onDownloadTemplateClick(obj) {
    // 下载模版
    if (typeof (this.importConfig.downloadTemplateCallback) === 'function') {
      this.importConfig.downloadTemplateCallback(this.importData)
    } else {
      this.importData = []
      const columns = this.tableColumnsConfig
      const selection = this.selection
      let defaultConfig = {
        isExportTree: !!self.treeConfigIn,
        saveType: '.xlsx',
        fileName: 'importTempplate', // 文件名
        dataType: 'fullData',
        isExportOnlySourceField: true, // 是否只导出数据源表头字段，
        isExportOnlyViewTitle: false, // 是否只导出数据表头名称，
        isExportHead: true, // 是否导出表头
        exportViewTitleType: 'nestTitle',
        isExportFooter: false, // 是否导出表尾部
        isExportOriginalData: true, // 是否导出源数据
        isExportData: true, // 是否导出数据
        columns: columns, // 表头配置
        datas: [], // 源数据,
        selection: selection, // 选中数据
        index: true, // 是否添加序号,
        ignoreColsTypes: [
          'dragSort',
          'seq',
          'checkbox',
          'radio',
          'optionRow',
          'expand',
          'attach',
          'ach',
          'list',
          'attachlist'
        ] // 忽略导出的列类型
      }
      this.$Export.exportExcel(obj ? Object.assign(defaultConfig, obj) : obj, this)
    }
  },
  async onImportFileClick() {
    // 导入文件
    let self = this
    await this.$Import.importExcel({
    }, (result, filename) => {
      // this.tableDataIn = result
      self.importData = result
      self.fileConfig.fileName = filename
    })
  },
  onImportClick() {
    // 导入提交
    if (!this.importData.length) {
      this.$message.error('无数据导入请重新导入数据！')
    } else {
      this.importModalVisible = false
      if (typeof (this.importConfig.importSuccessCallback) === 'function') {
        this.importConfig.importSuccessCallback(this.importData)
      } else {
        this.$emit('importSuccessCallback', this.importData)
      }
    }
  }
}
export default {
  ...util, // 工具类
  ...sortMethods, // 排序
  ...axiosEvent, // 请求
  ...initMethods, // prop更新方法以及初始化函数
  ...registFn, // 渲染注册函数
  ...tableEventFn, // 表格事件
  ...toolBarEvent, // toolbar事件
  ...pageEvent, // 分页事件
  ...formatters, // 全局formatter函数
  ...tableOptionFn, // 表格操作函数
  ...proxyFn, // 代理函数
  ...tableEvent, // 表格事件
  ...otherFn, // 其他函数
  ...batchModify, // 批量修改
  ...calculateConstraintTool, // 单元格计算
  ...exportAndImportFn// 导入导出工具类
}

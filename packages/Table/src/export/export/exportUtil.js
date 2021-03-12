// 导出视图数据映射以及对齐方式映射
export function defaultViewValueFormat(value, row, column) {
  let render = column.editRender || column.cellRender || column.contentRender
  let val = value
  let valueArr = []
  if (render && render.name) {
    let options = render.options || []
    const props = render.props || {}
    switch (render.name) {
      case '$vxeTree':
        const { multiple } = (props && props.config) || { multiple: true, multipleValueType: 'Array' }
        if (!multiple) {
          return [row[column.field + 'code'], row[column.field + 'name']].map((item, index) => {
            return (item + '').replace(/null|NaN|undefined/ig, '')
          }).filter((item) => {
            return item !== ''
          }).join('-')
        } else {
          let codeArr = typeof (row[column.field + 'code']) === 'string' ? row[column.field + 'code'].split(',') : (Array.isArray(row[column.field + 'code']) ? row[column.field + 'code'] : [])
          let nameArr = typeof (row[column.field + 'name']) === 'string' ? row[column.field + 'name'].split(',') : (Array.isArray(row[column.field + 'name']) ? row[column.field + 'name'] : [])
          return codeArr.map((item, index) => {
            return [codeArr[index], nameArr[index]].map((item, index) => {
              return (item + '').replace(/null|NaN|undefined/ig, '')
            }).filter((item) => {
              return item !== ''
            }).join('-')
          }).join(',')
        }
      case '$vxeInput':
        return (val + '').replace(/null|NaN|undefined/ig, '')
      case '$vxeSelect':
        props.multiple = props.multiple === undefined ? false : props.multiple
        if (props.multiple) {
          options.forEach((item, index) => {
            if ((val + '').indexOf(item.value) >= 0) {
              valueArr.push(item.label)
            }
          })
          return valueArr.join(',')
        } else {
          valueArr = options.filter((item, index) => {
            return item.value === value
          })
          val = valueArr[0] ? valueArr[0].label : ''
          return val
        }
      case '$vxeCalculate':
        val = isNaN(parseFloat(row[column.field])) ? '' : parseFloat(row[column.field])
        if (val) {
          row[column.field] = val.toFixed(2)
          val = Number((val).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          return val
        } else {
          return ''
        }
      case '$vxeMoney':
        val = isNaN(parseFloat(row[column.field])) ? '' : parseFloat(row[column.field])
        if (val) {
          row[column.field] = val.toFixed(2)
          val = Number((val).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          return val
        } else {
          return '0.00'
        }
      case '$EditDownConditions':
        return (row[column.field] + '').replace(/null|NaN|undefined/ig, '')
      case '$vxeDays':
        let quiteDay = row[column.field] % 1
        quiteDay = quiteDay <= 0.25 ? 0 : (quiteDay >= 0.75 ? 1 : 0.5)
        val = Math.floor(row[column.field] / 1) + quiteDay
        return val
      case '$vxeTime':
        props.format = props.format || 'YYYY-MM-DD hh:mm:ss'
        let dateTime = (row[column.field] + '').replace(/null|undefined/ig, '')
        if (dateTime) {
          let date = dateTime.length === 8 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) : (dateTime.length === 14 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) + ' ' + dateTime.substring(8, 10) + ':' + dateTime.substring(10, 12) + ':' + dateTime.substring(12, 14) : dateTime)
          return isNaN(new Date(dateTime).getTime()) ? new Date(date).format(props.format) : new Date(dateTime).format(props.format)
        } else {
          return ''
        }
      case '$vxeRadio':
        options.forEach((item, index) => {
          if (row[column.field] === item.value) {
            val = item.label
          }
        })
        return val
      case '$vxeCheckbox':
        row[column.field] = Array.isArray(row[column.field]) ? row[column.field] : []
        options.forEach((item, index) => {
          if (row[column.field].indexOf(item.value) >= 0) {
            valueArr.push(item.label)
          }
        })
        return valueArr.join(',')
      case '$vxeEditDownJson':
        val = JSON.stringify(row[column.field])
        return val
      case '$vxeSwitch':
        options.forEach((item, index) => {
          if (row[column.field] === item.value) {
            val = item.label
          }
        })
        return val
      case '$vxeProgress':
        return row[column.field]
      default:
        return value
    }
  } else {
    return val
  }
}
export function defaultViewValueFormatType(value, row, column) {
  let render = column.editRender || column.cellRender || column.contentRender
  if (render && render.name) {
    const props = render.props || {}
    // TypeString: 49,
    // TypeFormula: 0,
    // TypeNumeric: 1,
    // TypeBool: 0,
    // TypeInline: 0,
    // TypeError: 0,
    // TypeDate: 14,
    // TypeGeneral: 0
    switch (render.name) {
      case '$vxeTree':
        return 'TypeString'
      case '$vxeInput':
        // ['number', 'integer', 'float', 'year', 'month']
        if (['text', 'search', 'password', 'date', 'time', 'datetime', 'week', 'month', 'year'].indexOf(props.type) >= 0) {
          return 'TypeString'
        } else {
          return 'TypeNumeric'
        }
      case '$vxeSelect':
        return 'TypeString'
      case '$vxeCalculate':
        return 'TypeString'
      case '$vxeMoney':
        return 'TypeNumeric'
      case '$EditDownConditions':
        return 'TypeString'
      case '$vxeDays':
        return 'TypeNumeric'
      case '$vxeTime':
        return 'TypeString'
      case '$vxeRadio':
        return 'TypeString'
      case '$vxeCheckbox':
        return 'TypeString'
      case '$vxeEditDownJson':
        return 'TypeString'
      case '$vxeProgress':
        return 'TypeString'
      default:
        return 'TypeString'
    }
  } else {
    return 'TypeString'
  }
}

export function defaultViewValueFormatOld(value, row, column) {
  let render = column.editRender || column.cellRender || column.contentRender
  if (render && render.name) {
    let options = render.options || []
    const props = render.props || {}
    switch (render.name) {
      case '$treeinput':
        return props.noCode ? ((row[column.field + 'name'] + '').replace(/(null|undefined)/ig, '')) : (((row[column.field + 'code'] + '').replace(/(null|undefined)/ig, '')) ? (((row[column.field + 'code'] + '').replace(/(null|undefined)/ig, '')) + '-' + ((row[column.field + 'name'] + '').replace(/(null|undefined)/ig, ''))) : ((row[column.field + 'name'] + '').replace(/(null|undefined)/ig, '')))
      case '$treeText':
        return props.noCode ? ((row[column.field + 'name'] + '').replace(/(null|undefined)/ig, '')) : (((row[column.field + 'code'] + '').replace(/(null|undefined)/ig, '')) ? (((row[column.field + 'code'] + '').replace(/(null|undefined)/ig, '')) + '-' + ((row[column.field + 'name'] + '').replace(/(null|undefined)/ig, ''))) : ((row[column.field + 'name'] + '').replace(/(null|undefined)/ig, '')))
      case '$vxeMoney':
        value = Number(isNaN(parseFloat(value)) ? 0 : parseFloat(value).toFixed(2)).toLocaleString()
        value = value.split('.').length === 1 ? value + '.00' : (value.split('.')[1].length === 1 ? value + '0' : value)
        return value
      case '$moneyRender':
        value = Number(isNaN(parseFloat(value)) ? 0 : parseFloat(value).toFixed(2)).toLocaleString()
        value = value.split('.').length === 1 ? value + '.00' : (value.split('.')[1].length === 1 ? value + '0' : value)
        return value
      case '$vxeCalculate':
        value = Number(isNaN(parseFloat(value)) ? 0 : parseFloat(value).toFixed(2)).toLocaleString()
        value = value.split('.').length === 1 ? value + '.00' : (value.split('.')[1].length === 1 ? value + '0' : value)
        return value
      case '$calculateRender':
        value = Number(isNaN(parseFloat(value)) ? 0 : parseFloat(value).toFixed(2)).toLocaleString()
        value = value.split('.').length === 1 ? value + '.00' : (value.split('.')[1].length === 1 ? value + '0' : value)
        return value
      case '$vxeDays':
        return value
      case '$vxeIntervar':
        return value.replace('##', '-')
      case '$vxeCheckbox':
        let vxeCheckboxValue = []
        options.forEach((item, index) => {
          if (row[column.field].indexOf(item.value) >= 0) {
            vxeCheckboxValue.push(item.label)
          }
        })
        return vxeCheckboxValue.join(',')
      case '$vxeRadio':
        options.forEach((item, index) => {
          if (row[column.field] === item.value) {
            value = item.label
          }
        })
        return value
      case '$select':
        if (render.props && render.props.multiple) {
          let selectValue = []
          options.forEach((item, index) => {
            if (row[column.field].indexOf(item.value) >= 0) {
              selectValue.push(item.label)
            }
          })
          return selectValue.join(',')
        } else {
          options.forEach((item, index) => {
            if (row[column.field] === item.value) {
              value = item.label
            }
          })
          return value
        }
      case '$vxeSelect':
        if (render.props && render.props.multiple) {
          let selectValue = []
          options.forEach((item, index) => {
            if (row[column.field].indexOf(item.value) >= 0) {
              selectValue.push(item.label)
            }
          })
          return selectValue.join(',')
        } else {
          options.forEach((item, index) => {
            if (row[column.field] === item.value) {
              value = item.label
            }
          })
          return value
        }
      default:
        return value
    }
  } else {
    return value
  }
}
export function getCellValueAlign(column) {
  let render = column.editRender || column.cellRender
  switch (column.type) {
    case 'money':
      return 'right'
    case 'seqIndex':
      return 'center'
    default:
      if (render && render.name) {
        switch (render.name) {
          case '$vxeMoney':
            return 'right'
          case '$vxeCalculate':
            return 'right'
            // case '$moneyRender':
            //   return 'right'
            // case '$calculateRender':
            //   return 'right'
          case '$vxeDays':
            return 'right'
          case '$vxeCheckbox':
            return 'left'
          default:
            return column.align || 'left'
        }
      } else {
        return column.align || 'left'
      }
  }
}

export function getCellViewTitle(column) {
  let render = column.editRender || column.cellRender
  switch (column.type) {
    case 'money':
      return column.title + '(元)'
    case 'seqIndex':
      return '序号'
    default:
      if (render && render.name) {
        switch (render.name) {
          case '$vxeMoney':
            return column.title + '(元)'
          case '$vxeCalculate':
            return column.title + '(元)'
            // case '$moneyRender':
            //   return column.title + '(元)'
            // case '$calculateRender':
            //   return column.title + '(元)'
          case '$vxeDays':
            return column.title + '(天)'
          default:
            return column.title
        }
      } else {
        return column.title
      }
  }
}

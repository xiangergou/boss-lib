/* eslint-disable no-eval */
// 全局渲染器   Author:Titans@2396757591@qq.com
// cellRender渲染器名字配置
// autofocus 自动聚焦的类名
// renderHeader(h, renderOpts, params) 表头
// renderEdit(h, renderOpts, params) 表内容 - 编辑
// renderCell(h, renderOpts, params) 表内容 - 显示
// renderFooter(h, renderOpts, params) 表尾
// editCellExportMethod(params) 单元格导出函数
// footerCellExportMethod(params) 表尾单元格导出函数

import { filterTypeMap } from '../config/tableDefaultConfig'

// let itemConfig = {
//   title: '', // 项中文名
//   field: '', // 数据库字段
//   align: 'center', // 对齐方式 可选值：'left'||'right'||'center',
//   editable: 0, // 是否可编辑 可选值：0||1,
//   renderName: '$vxeInput', // 项类型 全局提供表格和form配套渲染器共 14组，分别为：新全局下拉树:$vxeTree，文本数字输入:$vxeInput，下拉选择:$vxeSelect，计算渲染器:$vxeCalculate，金额输入:$vxeMoney，下拉文本框:$vxeEditDownTextarea，天数:$vxeDays，时间日期:$vxeTime，单选:$vxeRadio，多选:$vxeCheckbox，间隔时间或数值选择输入渲染器:$vxeIntervar，开关:$vxeSwitch，进度条:vxeProgress。其中，条件渲染器，进度条（评测和developing
//   type: 'text', // text, search, number, integer, float, password, date, time, datetime, week, month, year,money,days,time
//   formula: '', // 项公式
//   options: '', // 下拉数据源 009#博士后+001#小学+002#初中+003#高中+004#中专+005#大专+006#本科+007#硕士+008#博士
//   defaultValue: '', // 默认值，
//   placeholder: '', // 编辑提示
//   clearable: 1, // 可清除的
//   visible: 1, // 是否可见,可选值：0||1,
//   disabled: 0, // 是否禁用,可选值：0||1,

//   min: 0, // 只对 type=number | integer | float 有效，最小值
//   max: 10000000000000, // 只对 type = number | integer | float 有效，最大值
//   digits: 2, // 只对 type=float 有效，小数位数
//   multiple: 0, // 是否多选，只对3组多选渲染器有效
//   className: '', // 项附加Class
//   format: '', // 格式化 对部分支持格式化的渲染器可用

//   // 表格特有
//   combinedType: 'subTotal,totalAll', // 是否施加合计以及合计类型，表格特有，可选值：average,subTotal,total,totalAll
//   fixed: '', // 列固定方式,表格特有 可选值：'left'||right||''
//   width: 200, // 列宽度,表格特有 integer||'auto',
//   sortable: 0, // 是否可排序，表格特有，可选值：0||1,
//   filters: 0, // 是否可筛选，表格特有，可选值：0||1,
//   resizable: 1, // 是否允许拖拽调整列宽,可选值：0||1,
//   // 表单特有
//   span: 8, // 项所占杉格宽度,表单特有 integer，可选值1-24,
//   titleWidth: 100, // 项标题所占宽度,表单特有 integer，可选值50-200,

//   validation: 0, // 是否施加校验,可选值：0||1,
//   validationMessage: '', // 校验不通过提示
//   required: 0, // 是否必填,可选值：0||1,
//   pattern: /[*]+/ig, // 校验正则,

//   // 扩展参数
//   props: '{}', // 额外配置，JSON.stringify(),
//   extensionProps: '{}', // 额外配置，JSON.stringify(),
//   params: '' // 额外私有参数 额外的参数（可以用来存放一些私有参数）any
// }
// 表格废弃原渲染同时计算改为计算后渲染，form仍然采用渲染实时计算。
const defaultGloabalUtils = {
  calculateRender(h, { props, name }, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
    props = props || {}
    let val = isNaN(parseFloat(row[column.property])) ? '' : parseFloat(row[column.property])
    if (val !== '') {
      row[column.property] = val.toFixed(2)
      if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
        val = Number((val).toFixed(2)).toLocaleString()
        val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
      } else {
        let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
        val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
        val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
      }
      row[column.property + '__viewSort'] = val
      return [<span class="text" {...{ props }} >{val}</span>]
    } else {
      row[column.property + '__viewSort'] = ''
      return [<span class="text" {...{ props }} ></span>]
    }
  },
  calculateRender_old(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $grid, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
    function calclate(columns, row, key) {
      function rever(columns) {
        columns.some((item, index) => {
          if (item.field === key && regR.test(item.formula)) {
            formulaItem = item
            return true
          }
          if (!formulaItem && Array.isArray(item.children) && item.children.length) {
            rever(item.children)
          }
        })
      }
      let formulaItem = false
      let regR = new RegExp('({[a-zA-Z0-9_]*})', 'ig')
      rever(columns)
      if (formulaItem) {
        let formula = formulaItem.formula
        for (let keyC in row) {
          let reg = new RegExp('({' + keyC + '})', 'ig')
          if (reg.test(formula)) {
            calclate(items, row, keyC)
            let value = (typeof (row[keyC]) === 'number' || typeof (row[keyC]) === 'string') ? row[keyC] : 0
            formula = formula.replace(reg, isNaN(parseFloat(value)) ? 0 : parseFloat(value))
          }
        }
        if (regR.test(formula)) {
          formula = formula.replace(regR, 0)
          console.log(`计算时公式依赖的字段数值未定义可能导致计算有误,当前行数据为:${row},计算公式为:${formulaItem.formula}，替换值后公式为${formula}`)
        }
        row[key] = eval(formula).toFixed(2)
        // row[key] = parseFloat(row[key].split('.').length === 1 ? row[key] + '.00' : (row[key].split('.')[0].length === 1 ? row[key] + '0' : row[key]))
      }
      return row[key]
    }
    calclate(context.$grid.columns, row, column.property)
    let val = isNaN(parseFloat(row[column.property])) ? 0 : parseFloat(row[column.property])
    let showZero = context.$grid.$parent.showZero
    if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
      val = Number((val).toFixed(2)).toLocaleString()
      val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
      if (!showZero) {
        return [<span class="text" >{val}</span>]
      } else {
        val = val === '0.00' ? '' : val
      }
    } else {
      let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
      val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
      val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
      return [<span>{val}</span>]
    }
  },
  formCalculateRender(h, renderOpts, { data, property, $form }, context) {
    function calclate(columns, data, key) {
      function rever(columns) {
        columns.some((item, index) => {
          if (item.field === key && new RegExp('({[a-zA-Z0-9_]*})', 'ig').test(item.formula)) {
            formulaItem = item
          }
          if (!formulaItem && Array.isArray(item.children) && item.children.length) {
            rever(item.children)
          }
        })
      }
      let formulaItem = false
      rever(columns)
      if (formulaItem) {
        let formula = formulaItem.formula
        for (let keyC in data) {
          let reg = new RegExp('({' + keyC + '})', 'ig')
          if (reg.test(formula)) {
            calclate($form.items, data, keyC)
            let value = (typeof (data[keyC]) === 'number' || typeof (data[keyC]) === 'string') ? data[keyC] : 0
            formula = formula.replace(reg, isNaN(parseFloat(value)) ? 0 : parseFloat(value))
          }
        }
        // eslint-disable-next-line no-eval
        data[key] = parseFloat(eval(formula).toFixed(2))
      }
      return data[key]
    }
    calclate($form.items, data, property)
    let val = isNaN(parseFloat(data[property])) ? 0 : parseFloat(data[property])
    let moneyUnit = 1
    val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
    // eslint-disable-next-line no-useless-escape
    return [<span>{val}</span>]
  },
  debounceItemChange: (function(debounce) {
    return debounce(300)
  })(function(delay) {
  // 利用闭包保存定时器
    let timer = null
    return function(cb) {
      // 在规定时间内再次触发会先清除定时器后再重设定时器
      clearTimeout(timer)
      timer = setTimeout(function() {
        cb()
      }, delay)
    }
  })
}
// 全局提供表格和form配套渲染器共 15 组，分别为： 新全局下拉树，文本数字输入，下拉选择，计算渲染器，金额输入，下拉文本框，天数，时间日期，单选，多选，间隔时间或数值选择输入渲染器，开关，进度条，条件渲染器。其中，条件渲染器，进度条（评测和developing）
const defaultPublicRenders = {
  // 表格form全局渲染器
  // 3组可多选
  $vxeTree: {
    // 全局树渲染器
    renderDefault(h, { name, props }, { row, column }) {
      let { multiple, format, showField, isHump } = (props && props.config) || { multiple: false, format: '{code}-{name}', showField: '', isHump: false }
      format = (props && props.cellViewFormat) || format || '{code}-{name}'
      if (showField) {
        row[showField] = (row[showField] + '').replace(/null|undefined/ig, '')
        row[column.property + '__viewSort'] = row[showField]
        return [<span class="text">{row[column.property + '__viewSort']}</span>]
      } else {
        let regR = new RegExp('({[a-zA-Z0-9_]*})', 'ig')
        let rowsKey = format.match(regR).map((key, keyIndex) => {
          return key.replace(/{|}/gi, '')
        })
        if (!multiple) {
          row[column.property] = [row[column.property + (isHump ? 'Code' : 'code')], row[column.property + (isHump ? 'Name' : 'name')], row[column.property + (isHump ? 'Id' : 'id')]].map((item, index) => {
            return (item + '').replace(/null|undefined/ig, '')
          }).join('##').replace('####', '')
          let arr = []
          rowsKey.map((key, indexkey) => {
            if (key === 'code') {
              (row[column.property + (isHump ? 'Code' : 'code')] + '').replace(/null|undefined|root/ig, '') !== '' && arr.push(row[column.property + (isHump ? 'Code' : 'code')])
            } else {
              (row[column.property + key] + '').replace(/null|undefined/ig, '') !== '' && arr.push(row[column.property + key])
            }
          })
          row[column.property + '__viewSort'] = row[column.property] === '' ? '' : arr.join('-')
        } else {
          let idNameCodeMap = {
            idArr: (typeof (row[column.property + (isHump ? 'Id' : 'id')]) === 'string' && (row[column.property + (isHump ? 'Id' : 'id')]) !== '') ? row[column.property + (isHump ? 'Id' : 'id')].split(',') : (Array.isArray(row[column.property + (isHump ? 'Id' : 'id')]) ? row[column.property + (isHump ? 'Id' : 'id')] : []),
            codeArr: (typeof (row[column.property + (isHump ? 'Code' : 'code')]) === 'string' && (row[column.property + (isHump ? 'Code' : 'code')]) !== '') ? row[column.property + (isHump ? 'Code' : 'code')].split(',') : (Array.isArray(row[column.property + (isHump ? 'Code' : 'code')]) ? row[column.property + (isHump ? 'Code' : 'code')] : []),
            nameArr: (typeof (row[column.property + (isHump ? 'Name' : 'name')]) === 'string' && (row[column.property + (isHump ? 'Name' : 'name')]) !== '') ? row[column.property + (isHump ? 'Name' : 'name')].split(',') : (Array.isArray(row[column.property + (isHump ? 'Name' : 'name')]) ? row[column.property + (isHump ? 'Name' : 'name')] : [])
          }
          row[column.property] = idNameCodeMap.nameArr.length ? idNameCodeMap.codeArr.map((item, index) => {
            return [idNameCodeMap.codeArr[index], idNameCodeMap.nameArr[index], idNameCodeMap.idArr[index]].map((item, index) => {
              return (item + '').replace(/null|undefined/ig, '')
            }).join('##').replace('####', '')
          }).join(',') : ''
          row[column.property + (isHump ? 'Id' : 'id')] = row[column.property] === '' ? '' : idNameCodeMap.idArr.join(',')
          row[column.property + (isHump ? 'Code' : 'code')] = row[column.property] === '' ? '' : idNameCodeMap.codeArr.join(',')
          row[column.property + (isHump ? 'Name' : 'name')] = row[column.property] === '' ? '' : idNameCodeMap.nameArr.join(',')
          row[column.property + (isHump ? 'Id__multiple' : 'id__multiple')] = row[column.property] === '' ? [] : idNameCodeMap.idArr
          row[column.property + (isHump ? 'Code__multiple' : 'code__multiple')] = row[column.property] === '' ? [] : idNameCodeMap.codeArr
          row[column.property + (isHump ? 'name__multiple' : 'name__multiple')] = row[column.property] === '' ? [] : idNameCodeMap.nameArr
          row[column.property + '__viewSort'] = row[column.property] === '' ? '' : idNameCodeMap.codeArr.map((item, index) => {
            let arr = []
            rowsKey.map((key, indexkey) => {
              if (key === 'code') {
                idNameCodeMap[key + 'Arr'][index] !== 'root' && arr.push(idNameCodeMap[key + 'Arr'][index])
              } else {
                idNameCodeMap[key + 'Arr'][index] && arr.push(idNameCodeMap[key + 'Arr'][index])
              }
            })
            return arr.join('-')
          }).join(',')
        }
        return [<span class="text">{row[column.property + '__viewSort']}</span>]
      }
    },
    renderCell(h, { name, props }, { row, column }) {
      let { multiple, format, showField, isHump } = (props && props.config) || { multiple: false, format: '{code}-{name}', showField: '', isHump: false }
      format = (props && props.cellViewFormat) || format || '{code}-{name}'
      if (showField) {
        row[showField] = (row[showField] + '').replace(/null|undefined/ig, '')
        row[column.property + '__viewSort'] = row[showField]
        return [<span class="text">{row[column.property + '__viewSort']}</span>]
      } else {
        let regR = new RegExp('({[a-zA-Z0-9_]*})', 'ig')
        let rowsKey = format.match(regR).map((key, keyIndex) => {
          return key.replace(/{|}/gi, '')
        })
        if (!multiple) {
          row[column.property] = [row[column.property + (isHump ? 'Code' : 'code')], row[column.property + (isHump ? 'Name' : 'name')], row[column.property + (isHump ? 'Id' : 'id')]].map((item, index) => {
            return (item + '').replace(/null|undefined/ig, '')
          }).join('##').replace('####', '')
          let arr = []
          rowsKey.map((key, indexkey) => {
            if (key === 'code') {
              (row[column.property + (isHump ? 'Code' : 'code')] + '').replace(/null|undefined|root/ig, '') !== '' && arr.push(row[column.property + (isHump ? 'Code' : 'code')])
            } else {
              (row[column.property + key] + '').replace(/null|undefined/ig, '') !== '' && arr.push(row[column.property + key])
            }
          })
          row[column.property + '__viewSort'] = row[column.property] === '' ? '' : arr.join('-')
        } else {
          let idNameCodeMap = {
            idArr: (typeof (row[column.property + (isHump ? 'Id' : 'id')]) === 'string' && (row[column.property + (isHump ? 'Id' : 'id')]) !== '') ? row[column.property + (isHump ? 'Id' : 'id')].split(',') : (Array.isArray(row[column.property + (isHump ? 'Id' : 'id')]) ? row[column.property + (isHump ? 'Id' : 'id')] : []),
            codeArr: (typeof (row[column.property + (isHump ? 'Code' : 'code')]) === 'string' && (row[column.property + (isHump ? 'Code' : 'code')]) !== '') ? row[column.property + (isHump ? 'Code' : 'code')].split(',') : (Array.isArray(row[column.property + (isHump ? 'Code' : 'code')]) ? row[column.property + (isHump ? 'Code' : 'code')] : []),
            nameArr: (typeof (row[column.property + (isHump ? 'Name' : 'name')]) === 'string' && (row[column.property + (isHump ? 'Name' : 'name')]) !== '') ? row[column.property + (isHump ? 'Name' : 'name')].split(',') : (Array.isArray(row[column.property + (isHump ? 'Name' : 'name')]) ? row[column.property + (isHump ? 'Name' : 'name')] : [])
          }
          row[column.property] = idNameCodeMap.nameArr.length ? idNameCodeMap.codeArr.map((item, index) => {
            return [idNameCodeMap.codeArr[index], idNameCodeMap.nameArr[index], idNameCodeMap.idArr[index]].map((item, index) => {
              return (item + '').replace(/null|undefined/ig, '')
            }).join('##').replace('####', '')
          }).join(',') : ''
          row[column.property + (isHump ? 'Id' : 'id')] = row[column.property] === '' ? '' : idNameCodeMap.idArr.join(',')
          row[column.property + (isHump ? 'Code' : 'code')] = row[column.property] === '' ? '' : idNameCodeMap.codeArr.join(',')
          row[column.property + (isHump ? 'Name' : 'name')] = row[column.property] === '' ? '' : idNameCodeMap.nameArr.join(',')
          row[column.property + (isHump ? 'Id__multiple' : 'id__multiple')] = row[column.property] === '' ? [] : idNameCodeMap.idArr
          row[column.property + (isHump ? 'Code__multiple' : 'code__multiple')] = row[column.property] === '' ? [] : idNameCodeMap.codeArr
          row[column.property + (isHump ? 'name__multiple' : 'name__multiple')] = row[column.property] === '' ? [] : idNameCodeMap.nameArr
          row[column.property + '__viewSort'] = row[column.property] === '' ? '' : idNameCodeMap.codeArr.map((item, index) => {
            let arr = []
            rowsKey.map((key, indexkey) => {
              if (key === 'code') {
                idNameCodeMap[key + 'Arr'][index] !== 'root' && arr.push(idNameCodeMap[key + 'Arr'][index])
              } else {
                idNameCodeMap[key + 'Arr'][index] && arr.push(idNameCodeMap[key + 'Arr'][index])
              }
            })
            return arr.join('-')
          }).join(',')
        }
        return [<span class="text">{row[column.property + '__viewSort']}</span>]
      }
    },
    renderEdit(h, renderOpts, params, context) {
      let { props } = renderOpts
      let { row, column } = params
      let bsTable = context.$grid.$parent
      let renderData = row
      let { valueKeys, isHump } = (props && props.config) || { multiple: false, valueKeys: ['code', 'name', 'id'] }
      valueKeys = valueKeys || ['code', 'name', 'id']
      return [
        h('BsTree', {
          props: {
            ref: 'vxe-tree-' + column.property,
            editable: true,
            value: row[column.property],
            ...props,
            isDropSelectTree: true
          },
          on: {
            input: (value) => {
              renderData[column.property] = value
            },
            onNodeClick({ node, treeData }) {
              if (node !== null) {
                renderData[column.property + (isHump ? 'Id' : 'id')] = node[valueKeys[2]]
                renderData[column.property + (isHump ? 'Code' : 'code')] = node[valueKeys[0]]
                renderData[column.property + (isHump ? 'Name' : 'name')] = node[valueKeys[1]]
              } else {
                renderData[column.property + (isHump ? 'Id' : 'id')] = ''
                renderData[column.property + (isHump ? 'Code' : 'code')] = ''
                renderData[column.property + (isHump ? 'Id' : 'name')] = ''
              }

              bsTable.cellOptionCallBack(params, { optionType: 'nodeClick', node, treeData })
            },
            onNodeCheckClick({ nodes, node, treeData, value }) {
              renderData[column.property + (isHump ? 'Id__multiple' : 'id__multiple')] = nodes.map((item, index) => {
                return item[valueKeys[2]] ? item[valueKeys[2]] : ''
              })
              renderData[column.property + (isHump ? 'Code__multiple' : 'code__multiple')] = nodes.map((item, index) => {
                return item[valueKeys[0]] ? item[valueKeys[0]] : ''
              })
              renderData[column.property + (isHump ? 'Name__multiple' : 'name__multiple')] = nodes.map((item, index) => {
                return item[valueKeys[1]] ? item[valueKeys[1]] : ''
              })
              renderData[column.property + (isHump ? 'Id' : 'id')] = renderData[column.property + (isHump ? 'Id__multiple' : 'id__multiple')].join(',')
              renderData[column.property + (isHump ? 'Code' : 'code')] = renderData[column.property + (isHump ? 'Code__multiple' : 'code__multiple')].join(',')
              renderData[column.property + (isHump ? 'Id' : 'name')] = renderData[column.property + (isHump ? 'Name__multiple' : 'name__multiple')].join(',')
              bsTable.cellOptionCallBack(params, { optionType: 'nodeCheckClick', node, nodes, treeData })
            }
          }
        })
      ]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props } = renderOpts
      let renderData = data
      let { multiple, isHump, valueKeys } = (props && props.config) || { multiple: false, valueKeys: ['code', 'name', 'id'] }
      valueKeys = valueKeys || ['code', 'name', 'id']
      if (!multiple) {
        data[property] = [data[property + (isHump ? 'Code' : 'code')], data[property + (isHump ? 'Name' : 'name')], data[property + (isHump ? 'Id' : 'id')]].map((item, index) => {
          return (item + '').replace(/null|undefined/ig, '')
        }).join('##').replace('####', '')
        data[property + '__viewSort'] = data[property] === '' ? '' : [data[property + (isHump ? 'Code' : 'code')], data[property + (isHump ? 'Name' : 'name')]].map((item, index) => {
          return (item + '').replace(/null|undefined/ig, '')
        }).filter((item) => {
          return item !== ''
        }).join('-')
      } else {
        let idArr = (typeof (data[property + (isHump ? 'Id' : 'id')]) === 'string' && data[property + (isHump ? 'Id' : 'id')] !== '') ? data[property + (isHump ? 'Id' : 'id')].split(',') : (Array.isArray(data[property + (isHump ? 'Id' : 'id')]) ? data[property + (isHump ? 'Id' : 'id')] : [])
        let codeArr = (typeof (data[property + (isHump ? 'Code' : 'code')]) === 'string' && data[property + (isHump ? 'Code' : 'code')] !== '') ? data[property + (isHump ? 'Code' : 'code')].split(',') : (Array.isArray(data[property + (isHump ? 'Code' : 'code')]) ? data[property + (isHump ? 'Code' : 'code')] : [])
        let nameArr = (typeof (data[property + (isHump ? 'Name' : 'name')]) === 'string' && data[property + (isHump ? 'Name' : 'name')] !== '') ? data[property + (isHump ? 'Name' : 'name')].split(',') : (Array.isArray(data[property + (isHump ? 'Name' : 'name')]) ? data[property + (isHump ? 'Name' : 'name')] : [])
        data[property] = nameArr.length ? codeArr.map((item, index) => {
          return [codeArr[index], nameArr[index], idArr[index]].map((item, index) => {
            return (item + '').replace(/null|undefined/ig, '')
          }).join('##').replace('####', '')
        }).join(',') : ''
        data[property + (isHump ? 'Id' : 'id')] = data[property] === '' ? '' : idArr.join(',')
        data[property + (isHump ? 'Code' : 'code')] = data[property] === '' ? '' : codeArr.join(',')
        data[property + (isHump ? 'Name' : 'name')] = data[property] === '' ? '' : nameArr.join(',')
        data[property + (isHump ? 'Id__multiple' : 'id__multiple')] = data[property] === '' ? [] : idArr
        data[property + (isHump ? 'Code__multiple' : 'code__multiple')] = data[property] === '' ? [] : codeArr
        data[property + (isHump ? 'Name__multiple' : 'name__multiple')] = data[property] === '' ? [] : nameArr
        data[property + '__viewSort'] = data[property] === '' ? '' : codeArr.map((item, index) => {
          return [codeArr[index], nameArr[index]].map((item, index) => {
            return (item + '').replace(/null|undefined/ig, '')
          }).filter((item) => {
            return item !== ''
          }).join('-')
        }).join(',')
      }
      return [
        h('BsTree', {
          props: {
            ref: 'vxe-tree-' + property,
            editable: true,
            value: data[property],
            ...props,
            isDropSelectTree: true
          },
          on: {
            input: (value) => {
              data[property] = value
            },
            onNodeClick({ node, treeData }) {
              if (node !== null) {
                renderData[property + (isHump ? 'Id' : 'id')] = node[valueKeys[2]]
                renderData[property + (isHump ? 'Code' : 'code')] = node[valueKeys[0]]
                renderData[property + (isHump ? 'Name' : 'name')] = node[valueKeys[1]]
              } else {
                renderData[property + (isHump ? 'Id' : 'id')] = ''
                renderData[property + (isHump ? 'Code' : 'code')] = ''
                renderData[property + (isHump ? 'Name' : 'name')] = ''
              }
              renderData[property + '__viewSort'] = [renderData[property + (isHump ? 'Code' : 'code')], renderData[property + (isHump ? 'Name' : 'name')]].map((item, index) => {
                return (item + '').replace(/null|undefined/ig, '')
              }).filter((item) => {
                return item !== ''
              }).join('-')
              $form.$parent.itemChange({ $form, property, itemValue: data[property], data, renderOpts, node, treeData })
            },
            onNodeCheckClick({ node, nodes, treeData, value }) {
              renderData[property + (isHump ? 'Id__multiple' : 'id__multiple')] = nodes.map((item, index) => {
                return item[valueKeys[2]] ? item[valueKeys[2]] : ''
              })
              renderData[property + (isHump ? 'Code__multiple' : 'code__multiple')] = nodes.map((item, index) => {
                return item[valueKeys[0]] ? item[valueKeys[0]] : ''
              })
              renderData[property + (isHump ? 'Name__multiple' : 'name__multiple')] = nodes.map((item, index) => {
                return item[valueKeys[1]] ? item[valueKeys[1]] : ''
              })
              renderData[property + (isHump ? 'Id' : 'id')] = renderData[property + (isHump ? 'Id__multiple' : 'id__multiple')].join(',')
              renderData[property + (isHump ? 'Code' : 'code')] = renderData[property + (isHump ? 'Code__multiple' : 'code__multiple')].join(',')
              renderData[property + (isHump ? 'Name' : 'name')] = renderData[property + (isHump ? 'Name__multiple' : 'name__multiple')].join(',')
              renderData[property + '__viewSort'] = renderData[property + 'code__multiple'].map((item, index) => {
                return [renderData[property + 'code__multiple'][index], renderData[property + (isHump ? 'Name' : 'name')][index]].map((item, index) => {
                  return (item + '').replace(/null|undefined/ig, '')
                }).filter((item) => {
                  return item !== ''
                }).join('-')
              }).join(',')
              $form.$parent.itemChange({ $form, property, itemValue: data[property], data, renderOpts, node, nodes, treeData })
            }
          }
        })
      ]
    }
  },
  $vxeSelect: {
    // 下拉选择
    renderDefault(h, { props, options }, { row, column }, context) {
      props = props || {}
      row[column.property] = (row[column.property] + '').replace(/null|undefined/ig, '')
      if (props.multiple) {
        row[column.property + '__multiple'] = (row[column.property] === '') ? [] : row[column.property].split(',')
        let arrValue = []
        options.forEach((item, index) => {
          if (row[column.property + '__multiple'].indexOf(item.value + '') >= 0) {
            arrValue.push(item.label)
          }
        })
        row[column.property + '__viewSort'] = arrValue.join(',')
        return [<span>{row[column.property + '__viewSort']}</span>]
      } else {
        let arrValue = []
        options.forEach((item, index) => {
          if (row[column.property] + '' === item.value + '') {
            arrValue.push(item.label)
          }
        })
        row[column.property + '__viewSort'] = arrValue.join(',')
        return [<span>{row[column.property + '__viewSort']}</span>]
      }
    },
    renderCell(h, { props, options }, { row, column }, context) {
      props = props || {}
      row[column.property] = (row[column.property] + '').replace(/null|undefined/ig, '')
      // // row[column.property] = typeof (row[column.property]) === 'string' ? row[column.property] : (Array.isArray(row[column.property]) ? row[column.property].join(',') : '')
      if (props.multiple) {
        row[column.property + '__multiple'] = (row[column.property] === '') ? [] : row[column.property].split(',')
        let arrValue = []
        options.forEach((item, index) => {
          if (row[column.property + '__multiple'].indexOf(item.value + '') >= 0) {
            arrValue.push(item.label)
          }
        })
        row[column.property + '__viewSort'] = arrValue.join(',')
        return [
          <span>{row[column.property + '__viewSort']}</span>
        ]
      } else {
        let arrValue = []
        options.forEach((item, index) => {
          if (row[column.property] + '' === item.value + '') {
            arrValue.push(item.label)
          }
        })
        row[column.property + '__viewSort'] = arrValue.join(',')
        return [
          <span>{row[column.property + '__viewSort']}</span>
        ]
      }
    },
    renderEdit(h, renderOpts, params, context) {
      let { props, options } = renderOpts
      let { row, column } = params
      let bsTable = context.$grid.$parent
      props = props || {}
      row[column.property] = typeof (row[column.property]) === 'string' ? row[column.property] : (Array.isArray(row[column.property]) ? row[column.property].join(',') : '')
      if (props.multiple) {
        row[column.property + '__multiple'] = row[column.property + '__multiple'] = (row[column.property] === '') ? [] : row[column.property].split(',')
      }
      return [
        h('vxe-select', {
          props: {
            ref: 'vxe-select-' + column.property,
            value: props.multiple ? row[column.property + '__multiple'] : row[column.property],
            placeholder: '请选择',
            ...props,
            transfer: true
          },
          on: {
            change: ({ value }) => {
              let arrValue = []
              if (props.multiple) {
                row[column.property + '__multiple'] = value
                row[column.property] = value.join(',')
                options.forEach((item, index) => {
                  if (row[column.property + '__multiple'].indexOf(item.value + '') >= 0) {
                    arrValue.push(item.label)
                  }
                })
                bsTable.cellOptionCallBack(params, { optionType: 'select', multiple: props.multiple, value, viewValue: arrValue, field: column.property, renderOpts })
              } else {
                row[column.property] = value
                options.forEach((item, index) => {
                  if (row[column.property] + '' === item.value + '') {
                    arrValue.push(item.label)
                  }
                })
                bsTable.cellOptionCallBack(params, { optionType: 'select', multiple: props.multiple, value, viewValue: arrValue[0], field: column.property, renderOpts })
              }
            }
          }
        }, options.map(item => {
          return h('vxe-option', {
            props: {
              value: item.value + '',
              label: item.label
            }
          })
        }))
      ]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props, options } = renderOpts
      props = props || {}
      data[property] = (data[property] + '').replace(/null|undefined/ig, '')
      // if (props.multiple) {
      //   data[property + '__multiple'] = (data[property] === '') ? [] : data[property].split(',')
      // }
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-select', {
            props: {
              ref: 'vxe-select-' + property,
              value: props.multiple ? data[property + '__multiple'] : data[property],
              placeholder: '请选择',
              ...props,
              transfer: true
            },
            on: {
              change: ({ value }) => {
                if (props.multiple) {
                  data[property + '__multiple'] = value
                  data[property] = value.join(',')
                } else {
                  data[property] = value
                }
                $form.$parent.itemChange({ $form, property, itemValue: data[property], data, renderOpts })
              }
            }
          }, options.map(item => {
            return [
              h('vxe-option', {
                props: {
                  value: item.value + '',
                  label: item.label
                }
              })
            ]
          }))
        ]
      } else {
        if (props.multiple) {
          data[property + '__multiple'] = (data[property] === '') ? [] : data[property].split(',')
          let arrValue = []
          options.forEach((item, index) => {
            if (data[property + '__multiple'].indexOf(item.value + '') >= 0) {
              arrValue.push(item.label)
            }
          })
          data[property + '__viewSort'] = arrValue.join(',')
          return [
            <span>{data[property + '__viewSort']}</span>
          ]
        } else {
          let arrValue = []
          options.forEach((item, index) => {
            if (data[property] + '' === item.value + '') {
              arrValue.push(item.label)
            }
          })
          data[property + '__viewSort'] = arrValue.join(',')
          return [
            <span>{data[property + '__viewSort']}</span>
          ]
        }
      }
    }
  },
  $vxeCheckbox: {
    renderDefault(h, { options, props }, { row, column }, context) {
      row[column.property] = typeof (row[column.property]) === 'string' ? row[column.property] : (Array.isArray(row[column.property]) ? row[column.property].join(',') : '')
      row[column.property + '__multiple'] = row[column.property].split(',')
      let value = []
      options.forEach((item, index) => {
        item.value = item.value + ''
        if (row[column.property + '__multiple'].indexOf() >= 0) {
          value.push(item.label)
        }
      })
      row[column.property + '__viewSort'] = value.join(',')
      return [<span>{row[column.property + '__viewSort']}</span>]
    },
    renderCell(h, { options, props }, { row, column }) {
      row[column.property] = typeof (row[column.property]) === 'string' ? row[column.property] : (Array.isArray(row[column.property]) ? row[column.property].join(',') : '')
      row[column.property + '__multiple'] = row[column.property].split(',')
      let value = []
      options.forEach((item, index) => {
        item.value = item.value + ''
        if (row[column.property + '__multiple'].indexOf(item.value + '') >= 0) {
          value.push(item.label)
        }
      })
      row[column.property + '__viewSort'] = value.join(',')
      return [<span>{row[column.property + '__viewSort']}</span>]
    },
    renderEdit(h, { options, props, propsC }, { row, column }) {
      props = props || {}
      propsC = propsC || {}
      row[column.property] = typeof (row[column.property]) === 'string' ? row[column.property] : (Array.isArray(row[column.property]) ? row[column.property].join(',') : '')
      row[column.property + '__multiple'] = row[column.property].split(',')
      // return [
      //   <vxe-checkbox-group {...{ props }} v-model={row[column.property]} placeholder="请选择">
      //     {options.map((item, index) => {
      //       return [
      //         <vxe-checkbox
      //           label={item.value}
      //           { ...{ propsC } }
      //         >1
      //           {item.label}
      //         </vxe-checkbox>
      //       ]
      //     })}
      //   </vxe-checkbox-group>
      // ]
      return [
        h('vxe-checkbox-group', {
          props: {
            value: row[column.property + '__multiple'],
            ...props
          },
          on: {
            change({ $event, checked, checklist, label }) {
              row[column.property + '__multiple'] = checklist
              row[column.property] = checklist.join(',')
            }
          }
        }, options.map(item => {
          return h('vxe-checkbox', {
            props: {
              label: item.value + '',
              ...propsC
            }
          }, item.label)
        }))
      ]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props, propsC, options } = renderOpts
      // if (Array.isArray(data[property])) {
      //   data[property + '__multiple'] = [...data[property]]
      // } else if (typeof data[property] === 'string') {
      //   data[property + '__multiple'] = data[property].split(',')
      // } else {
      //   data[property] = ''
      //   data[property + '__multiple'] = []
      // }
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-checkbox-group', {
            props: {
              value: data[property + '__multiple'],
              ...props
            },
            on: {
              change({ $event, checked, checklist, label }) {
                data[property] = checklist.join(',')
                //  $form.$parent.itemChange({ $form, property, itemValue: data[property], data, renderOpts })
              }
            }
          }, options.map(item => {
            return h('vxe-checkbox', {
              props: {
                label: item.value + '',
                ...propsC
              }
            }, item.label)
          }))
        ]
      } else {
        return [
          h('vxe-checkbox-group', {
            props: {
              value: data[property + '__multiple'],
              ...props
            },
            on: {
              change({ $event, checked, checklist, label }) {
                data[property] = checklist.join(',')
                // $form.$parent.itemChange({ $form, property, itemValue: checklist, data, renderOpts })
              }
            }
          }, options.map(item => {
            return h('vxe-checkbox', {
              props: {
                disabled: item.disabled,
                label: item.value + '',
                ...propsC
              }
            }, item.label)
          }))
        ]
      }
    }
  },
  // 单值
  $vxeInput: {
    // 输入框
    autofocus: '.vxe-input--inner',
    renderEdit(h, { props }, { row, column }) {
      props = Object.assign({ type: 'text', placeholder: '请输入' }, props || {})
      return [
        <vxe-input
          v-model={row[column.property]}
          placeholder="可清除"
          clearable
          {...{ props }}
          transfer={true}
        ></vxe-input>
        // <input class="my-cell" text="text" v-model={ row[column.property] } />
      ]
    },
    renderCell(h, cellRender, { row, column }, context) {
      row[column.property] = (row[column.property] + '').replace(/null|undefined/ig, '')
      row[column.property + '__viewSort'] = row[column.property]
      return [<span class="text">{row[column.property]}</span>]
    },
    renderDefault(h, cellRender, { row, column }, context) {
      row[column.property] = (row[column.property] + '').replace(/null|undefined/ig, '')
      row[column.property + '__viewSort'] = row[column.property]
      return [<span class="text">{row[column.property]}</span>]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props } = renderOpts
      props = Object.assign({ type: 'text', placeholder: '请输入' }, props || {})
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              value: data[property],
              ...props,
              transfer: true
            },
            on: {
              input(value) {
                data[property] = value
                defaultGloabalUtils.debounceItemChange(() => {
                  $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts })
                })
              }
            }
          })
        ]
      } else {
        return [
          <span class="tl fn-inline" {...{ props }}> {data[property]} </span>
        ]
      }
    }
  },
  $vxeCalculate: {
    // 计算列
    // let row = {
    //   a: 1,
    //   b: 2,
    //   c: 3
    // }
    // let formula = 'Math.pow({a}+{b},{c})'
    // for (let k in row) {
    // let reg = new RegExp('({' + k + '})', 'ig')
    //   if (reg.test(formula)) {
    //     formula = formula.replace(reg, row[k])
    //   }
    // }
    // let calcResult = (new Function('console.log(formula);return eval(formula)'))()
    renderDefault(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
      return defaultGloabalUtils.calculateRender(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context)
    },
    renderCell(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
      return defaultGloabalUtils.calculateRender(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context)
    },
    renderEdit(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
      return defaultGloabalUtils.calculateRender(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context)
      // return [
      //   <vxe-input
      //     v-model={row[column.property]}
      //     placeholder="自动计算"
      //     readonly
      //     clearable
      //   ></vxe-input>
      // ]
    },
    renderItem(h, renderOpts, { $form, data, property }) {
      return defaultGloabalUtils.formCalculateRender(h, renderOpts, { $form, data, property })
    }
  },
  $vxeMoney: {
    // 输入框
    autofocus: '.vxe-input--inner',
    renderDefault(h, { props }, { row, column, $grid }, context) {
      props = props || {}
      let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
      let showZero = context.$grid.$parent.showZero
      let val = isNaN(parseFloat(row[column.property])) ? '' : parseFloat(row[column.property])
      if (val === '') {
        row[column.property + '__viewSort'] = ''
        return [<span class="text" >{val}</span>]
      } else {
        row[column.property] = val.toFixed(2)
        if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
          val = Number((val).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          if (!showZero) {
            val = val === '0.00' ? '' : val
          }
        } else {
          val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          if (!showZero) {
            val = val === '0.00' ? '' : val
          }
        }
      }
      row[column.property + '__viewSort'] = val
      return [<span class="text">{val}</span>]
    },
    renderEdit(h, renderOpts, params, context) {
      let { props } = renderOpts
      let { row, column } = params
      let bsTable = context.$grid.$parent
      let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
      props = props || {}
      let moneyInputSwich = context.$grid.$parent.toolbarConfigIn ? context.$grid.$parent.toolbarConfigIn.moneyInputSwich : false
      if (moneyInputSwich) {
        row[column.property + '__moneySwitchinput'] = row[column.property] / moneyUnit + ''
      }
      return [
        h('vxe-input', {
          ref: 'vxe-input' + column.property,
          props: {
            value: moneyInputSwich ? row[column.property + '__moneySwitchinput'] : row[column.property],
            step: 1,
            min: 0.00,
            max: 1000000000000,
            clearable: true,
            placeholder: '请输入',
            type: 'float',
            ...props
          },
          on: {
            input(value) {
              debugger
              value = context.$grid.$parent.transToNumber(value, props.digits || 2)
              row[column.property + '__moneySwitchinput'] = value
              row[column.property] = (moneyInputSwich ? value * moneyUnit : value) + ''
              bsTable.cellOptionCallBack(params, { optionType: 'input', value: row[column.property], field: column.property, renderOpts })
            }
          }
        })
      ]
    },
    renderCell(h, { props }, { row, column, $grid }, context) {
      props = props || {}
      let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
      let showZero = context.$grid.$parent.showZero
      let val = isNaN(parseFloat(row[column.property])) ? '' : parseFloat(row[column.property])
      if (val === '') {
        row[column.property + '__viewSort'] = ''
        return [<span class="text" >{val}</span>]
      } else {
        row[column.property] = val.toFixed(2)
        if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
          val = Number((val).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          if (!showZero) {
            val = val === '0.00' ? '' : val
          }
        } else {
          val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          if (!showZero) {
            val = val === '0.00' ? '' : val
          }
        }
      }
      row[column.property + '__viewSort'] = val
      return [<span class="text">{val}</span>]
    },
    renderItem(h, renderOpts, { $form, data, property }) {
      let moneyUnit = $form.$parent.moneyUnit ? $form.$parent.moneyUnit : 1
      data[property] = (isNaN(parseFloat(data[property])) ? '' : parseFloat(data[property])) + ''
      if (moneyUnit !== 1) {
        data[property + '__moneySwitchinput'] = (data[property] / moneyUnit) + ''
      }
      let { props } = renderOpts
      props = props || {}
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              value: moneyUnit === 1 ? data[property] : data[property + '__moneySwitchinput'],
              step: 1,
              min: 0.00,
              type: 'float',
              ...props,
              maxlength: 14,
              max: 1000000000000
            },
            on: {
              input(value) {
                if (moneyUnit === 1) {
                  data[property] = value
                } else {
                  data[property] = (value * moneyUnit) + ''
                  data[property + '__moneySwitchinput'] = value
                }
                defaultGloabalUtils.debounceItemChange(() => {
                  $form.$parent.itemChange({ $form, property, itemValue: data[property], data, renderOpts })
                })
              }
            }
          })
        ]
      } else {
        let val = isNaN(parseFloat(data[property])) ? 0 : parseFloat(data[property])
        data[property] = val.toFixed(2)
        val = Number(val.toFixed(2)).toLocaleString()
        return [<span class="tl" >{val}</span>]
      }
    }
  },
  $vxeEditDownTextarea: {
    autofocus: '.vxe-input--inner',
    renderDefault(h, cellRender, { row, column }, context) {
      row[column.property] = (row[column.property] + '').replace(/null|undefined/ig, '')
      row[column.property + '__viewSort'] = row[column.property]
      return [<span class="text">{row[column.property]}</span>]
    },
    renderEdit(h, { props }, params) {
      let { column } = params
      return [
        h('edit-down-textarea', {
          ref: 'vxe-edit-down-textarea' + column.property,
          props: {
            type: 'table',
            params: params,
            props: props
          },
          on: {
            input(value) {

            }
          }
        })
      ]
    },
    renderCell(h, cellRender, { row, column }, context) {
      row[column.property] = (row[column.property] + '').replace(/null|undefined/ig, '')
      row[column.property + '__viewSort'] = row[column.property]
      return [<span class="text">{row[column.property]}</span>]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      const { props } = renderOpts
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-textarea', {
            ref: 'vxe-textarea' + property,
            props: {
              value: data[property],
              ...props
            },
            on: {
              input(value) {
                data[property] = value
                defaultGloabalUtils.debounceItemChange(() => {
                  $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts })
                })
              }
            }
          })
        ]
      } else {
        return [
          <span class="tl fn-inline" {...{ props }}> {data[property]} </span>
        ]
      }
    }
  },
  $vxeDays: {
    autofocus: '.vxe-input--inner',
    // 天数渲染器，不足0.25天按0记，大于0.75天按1天记，其他按0.5天记
    renderCell(h, { props }, { row, column }) {
      let quiteDay = row[column.property] % 1
      quiteDay = quiteDay <= 0.25 ? 0 : (quiteDay >= 0.75 ? 1 : 0.5)
      row[column.property] = Math.floor(row[column.property] / 1) + quiteDay
      row[column.property + '__viewSort'] = row[column.property]
      return [<span>{row[column.property]}</span>]
    },
    renderDefault(h, { props }, { row, column }) {
      let quiteDay = row[column.property] % 1
      quiteDay = quiteDay <= 0.25 ? 0 : (quiteDay >= 0.75 ? 1 : 0.5)
      row[column.property] = Math.floor(row[column.property] / 1) + quiteDay
      row[column.property + '__viewSort'] = row[column.property]
      return [<span>{row[column.property]}</span>]
    },
    renderEdit(h, { props }, { row, column }) {
      return [
        <vxe-input
          placeholder = "请输入天数"
          type="number"
          clearable
          { ...{ props } }
          v-model={row[column.property]}
        ></vxe-input>
      ]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props } = renderOpts
      props = props || {}
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              placeholder: '请输入天数',
              type: 'number',
              clearable: true,
              value: data[property],
              ...props
            },
            on: {
              input(value) {
                clearTimeout(data['timer_' + property])
                data['timer_' + property] = setTimeout(() => {
                  let quiteDay = data[property] % 1
                  quiteDay = quiteDay <= 0.25 ? 0 : (quiteDay >= 0.75 ? 1 : 0.5)
                  data[property] = Math.floor(data[property] / 1) + quiteDay
                  data[property] = value
                  $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts })
                  clearTimeout(data['timer_' + property])
                })
              }
            }
          })
        ]
      } else {
        return [
          <span class="tc fn-inline" {...{ props }}> {data[property]} </span>
        ]
      }
    }
  },
  $vxeTime: {
    autofocus: '.vxe-input--inner',
    // 时间格式化渲染器
    renderCell(h, { props }, { row, column }) {
      props = props || {}
      props.format = props.format || 'YYYY-MM-DD hh:mm:ss'
      let dateTime = (row[column.property] + '').replace(/null|undefined/ig, '')
      if (dateTime) {
        let date = dateTime.length === 8 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) : (dateTime.length === 14 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) + ' ' + dateTime.substring(8, 10) + ':' + dateTime.substring(10, 12) + ':' + dateTime.substring(12, 14) : dateTime)
        row[column.property + '__viewSort'] = isNaN(new Date(dateTime).getTime()) ? new Date(date).format(props.format) : new Date(dateTime).format(props.format)
      } else {
        row[column.property + '__viewSort'] = ''
      }
      return [<span>{ row[column.property + '__viewSort'] }</span>]
    },
    renderDefault(h, { props }, { row, column }) {
      props = props || {}
      props.format = props.format || 'YYYY-MM-DD hh:mm:ss'
      let dateTime = (row[column.property] + '').replace(/null|undefined/ig, '')
      if (dateTime) {
        let date = dateTime.length === 8 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) : (dateTime.length === 14 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) + ' ' + dateTime.substring(8, 10) + ':' + dateTime.substring(10, 12) + ':' + dateTime.substring(12, 14) : dateTime)
        row[column.property + '__viewSort'] = isNaN(new Date(dateTime).getTime()) ? new Date(date).format(props.format) : new Date(dateTime).format(props.format)
      } else {
        row[column.property + '__viewSort'] = ''
      }
      return [<span>{ row[column.property + '__viewSort'] }</span>]
    },
    renderEdit(h, { props }, { row, column }) {
      return [
        h('vxe-input', {
          ref: 'vxe-input' + column.property,
          props: {
            placeholder: '请选择时间',
            type: 'date',
            clearable: true,
            value: row[column.property + '__viewSort'],
            ...props,
            transfer: true
          },
          on: {
            input(value) {
              row[column.property + '__viewSort'] = value ? new Date(value).format(props.format) : ''
              // eslint-disable-next-line no-useless-escape
              row[column.property] = row[column.property + '__viewSort'].replace(/[-\/:\s]/ig, '')
            }
          }
        })
      ]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props } = renderOpts
      props = props || {}
      props.format = props.format || 'YYYY-MM-DD hh:mm:ss'
      let dateTime = (data[property] + '').replace(/null|undefined/ig, '')
      if (dateTime) {
        let date = dateTime.length === 8 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) : (dateTime.length === 14 ? dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8) + ' ' + dateTime.substring(8, 10) + ':' + dateTime.substring(10, 12) + ':' + dateTime.substring(12, 14) : dateTime)
        data[property + '__viewSort'] = isNaN(new Date(dateTime).getTime()) ? new Date(date).format(props.format) : new Date(dateTime).format(props.format)
      } else {
        data[property + '__viewSort'] = ''
      }
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              placeholder: '请选择时间',
              type: 'date',
              clearable: true,
              value: data[property + '__viewSort'],
              ...props,
              transfer: true
            },
            on: {
              input(value) {
                debugger
                data[property + '__viewSort'] = value ? new Date(value).format(props.format) : ''
                // eslint-disable-next-line no-useless-escape
                data[property] = value
                // data[property] = data[property + '__viewSort'].replace(/[-\/:\s]/ig, '')
                $form.$parent.itemChange({ $form, property, itemValue: data[property], itemViewValue: data[property + '__viewSort'], data, renderOpts })
              }
            }
          })
        ]
      } else {
        return [
          <span class="tc fn-inline" {...{ props }}> {data[property + '__viewSort']} </span>
        ]
      }
    }
  },
  $vxeRadio: {
    renderEdit(h, { options, props, propsC }, { row, column }) {
      props = props || {}
      propsC = propsC || {}
      return [
        <vxe-radio-group {...{ props }} v-model={row[column.property]} placeholder="请选择">
          {options.map((item, index) => {
            return [
              <vxe-radio
                label={item.value}
                { ...{ propsC } }
              >
                {item.label}
              </vxe-radio>
            ]
          })}
        </vxe-radio-group>
      ]
    },
    renderDefault(h, { options, props }, { row, column }, context) {
      let value = ''
      options.forEach((item, index) => {
        if (row[column.property] === item.value) {
          value = item.label
        }
      })
      row[column.property + '__viewSort'] = value
      return [<span>{value}</span>]
    },
    renderCell(h, { options, props }, { row, column }) {
      let value = ''
      options.forEach((item, index) => {
        if (row[column.property] === item.value) {
          value = item.label
        }
      })
      row[column.property + '__viewSort'] = value
      return [<span>{value}</span>]
    },
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props, propsC, options } = renderOpts
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-radio-group', {
            props: {
              value: data[property],
              ...props
            },
            on: {
              change({ $event, label }) {
                data[property] = label
                $form.$parent.itemChange({ $form, property, itemValue: label, data, renderOpts })
              }
            }
          }, options.map(item => {
            return h('vxe-radio', {
              props: {
                label: item.value,
                ...propsC
              }
            }, item.label)
          }))
        ]
      } else {
        return [
          h('vxe-radio-group', {
            props: {
              value: data[property],
              ...props
            },
            on: {
              change({ $event, label }) {
                data[property] = label
                $form.$parent.itemChange({ $form, property, itemValue: label, data, renderOpts })
              }
            }
          }, options.map(item => {
            return h('vxe-radio', {
              props: {
                disabled: item.value !== data[property],
                label: item.value,
                ...propsC
              }
            }, item.label)
          }))
        ]
      }
    }
  },
  $vxeEditDownJson: {
    autofocus: '.vxe-input--inner',
    renderEdit(h, renderOpts, params) {
      return [
        <edit-down-json type={'table'} params={ params } ></edit-down-json>
      ]
    },
    renderDefault(h, cellRender, { row, column }, context) {
      let value = JSON.stringify(row[column.property])
      row[column.property + '__viewSort'] = value
      return [<span class="text">{value}</span>]
    },
    renderCell(h, cellRender, { row, column }, context) {
      let value = JSON.stringify(row[column.property])
      row[column.property + '__viewSort'] = value
      return [<span class="text">{value}</span>]
    },
    renderItem(h, renderOpts, params) {
      const { $form, property, data } = params
      if ($form.$parent.editable !== false) {
        return [
          h('edit-down-json', {
            props: {
              params: params
            },
            on: {
              input(value) {
                defaultGloabalUtils.debounceItemChange(() => {
                  $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts })
                })
              }
            }
          })
        ]
      } else {
        return [
          <edit-down-json type={'form'} params={ params }></edit-down-json>
        ]
      }
    }
  },
  $vxeIntervar: {
    autofocus: '.vxe-input--inner',
    // 阶段选择 渲染器 基础版本
    renderCell(h, { props }, params) {
      const { row, column } = params
      const propertyArr = column.property.split('##')
      row[column.property] = row[propertyArr[0]] + '##' + row[propertyArr[1]]
      row[column.property + '__viewSort'] = row[propertyArr[0]] + '至' + row[propertyArr[1]]
      return [
        <EditIntervarInput constProps = { props } params={ params } type='table' editable={false}></EditIntervarInput>
      ]
    },
    renderDefault(h, { props }, params) {
      const { row, column } = params
      const propertyArr = column.property.split('##')
      row[column.property] = row[propertyArr[0]] + '##' + row[propertyArr[1]]
      row[column.property + '__viewSort'] = row[propertyArr[0]] + '至' + row[propertyArr[1]]
      return [
        <EditIntervarInput constProps = { props } params={ params } type='table' editable={false}></EditIntervarInput>
      ]
    },
    renderEdit(h, { props }, params) {
      return [
        <EditIntervarInput constProps={ props } params={ params } type='table' editable={true}></EditIntervarInput>
      ]
    },
    renderItem(h, renderOpts, params) {
      const { $form, property, data } = params
      const { props } = renderOpts
      const propertyArr = property.split('##')
      if ($form.$parent.editable !== false) {
        return [
          h('EditIntervarInput', {
            props: {
              value: data[property],
              constProps: props,
              params: params,
              type: 'form',
              editable: true
            },
            on: {
              input(value) {
                const valueArr = value.split('##')
                $form.$parent.itemChange({
                  $form,
                  property,
                  itemValue: {
                    [propertyArr[0]]: valueArr[0],
                    [propertyArr[1]]: valueArr[1]
                  },
                  data,
                  renderOpts })
              }
            }
          })
        ]
      } else {
        return [
          <EditIntervarInput constProps = { props } params={ params } type='form' editable={false}></EditIntervarInput>
        ]
      }
    }
  },
  $vxeSwitch: {
    // 开关
    // props: {
    //   options: [
    //     { label: '是', value: 1 },
    //     { label: '否', value: 0 }
    //   ]
    // }
    renderCell(h, { props, options }, { row, column }) {
      return [
        <vxe-switch v-model={row[column.property]} open-label={ options[0].label } close-label={ options[1].label } open-value={ options[0].value } close-value={ options[1].value } disabled></vxe-switch>
        // <el-switch
        //   {...{ props }}
        //   active-text={ options[0].label }
        //   inactive-text={ options[1].label }
        //   v-model={row[column.property]}
        //   active-color="#13ce66"
        //   active-value={ options[0].value }
        //   inactive-value={ options[1].value }>
        // </el-switch>
      ]
    },
    renderDefault(h, { props, options }, { row, column }) {
      return [
        <vxe-switch v-model={row[column.property]} open-label={ options[0].label } close-label={ options[1].label } open-value={ options[0].value } close-value={ options[1].value } disabled></vxe-switch>

        // <el-switch
        //   {...{ props }}
        //   active-text={ options[0].label }
        //   inactive-text={ options[1].label }
        //   v-model={row[column.property]}
        //   active-color="#13ce66"
        //   active-value={ options[0].value }
        //   inactive-value={ options[1].value }>
        // </el-switch>
      ]
    },
    renderEdit(h, { props, options }, { row, column }) {
      return [
        <vxe-switch v-model={row[column.property]} open-label={ options[0].label } close-label={ options[1].label } open-value={ options[0].value } close-value={ options[1].value }></vxe-switch>
        // <el-switch
        //   {...{ props }}
        //   active-text={ options[0].label }
        //   inactive-text={ options[1].label }
        //   v-model={row[column.property]}
        //   active-color="#13ce66"
        //   active-value={ options[0].value }
        //   inactive-value={ options[1].value }>
        // </el-switch>
      ]
    },
    renderItem(h, renderOpts, params) {
      const { $form, property, data } = params
      const { options } = renderOpts
      if ($form.$parent.editable !== false) {
        return [
          h('vxe-switch', {
            props: {
              value: data[property],
              openLabel: options[0].label,
              closeLabel: options[1].label,
              openValue: options[0].value,
              closeValue: options[1].value
            },
            on: {
              input(value) {
                data[property] = value
                $form.$parent.itemChange({
                  $form,
                  property,
                  itemValue: value,
                  data,
                  renderOpts })
              }
            }
          })
        ]
      } else {
        return [
          h('vxe-switch', {
            props: {
              value: data[property],
              openLabel: options[0].label,
              closeLabel: options[1].label,
              openValue: options[0].value,
              closeValue: options[1].value,
              disabled: true
            },
            on: {
              input(value) {
              }
            }
          })
        ]
      }
    }
  },
  $vxeProgress: {
    // 进度条
    renderCell(h, { props, options }, { row, column }) {
      row[column.property] = parseFloat((row[column.property] + '').replace(/null|undefined|\s+/ig, ''))
      return [
        <el-progress text-inside={true} stroke-width={ 20 } percentage={row[column.property]} style="line-height:30px"></el-progress>
      ]
    },
    renderDefault(h, { props, options }, { row, column }) {
      row[column.property] = parseFloat((row[column.property] + '').replace(/null|undefined|\s+/ig, ''))
      return [
        <el-progress text-inside={true} stroke-width={ 20 } percentage={row[column.property]} style="line-height:30px"></el-progress>
      ]
    },
    renderEdit(h, { props, options }, { row, column }) {
      row[column.property] = parseFloat((row[column.property] + '').replace(/null|undefined|\s+/ig, ''))
      return [
        <el-progress text-inside={true} stroke-width={ 20 } percentage={row[column.property]} style="line-height:30px"></el-progress>
      ]
    }
  },
  $vxeEditDownConditions: {
    autofocus: '.vxe-input--inner',
    renderEdit(h, { name, options, props }, params) {
      return [
        <edit-down-conditions constProps={ props } params={ params } type='table'></edit-down-conditions>
      ]
    },
    renderDefault(h, cellRender, { row, column }, context) {
      row[column.property + '__viewSort'] = row[column.property]
      return [<span class="text">{row[column.property]}</span>]
    },
    renderCell(h, cellRender, { row, column }, context) {
      row[column.property + '__viewSort'] = row[column.property]
      return [<span class="text">{row[column.property]}</span>]
    },
    renderItem(h, renderOpts, params) {
      const { props } = renderOpts
      const { $form, property, data } = params
      if ($form.$parent.editable !== false) {
        return [
          h('edit-down-conditions', {
            props: {
              constProps: props,
              params: params,
              type: 'form'
            },
            on: {
              input(value) {
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts })
              }
            }
          })
        ]
      } else {
        return [
          <edit-down-conditions constProps={ props } params={ params } type='form'></edit-down-conditions>
        ]
      }
    }
  }
}
// 全局提供表格特有渲染器 5组，分别为：手动排序渲染器，超链接渲染器，嵌套表渲染器，空数据渲染器，操作列渲染器。
// 评测设计阶段渲染器1组，为动态项定制渲染器（评测和developing），
const defaultTableRenderers = {
  // 表格特有全局渲染器
  $vxeTableOptionSort: {
    // 固定手动排序渲染
    renderDefault(h, cellRender, { $columnIndex, $rowIndex, items, column, data, row, $seq, columnIndex, isEdit, level, rowIndex, seq }, { $excel, $grid, $table, $type }) {
      let self = $grid.$parent
      // <a class="optionRow" href={row.link}>{'操作' + row[column.property]}</a>
      return [
        <div class="row-dragsort-option row-option-group">
          <a class="optionRow-upSort fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'upSort' })}>上移</a>
          <a class="optionRow-downSort fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'downSort' })}>下移</a>
          <a class="optionRow-topSort fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'topSort' })}>置顶</a>
          <a class="optionRow-bottomSort fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'bottomSort' })}>置底</a>
        </div>
      ]
    }
  },
  $vxeTableHref: {
    // 文本渲染
    renderCell(h, renderOpts, { row, column }) {
      return [<span class="text href-a"><a>{row[column.property]}</a></span>]
    },
    renderEdit(h, renderOpts, { row, column }) {
      return [<span class="text href-a"><a>{row[column.property]}</a></span>]
    },
    renderDefault(h, renderOpts, { row, column }) {
      return [<span class="text href-a"><a>{row[column.property]}</a></span>]
    }
  },
  $vxeTableContentTable: {
    renderExpand(h, { props }, params, context) {
      // const tableConfig = {
      //   globalConfig: { // 全局默认渲染列配置
      //     // 全局配置
      //     checkType: '',
      //     seq: false
      //   }
      // }
      // return [
      //   <BsTable toolbarConfig={false} pagerConfig={false} tableConfig={ tableConfig } { ...{ props }} height="unset" tableColumnsConfig={ row.childCols } tableData={ row.childData }></BsTable>
      // ]
      let { row } = params
      let propsN = Object.assign({}, context.$grid.$parent.contentTableConfig, props)
      return [
        h('BsTable', {
          props: {
            ...propsN,
            height: 'unset',
            tableColumnsConfig: row.childCols,
            tableData: row.childData
          },
          on: {
            ProxyEvent() {
              let arg = [...arguments]
              context.$grid.$parent.$emit('ProxyEventContentTable', arg[0], Object.assign(arg[1], { ParentsParams: params }), ...arg.slice(2))
            }
          }
        })
      ]
    }
  },
  $vxeNotData: {
    // 空内容模板
    renderEmpty(h, renderOpts) {
      return [
        <div>
          <span>
            <p>亲，没有更多数据了！</p>
          </span>
        </div>
      ]
    }
  },
  $vxeTableOptionRow: {
    // 操作列渲染
    renderDefault(h, renderOpts, params, context) {
      let self = context.$grid.$parent
      const { props } = renderOpts
      const { row, column } = params
      const { statusField, options } = props
      let renderOption = options[row[statusField]]
      if (renderOption) {
        return [
          <div class="row-option row-option-group">
            {
              renderOption.map((item, index) => {
                if (item.type === 'button') {
                  return <vxe-button class={item.class || ''} status={item.btnStatus} on-click={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</vxe-button>
                } else {
                  return <a title={item.label} class={'fn-inline f14 ' + item.class || 'fn-inline f14'} status={item.btnStatus} onClick={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</a>
                }
              })
            }
          </div>
        ]
      } else {
        renderOption = options['default']
        if (renderOption) {
          return [
            <div class="row-option row-option-group">
              {
                renderOption.map((item, index) => {
                  if (item.type === 'button') {
                    return <vxe-button class={item.class || ''} status={item.btnStatus} on-click={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</vxe-button>
                  } else {
                    return <a title={item.label} class={'fn-inline f14 ' + item.class || 'fn-inline f14'} status={item.btnStatus} onClick={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</a>
                  }
                })
              }
            </div>
          ]
        } else {
          return ''
        }
      }
    },
    renderCell(h, renderOpts, params, context) {
      let self = context.$grid.$parent
      const { props } = renderOpts
      const { row, column } = params
      const { statusField, options } = props
      let renderOption = options[row[statusField]]
      if (renderOption) {
        return [
          <div class="row-option row-option-group">
            {
              renderOption.map((item, index) => {
                if (item.type === 'button') {
                  return <vxe-button class={item.class || ''} status={item.btnStatus} on-click={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</vxe-button>
                } else {
                  return <a title={item.label} class={'fn-inline f14 ' + item.class || 'fn-inline f14'} status={item.btnStatus} onClick={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</a>
                }
              })
            }
          </div>
        ]
      } else {
        renderOption = options['default']
        if (renderOption) {
          return [
            <div class="row-option row-option-group">
              {
                renderOption.map((item, index) => {
                  if (item.type === 'button') {
                    return <vxe-button class={item.class || ''} status={item.btnStatus} on-click={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</vxe-button>
                  } else {
                    return <a title={item.label} title={item.label} class={'fn-inline f14 ' + item.class || 'fn-inline f14'} status={item.btnStatus} onClick={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</a>
                  }
                })
              }
            </div>
          ]
        } else {
          return ''
        }
      }
    },
    renderEdit(h, renderOpts, params, context) {
      let self = context.$grid.$parent
      const { props } = renderOpts
      const { row, column } = params
      const { statusField, options } = props
      let renderOption = options[row[statusField]]
      if (renderOption) {
        return [
          <div class="row-option row-option-group">
            {
              renderOption.map((item, index) => {
                if (item.type === 'button') {
                  return <vxe-button class={item.class || ''} status={item.btnStatus} on-click={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</vxe-button>
                } else {
                  return <a title={item.label} class={'fn-inline f14 ' + item.class || 'fn-inline f14'} status={item.btnStatus} onClick={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</a>
                }
              })
            }
          </div>
        ]
      } else {
        renderOption = options['default']
        if (renderOption) {
          return [
            <div class="row-option row-option-group">
              {
                renderOption.map((item, index) => {
                  if (item.type === 'button') {
                    return <vxe-button class={item.class || ''} status={item.btnStatus} on-click={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</vxe-button>
                  } else {
                    return <a title={item.label} class={'fn-inline f14 ' + item.class || 'fn-inline f14'} status={item.btnStatus} onClick={() => self.onOptionRowClick({ row, column, optionType: item.code })}>{item.label}</a>
                  }
                })
              }
            </div>
          ]
        } else {
          return ''
        }
      }
    }
  },
  $vxeTableCustomRender: {
    // 通用自定义渲染（developing）
    renderDefault(h, renderOpts, params, context) {
      const { column } = params
      // <template slot-scope="{ row, index }" slot="dateNo"></template>
      return [
        <div class="table-custom-render">
          <slot name={'CellDefaultSlot' + column.property } params={ params }></slot>
        </div>
      ]
    },
    renderCell(h, renderOpts, params, context) {
      const { column } = params
      // <template slot-scope="{ row, index }" slot="dateNo"></template>
      return [
        <div class="table-custom-render">
          <slot name={'CellSlot' + column.property } params={ params }></slot>
        </div>
      ]
    },
    renderEdit(h, renderOpts, params, context) {
      const { column } = params
      // <template slot-scope="{ row, index }" slot="dateNo"></template>
      return [
        <div class="table-custom-render">
          <slot name={'CellEditSlot' + column.property } params={ params }></slot>
        </div>
      ]
    },
    renderItem(h, renderOpts, params, context) {
      const { property } = params
      // <template slot-scope="{ row, index }" slot="dateNo"></template>
      return [
        <div class="table-custom-render">
          <slot name={'itemSlot' + property } params={ params }></slot>
        </div>
      ]
    }
  }
  // $vxeTableDynamicSelect: {
  //   // 废弃
  //   renderEdit(h, { props, options }, { row, column }, { $excel, $grid, $table, $type }) {
  //     row.options = row.options || []
  //     return [
  //       <vxe-select v-model={row[column.property]} placeholder="请选择">
  //         {row.options.map((item, index) => {
  //           return [
  //             <vxe-option
  //               value={item.value}
  //               label={item.label}
  //             ></vxe-option>
  //           ]
  //         })}
  //       </vxe-select>
  //     ]
  //   },
  //   renderDefault(h, cellRender, { row, column }, context) {
  //     return [<span>{row[column.property]}</span>]
  //   },
  //   renderCell(h, renderOpts, { row, column }) {
  //     return [<span>{row[column.property]}</span>]
  //   }
  // }
}
// 全局提供form特有渲染器 1组，为分组标题渲染器（developing）
const defaultFormRenderers = {
  // 表单特有全局渲染器
  $vxeFormGroupTitle: {
    renderItem(h, renderOpts, { $form, data, property }) {
      let gooupTitle = ''
      $form.items.forEach((item, index) => {
        if (item.field === property) {
          item.span = 24
          gooupTitle = item.groupTitle
        }
      })
      return [
        <div class="form-group-title" >
          <i class="fn-inline"></i>
          <span class="fn-inline">
            {gooupTitle}
          </span>
          <em class="fn-inline"></em>
        </div>
      ]
    }
  }
}
// 全局提供过滤器 4组，分别为数值型渲染器，分组型数据渲染器，文本型过滤渲染器，下拉选择型数据过滤器（评测和developing）
const tablefilterRenderers = {
  FilterComplex: {
    // 不显示底部按钮，使用自定义的按钮
    isFooter: false,
    // 筛选模板
    renderFilter(h, renderOpts, params) {
      return [
        <FilterComplex params = { params } ></FilterComplex>
      ]
    },
    // 重置数据方法
    filterResetMethod({ options, column }) {
      const { editRender, cellRender } = column.own
      let render = editRender || cellRender
      if (render && filterTypeMap[render.name]) {
        options[0].data = Object.assign({}, filterTypeMap[render.name].filters)
      } else {
        options[0].data = { type: 'has', isCase: false, value: '', dataType: 'float', valuegt: '' }
      }
      // options.forEach(option => {
      //   option.data = { type: 'has', isCase: false, value: '', dataType: 'float', valuegt: '' }
      // })
    },
    // 筛选数据方法
    filterMethod({ option, row, column }) {
      let cellValue = row[column.property]
      let { type, isCase, value, valuegt, dataType, format } = option.data
      if (cellValue) {
        if (isCase) {
          cellValue = cellValue.toLowerCase()
          value = value.toLowerCase()
        }
      }
      if (['float', 'number', 'integer'].indexOf(dataType) >= 0) {
        switch (type) {
          case 'has':
            return String(cellValue).indexOf(value) > -1
          case 'eq':
          /* eslint-disable eqeqeq */
            if (isCase) {
              return cellValue == value
            } else {
              return parseFloat(cellValue) == parseFloat(value)
            }
          case 'gt':
            return Number(cellValue) > Number(value)
          case 'lt':
            return Number(value) > Number(cellValue)
          case 'ltgt':
            return Number(cellValue) >= Number(value) && Number(cellValue) <= Number(valuegt)
          case 'null':
            return (cellValue + '').replace(/null|undefined|\k+/ig, '') === ''
        }
      } else if (['date', 'time', 'datetime', 'week', 'month', 'year'].indexOf(dataType) >= 0) {
        switch (type) {
          case 'has':
            return String(cellValue).indexOf(value) > -1
          case 'eq':
          /* eslint-disable eqeqeq */
            return new Date(value).format(format) === cellValue
          case 'gt':
            return cellValue > new Date(value).format(format)
          case 'lt':
            return new Date(value).format(format) > cellValue
          case 'ltgt':
            return cellValue >= new Date(value).format(format) && cellValue <= new Date(valuegt).format(format)
          case 'null':
            return (cellValue + '').replace(/null|undefined|\k+/ig, '') === ''
        }
      }
      return true
    }
  },
  FilterContent: {
  // 不显示底部按钮，使用自定义的按钮
    isFooter: false,
    // 筛选模板
    renderFilter (h, renderOpts, params) {
      return [
        <filter-content params={ params }></filter-content>
      ]
    },
    // 重置数据方法
    filterResetMethod ({ options }) {
      options.forEach(option => {
        option.data = { vals: [], sVal: '' }
      })
    },
    // 筛选数据方法
    filterMethod({ option, row, column }) {
      const { vals } = option.data
      if (Array.isArray(vals) && vals.length) {
        const cellValue = row[column.property]
        if (String(cellValue).indexOf('##') > 0) {
          let value = cellValue.split('##')
          value.shift()
          return cellValue == value.join('-')
        }
        return vals.includes(cellValue)
      } else {
        return true
      }

      // debugger
      // console.log(option, row, column, row[column.property])
      // const { vals } = option.data
      // const cellValue = row[column.property]
      // /* eslint-disable eqeqeq */
      // return vals.some(val => {
      //   if (cellValue.indexOf('##') > 0) {
      //     let value = cellValue.split('##')
      //     value.shift()
      //     return val == value.join('-')
      //   } else {
      //     console.log(option, row, column, val == cellValue)
      //     return val == cellValue
      //   }
      //   //  return val == cellValue
      // })
    }
  },
  FilterInput: {
    // 筛选模板
    // filters: [{ data: '' }],
    // filterRender: { name: 'FilterInput' },
    renderFilter(h, renderOpts, params) {
      return [
        <filter-input params={params}></filter-input>
      ]
    },
    // 筛选方法
    filterMethod({ option, row, column }) {
      const { data } = option
      let cellValue = row[column.property]
      return String(cellValue).toLowerCase().indexOf(data.toLowerCase()) > -1
    }
  },
  FilterSelect: {
    isFooter: false,
    // 筛选模板
    // filters: [{ data: '' }],
    // filterRender: { name: 'FilterInput' },
    renderFilter(h, renderOpts, params) {
      return [
        <filter-Select renderOpts={ renderOpts } params={params}></filter-Select>
      ]
    },
    filterResetMethod({ options }) {
      options.forEach(option => {
        option.data = { vals: [], sVal: '' }
      })
    },
    // 筛选方法
    filterMethod({ option, row, column }) {
      const { options, data } = option
      const { vals } = data
      let cellValue = row[column.property]
      let value = []
      options.forEach((item, index) => {
        if (String(cellValue).indexOf(item.value) >= 0) {
          value.push(item.label)
        }
      })
      return value.some((item) => {
        return vals.indexOf(item) >= 0
      })
    }
  }
}
export default {
  ...defaultPublicRenders,
  ...defaultTableRenderers,
  ...defaultFormRenderers,
  ...tablefilterRenderers
}

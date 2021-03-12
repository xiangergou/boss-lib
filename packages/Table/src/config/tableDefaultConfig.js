/* eslint-disable no-new-wrappers */
/* eslint-disable no-eval */
// tableDefaultConfig   Author:Titans@2396757591@qq.com
/* eslint-disable no-new-wrappers no-useless-escape */

// 下列渲染器 过滤器已经废弃 参见 Table/config/defaultRenders.js
const defaultGloabalUtils = {
  calculateRender(h, { props, name }, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
    props = props || {}
    let val = isNaN(parseFloat(row[column.property])) ? '' : parseFloat(row[column.property])
    if (val !== '') {
      row[column.property] = val.toFixed(2)
      if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
        val = Number((val).toFixed(2)).toLocaleString()
        val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
        return [<span class="text" {...{ props }} >{val}</span>]
      } else {
        let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
        val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
        val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
        return [<span class="text" {...{ props }} >{val}</span>]
      }
    } else {
      return [<span class="text" {...{ props }} ></span>]
    }
  },
  calculateRender_old(h, renderOpts, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
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
    if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
      val = Number((val).toFixed(2)).toLocaleString()
      val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
      return [<span class="text" >{val}</span>]
    } else {
      let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
      val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
      val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
      return [<span>{val}</span>]
    }
  },
  calculateFooter({ columns, data, $table, $grid, columnIndexText, combinedType }, context) {
    // let moneyUnit = $grid.$parent.moneyUnit ? $grid.$parent.moneyUnit : 1
    // console.log(moneyUnit)
    return columns.map((column, columnIndex) => {
      //  combinedType: ['average', 'total'],
      // let combinedType = 'total'
      if (columnIndex === 0) {
        return columnIndexText
      } else if ((column.own.combinedType + '').split(',').indexOf(combinedType) >= 0) {
        try {
          let result = data.map((item, index) => {
            let value = (typeof (item[column.property]) === 'number' || typeof (item[column.property]) === 'string') ? parseFloat(item[column.property].toString().split(',').join('')) : 0
            return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
          })
          if (result.length) {
            result = result.reduce((prev, next) => {
              return prev + next
            })
            if (combinedType === 'average') {
              result = result / data.length
            }
            result = Number((result).toFixed(2)).toLocaleString()
            result = result.split('.').length === 1 ? result + '.00' : (result.split('.')[1].length === 1 ? result + '0' : result)
            return result
          } else {
            return '0.00'
          }
        } catch (e) {
          throw (e)
        }
      } else {
        return ''
      }
    })
  },
  calculateFooter_average({ columns, data, $table, $grid }) {
    // console.log(moneyUnit)
    return columns.map((column, columnIndex) => {
      //  combinedType: ['average', 'total'],
      // let combinedType = 'total'
      if (columnIndex === 0) {
        return '平均'
      } else if ((column.own.combinedType + '').split(',').indexOf('average') >= 0) {
        try {
          let result = data.map((item, index) => {
            let value = (typeof (item[column.property]) === 'number' || typeof (item[column.property]) === 'string') ? parseFloat(item[column.property].toString().split(',').join('')) : 0
            return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
          })
          if (result.length) {
            result = result.reduce((prev, next) => {
              return prev + next
            })
            result = result / data.length
            return result
          } else {
            return '0.00'
          }
        } catch (e) {
          throw (e)
        }
      } else {
        return ''
      }
    })
  },
  calculateFooter_subTotal({ columns, data, $table, $grid }) {
    // console.log(moneyUnit)
    let selections = $grid.getCheckboxRecords()
    return columns.map((column, columnIndex) => {
      //  combinedType: ['average', 'total'],
      // let combinedType = 'total'
      if (columnIndex === 0) {
        return '已选(' + $grid.getCheckboxRecords().length + ')'
      } else if ((column.own.combinedType + '').split(',').indexOf('subTotal') >= 0) {
        try {
          let result = selections.map((item, index) => {
            let value = (typeof (item[column.property]) === 'number' || typeof (item[column.property]) === 'string') ? parseFloat(item[column.property].toString().split(',').join('')) : 0
            return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
          })
          if (result.length) {
            result = result.reduce((prev, next) => {
              return prev + next
            })
            return result
          } else {
            return '0.00'
          }
        } catch (e) {
          throw (e)
        }
      } else {
        return ''
      }
    })
  },
  calculateFooter_total({ columns, data, $table, $grid }) {
    // console.log(moneyUnit)
    return columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合计'
      } else if ((column.own.combinedType + '').split(',').indexOf('total') >= 0) {
        try {
          let result = data.map((item, index) => {
            let value = (typeof (item[column.property]) === 'number' || typeof (item[column.property]) === 'string') ? parseFloat(item[column.property].toString().split(',').join('')) : 0
            return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
          })
          if (result.length) {
            result = result.reduce((prev, next) => {
              return prev + next
            })
            return result
          } else {
            return '0.00'
          }
        } catch (e) {
          throw (e)
        }
      } else {
        return ''
      }
    })
  },
  calculateFooter_totalAll({ columns, data, $table, $grid }) {
    // console.log(moneyUnit)
    let item = $grid.$parent.footerConfigIn.totalObj || {}
    return columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '总计'
      } else if ((column.own.combinedType + '').split(',').indexOf('total') >= 0) {
        try {
          let result = (typeof (item[column.property]) === 'number' || typeof (item[column.property]) === 'string') ? parseFloat(item[column.property].toString().split(',').join('')) : 0
          return result
        } catch (e) {
          throw (e)
        }
      } else {
        return ''
      }
    })
  }
}

// 废弃开始
const cellRenderers = {
  // 全局渲染器
  // cellRender渲染器名字配置
  // autofocus 自动聚焦的类名
  // renderHeader(h, renderOpts, params) 表头
  // renderEdit(h, renderOpts, params) 表内容 - 编辑
  // renderCell(h, renderOpts, params) 表内容 - 显示
  // renderFooter(h, renderOpts, params) 表尾
  // editCellExportMethod(params) 单元格导出函数
  // footerCellExportMethod(params) 表尾单元格导出函数
  NotData: {
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
  $calculateRender: {
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
    }
  },
  $moneyRender: {
    // 输入框
    renderDefault(h, { props }, { row, column }, context) {
      props = props || {}
      let val = isNaN(parseFloat(row[column.property])) ? '' : parseFloat(row[column.property])
      if (val !== '') {
        row[column.property] = val.toFixed(2)
        if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
          val = Number((val).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          return [<span class="text" {...{ props }} >{val}</span>]
        } else {
          let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
          val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          return [<span class="text" {...{ props }} >{val}</span>]
        }
      } else {
        return [<span class="text" {...{ props }} ></span>]
      }
    },
    renderEdit(h, { props }, { row, column }) {
      // let val = isNaN(parseFloat(row[column.property])) ? '0.00' : parseFloat(row[column.property])
      // row[column.property] = val
      props = props || {}
      // <vxe-input v-model="value504" placeholder="小数间隔 2.3" type="float" step="2.3" clearable></vxe-input>
      return [
        <vxe-input
          v-model={row[column.property]}
          step={ 1 }
          type="float"
          min = { 0.00 }
          {...{ props }}
          max={1000000000000}
          placeholder="可清除"
          clearable
        ></vxe-input>
        // <input class="my-cell" text="text" v-model={ row[column.property] } />
      ]
    },
    renderCell(h, { props }, { row, column }, context) {
      props = props || {}
      let val = isNaN(parseFloat(row[column.property])) ? '' : parseFloat(row[column.property])
      if (val !== '') {
        row[column.property] = val.toFixed(2)
        if (context.$grid.$parent.toolbarConfigInCopy.disabledMoneyConversion) {
          val = Number((val).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          return [<span class="text" {...{ props }} >{val}</span>]
        } else {
          let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
          val = Number((val / moneyUnit).toFixed(2)).toLocaleString()
          val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
          return [<span class="text" {...{ props }} >{val}</span>]
        }
      } else {
        return [<span class="text" {...{ props }}></span>]
      }
    }
  },
  $treeText: {
    renderDefault(h, cellRender, { row, column }, context) {
      const name = row[`${column.property}name`] === ' ' ? '' : row[`${column.property}name`]
      const code = row[`${column.property}code`] === ' ' ? '' : row[`${column.property}code`]
      const noCode = cellRender.props && cellRender.props.noCode
      const treelineData = cellRender.props && cellRender.props.treelineData
      let text = ''
      if (treelineData) {
        text = row[`${column.property}`] ? row[`${column.property}`] : ''
      } else {
        if (name) {
          text = noCode ? `${name}` : (code ? `${code}-${name}` : `${name}`)
        }
      }

      return [<span class="text">{text}</span>]
    },
    renderCell(h, cellRender, { row, column }, context) {
      const name = row[`${column.property}name`] === ' ' ? '' : row[`${column.property}name`]
      const code = row[`${column.property}code`] === ' ' ? '' : row[`${column.property}code`]
      const noCode = cellRender.props && cellRender.props.noCode
      const treelineData = cellRender.props && cellRender.props.treelineData
      let text = ''
      if (treelineData) {
        text = row[`${column.property}`] ? row[`${column.property}`] : ''
      } else {
        if (name) {
          text = noCode ? `${name}` : (code ? `${code}-${name}` : `${name}`)
        }
      }

      return [<span class="text">{text}</span>]
    },
    renderEdit(h, cellRender, { row, column }, context) {
      const name = row[`${column.property}name`] === ' ' ? '' : row[`${column.property}name`]
      const code = row[`${column.property}code`] === ' ' ? '' : row[`${column.property}code`]
      const noCode = cellRender.props && cellRender.props.noCode
      let text = ''
      if (name) {
        text = noCode ? `${name}` : (code ? `${code}-${name}` : `${name}`)
      }
      return [
        <vxe-input
          v-model={text}
          placeholder="自动计算"
          readonly
          clearable
        ></vxe-input>
      ]
      // return [<span class="text">{text}</span>]
    }
  },
  $treeinput: {
    renderCell(h, cellRender, { row, column, $rowIndex }, context) {
      // console.log('cell')
      // 2、反向给tree 3元素赋值
      let props = cellRender.props || {}
      let property = column.property
      props['prefix'] = property

      let timeStamp = +new Date()
      if (row[property]) {
        const valueArr = row[property].split('##')
        row[property + 'id'] = valueArr[0]
        row[property + 'code'] = valueArr[1]
        row[property + 'name'] = valueArr[2]
      }

      if (!row[property + 'id']) {
        row[property] = 'initId' + timeStamp + '## ## '
      } else {
        row[property] = row[property + 'id'] + '##' + row[property + 'code'] + '##' + row[property + 'name']
      }

      const name = row[`${column.property}name`]
      const code = row[`${column.property}code`]
      const noCode = cellRender.props && cellRender.props.noCode

      let text = ''
      if (name && name !== ' ') {
        text = noCode ? `${name}` : (code ? `${code}-${name}` : `${name}`)
      }

      return [<span class = "text" > { text } </span>]
    },
    renderEdit(h, cellRender, { row, column }, context) {
      // console.log('edit')
      try {
        let props = cellRender.props || {}
        let property = column.property
        let options = cellRender.options || []

        props['prefix'] = property
        let timeStamp = +new Date()
        // 1、正向给tree 3元素赋值
        if (!row[property + 'id']) {
          // 情况1:只给了前缀，没有给3个值，初始化3个值
          row[property + 'id'] = 'initId' + timeStamp
          row[property + 'code'] = ' '
          row[property + 'name'] = ' '
        } else {
          // 情况2: 给了前缀和id  code与name可能给了，可能没给； 给了的话优先用给了的值
          row[property + 'code'] = row[property + 'code'] || ' '
          row[property + 'name'] = row[property + 'name'] || ' '
        }

        // 2、反向给tree 3元素赋值
        if (row[property]) {
          const valueArr = row[property].split('##')
          row[property + 'id'] = valueArr[0]
          row[property + 'code'] = valueArr[1]
          row[property + 'name'] = valueArr[2]
        }

        // 转接串  1、3个树节点均没有  2、有3个树节点数据
        if (!row[property + 'id']) {
          row[property] = 'initId' + timeStamp + '## ## '
        } else {
          row[property] = row[property + 'id'] + '##' + row[property + 'code'] + '##' + row[property + 'name']
        }
        return [
          <BsTreeInput datas={ options } v-model={row[column.property]} {...{ props }} ></BsTreeInput>
        ]
      } catch (e) {
        throw (e)
      }
    }
  },
  $treeTextCheck: {
    renderCell(h, cellRender, { row, column }, context) {
      const name = row[`${column.property}name`] === ' ' ? '' : row[`${column.property}name`]
      const code = row[`${column.property}code`] === ' ' ? '' : row[`${column.property}code`]
      const noCode = cellRender.props && cellRender.props.noCode
      let text = ''
      if (name) {
        let names = name.split(',')
        let codes = code.split(',')
        let line = ''
        if (names.length === codes.length) {
          for (let i = 0, len = names.length; i < len; i++) {
            line += (noCode ? `${names[i]}` : `${codes[i]}-${names[i]}`)
            if (i < len - 1) {
              line += ','
            }
          }
        } else {
          console.log('table: code,name数量匹配不上')
        }
        text = line
      }
      return [<span class="text">{text}</span>]
    }
  },
  $treeinputCheck: {
    renderCell(h, cellRender, { row, column, $rowIndex }, context) {
      // console.log('cell')
      // 2、反向给tree 3元素赋值
      let props = cellRender.props || {}
      let property = column.property
      props['prefix'] = property

      let timeStamp = +new Date()
      if (row[property]) {
        const valueArr = row[property].split('##')
        row[property + 'id'] = valueArr[0]
        row[property + 'code'] = valueArr[1]
        row[property + 'name'] = valueArr[2]
      }

      if (!row[property + 'id']) {
        row[property] = 'initId' + timeStamp + '## ## '
      } else {
        row[property] = row[property + 'id'] + '##' + row[property + 'code'] + '##' + row[property + 'name']
      }

      const name = row[`${column.property}name`]
      const code = row[`${column.property}code`]
      const noCode = cellRender.props && cellRender.props.noCode

      let text = ''
      if (name && name !== ' ') {
        text = noCode ? `${name}` : `${code}-${name}`
      }

      return [<span class = "text" > { text } </span>]
    },
    renderEdit(h, cellRender, { row, column }, context) {
      // console.log('edit')
      try {
        let props = cellRender.props || {}
        let property = column.property
        let options = cellRender.options || []

        props['prefix'] = property
        let timeStamp = +new Date()
        // 1、正向给tree 3元素赋值
        if (!row[property + 'id']) {
          // 情况1:只给了前缀，没有给3个值，初始化3个值
          row[property + 'id'] = 'initId' + timeStamp
          row[property + 'code'] = ' '
          row[property + 'name'] = ' '
        } else {
          // 情况2: 给了前缀和id  code与name可能给了，可能没给； 给了的话优先用给了的值
          row[property + 'code'] = row[property + 'code'] || ' '
          row[property + 'name'] = row[property + 'name'] || ' '
        }

        // 2、反向给tree 3元素赋值
        if (row[property]) {
          const valueArr = row[property].split('##')
          row[property + 'id'] = valueArr[0]
          row[property + 'code'] = valueArr[1]
          row[property + 'name'] = valueArr[2]
        }

        // 转接串  1、3个树节点均没有  2、有3个树节点数据
        if (!row[property + 'id']) {
          row[property] = 'initId' + timeStamp + '## ## '
        } else {
          row[property] = row[property + 'id'] + '##' + row[property + 'code'] + '##' + row[property + 'name']
        }
        return [
          <BsTreeInputTest datas={ options } v-model={row[column.property]} {...{ props }} ></BsTreeInputTest>
        ]
      } catch (e) {
        throw (e)
      }
    }
  },
  $EditDownTextarea: {
    autofocus: '.vxe-input--inner',
    renderEdit(h, renderOpts, params) {
      return [
        <edit-down-textarea params={ params }></edit-down-textarea>
      ]
    },
    renderCell(h, cellRender, { row, column }, context) {
      return [<span class="text">{row[column.property]}</span>]
    }
  },
  $EditDownJson: {
    autofocus: '.vxe-input--inner',
    renderEdit(h, renderOpts, params) {
      return [
        <edit-down-json params={ params }></edit-down-json>
      ]
    },
    // renderCell(h, renderOpts, params) {
    //   return [
    //     <edit-down-json params={ params }></edit-down-json>
    //   ]
    // }
    renderCell(h, cellRender, { row, column }, context) {
      let value = JSON.stringify(row[column.property])
      return [<span class="text">{value}</span>]
    }
  },
  $EditDownConditions: {
    autofocus: '.vxe-input--inner',
    renderEdit(h, { name, options, props }, params) {
      return [
        <edit-down-conditions constProps={ props } params={ params }></edit-down-conditions>
      ]
    },
    renderCell(h, cellRender, { row, column }, context) {
      return [<span class="text">{row[column.property]}</span>]
    }
  },
  $optionSort: {
    renderDefault(h, cellRender, { $columnIndex, $rowIndex, items, column, data, row, $seq, columnIndex, isEdit, level, rowIndex, seq }, { $excel, $grid, $table, $type }) {
      let self = $grid.$parent
      // <a class="optionRow" href={row.link}>{'操作' + row[column.property]}</a>
      return [
        <div class="row-dragsort-option row-option-group">
          <a class="optionRow-delete fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'upSort' })}>上移</a>
          <a class="optionRow-edit fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'downSort' })}>下移</a>
          <a class="optionRow-report fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'topSort' })}>置顶</a>
          <a class="optionRow-detail fn-inline" onClick={() => self.onOptionSortRowClick({ row, column, $rowIndex, data, items, optionType: 'bottomSort' })}>置底</a>
        </div>
      ]
    }
  },
  optionRow: {
    renderDefault(h, cellRender, { row, column }, context) {
      let self = context.$grid.$parent
      // <a class="optionRow" href={row.link}>{'操作' + row[column.property]}</a>
      if (row.status === 0) {
        return [
          <div class="row-option row-option-group">
            <a class="optionRow-delete fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'delete' })}>删除</a>
            <a class="optionRow-edit fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'edit' })}>编辑</a>
            <a class="optionRow-report fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'report' })}>上报</a>
            <a class="optionRow-detail fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'detail' })}>详情</a>
          </div>
        ]
      } else {
        return [
          <div class="row-option row-option-group">
            <a class="optionRow-delete fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'delete' })}>删除</a>
            <a class="optionRow-detail fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'detail' })}>详情</a>
          </div>
        ]
      }
    }
  },
  $span: {
    // 文本渲染
    renderCell(h, renderOpts, { row, column }) {
      return [<span>{row[column.property]}</span>]
    },
    renderEdit(h, renderOpts, { row, column }) {
      return [
        <vxe-input
          v-model={row[column.property]}
          placeholder="自动计算"
          readonly
          clearable
        ></vxe-input>
      ]
      // return [<span>{row[column.property]}</span>]
    }
  },
  $href: {
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
  $vexDynamicSelect: {
    renderEdit(h, { props, options }, { row, column }, { $excel, $grid, $table, $type }) {
      // let res = $grid.$parent.$asyncGet('/base-agency-service/baseAgency/v1/searchAssetByCode', { agency_code: row.agency_code, fixed_asset_type_code: row.asset_class_code })
      // let res = await $grid.$parent.$http.get('/base-agency-service/baseAgency/v1/searchAssetByCode', { agency_code: 129001, fixed_asset_type_code: 2030402 })
      // if (res && res.rscode === '100000') {
      //   let options = res.rows.map((item, index) => {
      //     return Object.assign(item, {
      //       value: item.asset_code,
      //       label: item.asset_code
      //     })
      //   })
      // return [
      //   <vxe-select v-model={row[column.property]} placeholder="请选择">
      //     {options.map((item, index) => {
      //       return [
      //         <vxe-option
      //           value={item.value}
      //           label={item.label}
      //         ></vxe-option>
      //       ]
      //     })}
      //   </vxe-select>
      // ]
      // } else {
      //   this.$message.warning(res.result)
      // }
      // row.options = row.options || []
      // return [
      //   h('vxe-select', {
      //     props: {
      //       ref: 'vxe-select-' + column.property,
      //       value: row[column.property],
      //       ...props
      //     },
      //     on: {
      //       change: ({ value }) => {
      //         row[column.property] = value
      //         // row.options.forEach((item) => {

      //         // })
      //       }
      //     }
      //   }, row.options.map(item => {
      //     return h('vxe-option', {
      //       props: {
      //         value: item.value,
      //         label: item.label
      //       }
      //     })
      //   })
      //   )
      // ]
      row.options = row.options || []
      return [
        <vxe-select v-model={row[column.property]} placeholder="请选择">
          {row.options.map((item, index) => {
            return [
              <vxe-option
                value={item.value}
                label={item.label}
              ></vxe-option>
            ]
          })}
        </vxe-select>
      ]
    },
    renderDefault(h, cellRender, { row, column }, context) {
      return [<span>{row[column.property]}</span>]
    },
    renderCell(h, renderOpts, { row, column }) {
      return [<span>{row[column.property]}</span>]
    }
  },
  $contentTable: {
    renderExpand(h, { props }, { $columnIndex, $rowIndex, items, column, data, row, $seq, $table, $type, columnIndex, isEdit, level, rowIndex, seq }, context) {
      const tableConfig = {
        globalConfig: { // 全局默认渲染列配置
          // 全局配置
          checkType: '',
          seq: false
        }
      }
      return [
        <BsTable toolbarConfig={false} pagerConfig={false} tableConfig={ tableConfig } { ...{ props }} height="unset" tableColumnsConfig={ row.childCols } tableData={ row.childData }></BsTable>
      ]
    }
  }
}
export const defaultRenderers = {
  ...cellRenderers
}
// 废弃结束

export const tableColumns = { // 默认配置列
  seq: { // 序号
    title: '序号',
    type: 'seq',
    width: 60,
    align: 'center',
    className: 'table-sep',
    fixed: 'left',
    sortable: false
  },
  checkbox: { // 选择
    title: '',
    type: 'checkbox',
    width: 80,
    align: 'center',
    fixed: 'left',
    sortable: false,
    className: 'table-row-checkbox'
  },
  optionSort: { // 选择
    title: '手动排序',
    type: 'dragSort',
    field: 'dragSort',
    width: 150,
    align: 'center',
    fixed: 'right',
    sortable: false,
    className: 'table-row-checkbox',
    cellRender: {
      type: 'cellRender',
      name: '$optionSort'
    }
  },
  radio: { // 单选
    title: '单选',
    type: 'radio',
    width: 80,
    align: 'center',
    fixed: 'left',
    sortable: false,
    className: 'table-row-radio'
  },
  optionRow: { // 操作
    title: '操作',
    field: 'optionRow',
    type: 'optionRow',
    editable: false,
    width: 150,
    align: 'center',
    fixed: 'right',
    sortable: false,
    className: 'table-row-option',
    cellRender: {
      type: 'cellRender', // renderEdit
      name: 'optionRow'
    }
  }
}
export const pagerConfig = {
  align: 'right',
  // pageSizes: [20, 50, 100, 500, 1000, 1000000],f
  pageSizes: [
    {
      label: '20条',
      value: 20
    },
    {
      label: '50条',
      value: 50
    },
    {
      label: '100条',
      value: 100
    },
    {
      label: '500条',
      value: 500
    },
    {
      label: '1000条',
      value: 1000
    },
    {
      label: '全部',
      value: 10000000000
    }
  ],
  layouts: [
    'Sizes',
    'PrevJump',
    'PrevPage',
    'Number',
    'NextPage',
    'NextJump',
    'FullJump',
    'Total',
    'PageCount'
  ],
  perfect: true,
  slots: {
    left: 'pagerLeftSlots'
    // right: 'pagerRightSlots'
  }
}
export let tableFormConfig = {
  data: {
    keyWord: ''
  },
  items: [
    { field: 'keyWord', itemRender: { name: '$input', props: { placeholder: '请输入关键字过滤' } } },
    { itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: '查询', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] } }
  ]
}
export const tableStyleConfig = {
  height: 'auto', // 表格的高度； 支持铺满父容器或者固定高度， 如果设置 auto 为铺满父容器（ 如果设置自适应时， 必须确保存在父节点且不允许存在相邻元素）number | string:auto, % , px
  maxHeight: '100%', // 表格的最大高度number | string: %, px
  border: false, // 是否带有边框 boolean | string:default（ 默认）, full（ 完整边框）, outer（ 外边框）, inner（ 内边框）, none（ 无边框）,默认 false， 继承 setup.table.border
  highlightCurrentRow: false, // 是否要高亮当前行: boolean, false
  highlightHoverRow: true // 鼠标移到行是否要高亮显示:boolean,false
  // highlightCurrentColumn:是否要高亮当前列:booleanfalse
}
export const defaultFormatters = {
  formatMoney({ cellValue, row, column }) {
    // 数字逗号三位分开
    if (!cellValue) {
      return ''
    } else {
      let num = isNaN(parseFloat(cellValue)) ? 0 : parseFloat(cellValue)
      num = (num / this.moneyUnit).toFixed(2)
      if (typeof num === 'string') {
        return Number(parseFloat(num).toFixed(2)).toLocaleString()
      } else if (typeof num === 'number') {
        return Number(num.toFixed(2)).toLocaleString()
      }
    }
  },
  digitUppercase({ cellValue, row, column }) {
    let n = cellValue
    /* 现金额大写 */
    if (typeof n === 'number') {
      n = '' + n
    }
    n = n.replace(/,/g, '') // 替换tomoney()中的“,”
    n = n.replace(/ /g, '') // 替换tomoney()中的空格
    n = n.replace(/￥/g, '') // 替换掉可能出现的￥字符
    // if (isNaN(n)) { //验证输入的字符是否为数字
    //     //alert("请检查小写金额是否正确");
    //     return "";
    // };
    let fraction = ['角', '分']
    let digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
    ]
    let unit = [
      ['元', '万', '亿', '万', '亿'],
      ['', '拾', '佰', '仟']
    ]
    let head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    let s = ''
    for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = ''
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p
        n = Math.floor(n / 10)
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  },
  formatAmount: ({ cellValue }, digits) => {
    return this.$XEUtils.commafy(cellValue, { digits: digits || 2 })
  }
}
export const footerConfig = {
  showFooter: false,
  totalObj: {}, // 总计数据对象
  combinedType: ['subTotal', 'total', 'totalAll', 'switchTotal'], // 显示那些合计行类型，注意顺序
  footerMethod({ columns, data, $table, $grid }) {
    let moneyUnit = $grid.$parent.moneyUnit ? $grid.$parent.moneyUnit : 1
    let combinedType = $grid.$parent.footerConfigIn.combinedType || ['switchTotal']
    // let calculateFooterObj = {
    //     calculateFooter_subTotal: defaultGloabalUtils.calculateFooter_subTotal({ columns, data, $table, $grid }),
    //     calculateFooter_total: defaultGloabalUtils.calculateFooter_total({ columns, data, $table, $grid }),
    //     calculateFooter_totalAll :defaultGloabalUtils.calculateFooter_totalAll({ columns, data, $table, $grid }),
    // }
    let footerData = []
    if (combinedType.indexOf('switchTotal') >= 0) {
      if ($grid.getCheckboxRecords().length) {
        footerData = [defaultGloabalUtils['calculateFooter_subTotal']({ columns, data, $table, $grid })]
        // footerData[0][0] = '已选(' + $grid.getCheckboxRecords().length + ')'
      } else {
        footerData = [defaultGloabalUtils['calculateFooter_total']({ columns, data, $table, $grid })]
        // footerData[0][0] = '总计'
      }
    } else {
      footerData = combinedType.map(item => {
        return defaultGloabalUtils['calculateFooter_' + item]({ columns, data, $table, $grid })
      })
    }
    $grid.$parent.viewFooterData = footerData
    // footerData.splice(1, 2)
    // const footerData = [
    //   // defaultGloabalUtils.calculateFooter({ columns, data, columnIndexText: '平均(元)', combinedType: 'average' }, context),
    //   defaultGloabalUtils.calculateFooter({ columns, data, $table, $grid, columnIndexText: '合计(元)', combinedType: 'total' })
    // ]
    return footerData.map((row) => {
      return row.map((item, index) => {
        if ((columns[index].own.combinedType + '').split(',').filter((item) => { return !!(item + '').replace(/null|undefined|true|false/ig, '') }).length) {
          let result = Number((item / moneyUnit).toFixed(2)).toLocaleString()
          result = result.split('.').length === 1 ? result + '.00' : (result.split('.')[1].length === 1 ? result + '0' : result)
          return result
        } else {
          return item
        }
      })
    })
  },
  footerSpanMethod({ $rowIndex, column, columnIndex, $columnIndex, _columnIndex, _rowIndex, data }) {
    if (_columnIndex === 0) {
      return {
        rowspan: 1,
        colspan: 2
      }
    } else if (_columnIndex === 1) {
      return {
        rowspan: 0,
        colspan: 0
      }
    } else {
      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }
}
export const contextMenuConfig = {
  header: {
    options: [
      [{
        code: 'hide',
        name: '隐藏列',
        children: [
          { code: 'hideColumn', name: '隐藏当前列', disabled: false },
          { code: 'showAllColumn', name: '取消所有隐藏列', disabled: false }
        ]
      },
      {
        code: 'fixed',
        name: '固定列',
        children: [
          { code: 'FIXED_LEFT_COLUMN', name: '将列固定到左侧', disabled: false },
          { code: 'FIXED_RIGHT_COLUMN', name: '将列固定到右侧', disabled: false },
          { code: 'CLEAR_FIXED_COLUMN', name: '清除固定列', disabled: false }
        ]
      },
      {
        code: 'reset',
        name: '重置列',
        children: [
          { code: 'RESET_RESIZABLE', name: '重置列宽状态', disabled: false },
          // { code: 'RESET_ALL', name: '重置列的所有状态', disabled: false },
          { code: 'recover_all', name: '恢复列为初始状态', disabled: false }
        ]
      },
      {
        code: 'FILTER',
        name: '筛选',
        children: [
          {
            code: 'CLEAR_FILTER',
            name: '清除选中列的筛选条件'
          },
          {
            code: 'CLEAR_ALL_FILTER',
            name: '清除所有列筛选条件'
          }
          // {
          //   code: 'FILTER_CELl',
          //   name: '根据单元格值筛选'
          // }
        ]
      },
      {
        code: 'sort',
        name: '排序',
        children: [
          {
            code: 'clearSort',
            name: '清除排序'
          },
          {
            code: 'sortAsc',
            name: '升序'
          },
          {
            code: 'sortDesc',
            name: '倒序'
          }]
      }]
    ]
  },
  body: {
    options: [
      [
        {
          code: 'FILTER',
          name: '行操作',
          children: [
            {
              code: 'remove',
              name: '移除当前行',
              disabled: false
            },
            {
              code: 'DELETE_SELECTED_ROW',
              name: '移除选中行',
              disabled: false
            },
            {
              code: 'CLEAR_ROW',
              name: '清除当前行数据的值'
            },
            {
              code: 'REVERT_ROW',
              name: '还原当前行数据的值'
            },
            {
              code: 'CLEAR_SELECTED_ROW',
              name: '清除选中行数据的值'
            },
            {
              code: 'REVERT_SELECTED_ROW',
              name: '还原选中行数据的值'
            },
            {
              code: 'CLEAR_ALL',
              name: '清除所有数据的值'
            },
            {
              code: 'REVERT_ALL',
              name: '还原所有数据的值'
            }
          ]
        }],
      [
        {
          code: 'clear',
          name: '清除当前单元格内容',
          visible: true,
          disabled: false
        },
        {
          code: 'insertAt',
          name: '新增一条数据',
          disabled: false
        },
        {
          code: 'INSERT_AT_ACTIVED_ROW',
          name: '插入数据到当前行',
          disabled: false
        },
        {
          code: 'verify',
          name: '校验并定位到第一个错误',
          disabled: false
        },
        {
          code: 'revert',
          name: '撤消所有操作',
          disabled: false
        },

        {
          code: 'zoom',
          name: ' 切换表格最大化/还原',
          disabled: false
        },
        {
          code: 'exportDataXlsx',
          name: '导出为Excel',
          disabled: false
        },
        {
          code: 'logCurrentData',
          name: 'log当前数据',
          disabled: false
        }
        // { code: 'copy', name: '复制', prefixIcon: 'fa fa-copy', disabled: false },
        // { code: 'paste', name: '粘贴', prefixIcon: 'fa fa-paste', disabled: false }
        // { code: 'reload', name: '刷新', disabled: false },
        // { code: 'save', name: '保存', prefixIcon: 'fa fa-save', disabled: false }
      ]

    ]
  },
  visibleMethod({ options, column }) {
    // let isDisabled = !column
    // options.forEach(list => {
    //   list.forEach(item => {
    //     item.disabled = isDisabled
    //   })
    // })
    return true
  }
}
export const filterTypeMap = {
  // number类型排序
  $vxeMoney: {
    filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'float', valuegt: '' } }],
    filterRender: { name: 'FilterComplex' }
  },
  $vxeCalculate: {
    filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'float', valuegt: '' } }],
    filterRender: { name: 'FilterComplex' }
  },
  $vxeDays: {
    filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'float', valuegt: '' } }],
    filterRender: { name: 'FilterComplex' }
  },
  // 字符类型排序
  $vxeTree: {
    filters: [{ data: { vals: [], sVal: '' } }],
    filterRender: { name: 'FilterContent' }
  },
  $vxeTime: {
    filters: [{ data: { type: 'has', isCase: false, value: '' } }],
    filterRender: { name: 'FilterComplex' }
  },
  $vxeInput: {
    $vxeInputtext: {
      filters: [{ data: { vals: [], sVal: '' } }],
      filterRender: { name: 'FilterContent' }
    },
    $vxeInputinteger: {
      filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'integer' } }],
      filterRender: { name: 'FilterComplex' }
    },
    $vxeInputfloat: {
      filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'float', valuegt: '' } }],
      filterRender: { name: 'FilterComplex' }
    },
    $vxeInputnumber: {
      filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'number' } }],
      filterRender: { name: 'FilterComplex' }
    },
    $vxeInputyear: {
      filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'year' } }],
      filterRender: { name: 'FilterComplex' }
    },
    $vxeInputdate: {
      filters: [{ data: { type: 'has', isCase: false, value: '', dataType: 'date' } }],
      filterRender: { name: 'FilterComplex' }
    },
    $vxeInputglobal: {
      filters: [{ data: '' }],
      filterRender: { name: 'FilterInput' }
    }
  },
  $vxeEditDownTextarea: {
    filters: [{ data: { vals: [], sVal: '' } }],
    filterRender: { name: 'FilterContent' }
  },
  $vxeCheckbox: {
    filters: [{ data: { vals: [], sVal: '' } }],
    filterRender: { name: 'FilterSelect' }
  },
  $vxeRadio: {
    filters: [{ data: '' }],
    filterRender: { name: 'FilterInput' }
  },
  $$vxeEditDownJson: {
    filters: [{ data: '' }],
    filterRender: { name: 'FilterInput' }
  },
  $vxeEditDownConditions: {
    filters: [{ data: '' }],
    filterRender: { name: 'FilterInput' }
  },
  $vxeIntervar: {
    filters: [{ data: '' }],
    filterRender: { name: 'FilterInput' }
  }
}

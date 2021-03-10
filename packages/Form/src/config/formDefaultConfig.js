/* eslint-disable semi */
// formDefaultConfig   Author:Titans@2396757591@qq.com
// 已经废弃 参见 Table/config/defaultRenders.js

/* eslint-disable */
const defaultGloabalUtils = {
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
  }
}
export const defaultformGloabalConfig = {
  span: 8,
  align: 'left',
  size: 'medium',
  titleAlign: 'right',
  titleWidth: '200',
  titleColon: false,
  preventSubmit: false,
  loading: false,
  validConfig: {
    autoPos: true
  }
}
export const defaultRenderers = {
  $formCalculateRender: {
    renderItem(h, renderOpts, { $form, data, property }) {
      return defaultGloabalUtils.formCalculateRender(h, renderOpts, { $form, data, property })
    }
  },
  $formMoneyInputRender: {
    // 输入框
    renderItem(h, renderOpts, { $form, data, property }) {
      data[property] = (data[property] + '').replace(/null|undefined|Infinity/ig, '')
      let { props } = renderOpts
      props = props || {}
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              value: data[property],
              step: 1,
              min: 0.00,
              ...props,
              max: 1000000000000
            },
            on: {
              input(value) {
                data[property] = value
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts });
              }
            }
          })
        ]
      } else {
        let val = isNaN(parseFloat(data[property])) ? 0 : parseFloat(data[property])
        val = val.toFixed(2).toLocaleString()
        val = val.split('.').length === 1 ? val + '.00' : (val.split('.')[1].length === 1 ? val + '0' : val)
        return [<span class="tl fn-inline" {...{ props }} >{val}</span>]
      }
    }
  },
  $formMoneyTextRender: {
    // 废弃
    renderItem(h, renderOpts, { data, column, property }, context) {
      let { props } = renderOpts
      props = props || {}
      let val = isNaN(parseFloat(data[property])) ? 0 : parseFloat(data[property])
      data[property] = val.toFixed(2)
      // let moneyUnit = context.$grid.$parent.moneyUnit ? context.$grid.$parent.moneyUnit : 1
      // eslint-disable-next-line no-useless-escape
      val = Number(val.toFixed(2)).toLocaleString()
      return [<span class="tl" {...{ props }} >{val}</span>]
    }
  },
  $groupTitle: {
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
  },
  $vxelinkageText: {
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props } = renderOpts
      // let renderDataCb = 'renderDataCb'
      // $form.$parent.formItemsConfigIn.some((item) => {
      //   if (item['field'] === property) {
      //     renderDataCb = item.itemRender && item.itemRender.renderDataCb
      //     return true
      //   }
      // })
      // data[property] = typeof (renderDataCb) === 'function' ? renderDataCb(h, { props, name, options }, { $form, property, data }) : data[property]
      props = props || {}

      if ($form.$parent.editable !== false || props.editable !== false) {
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
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts });
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
  $vxeFormDays: {
    // 天数渲染器，不足0.25天按0记，大于0.75天按1天记，其他按0.5天记
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props } = renderOpts
      props = props || {};
      if ($form.$parent.editable !== false || props.editable !== false) {
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
  $vxeFormTime: {
    // 天数渲染器，不足0.25天按0记，大于0.75天按1天记，其他按0.5天记
    renderItem(h, renderOpts, { $form, property, data }) {
      data[property] = (data[property] + '').replace(/null|undefined/ig, '')
      let { props, format } = renderOpts
      format = format || 'YYYY-MM-DD hh:mm:ss'
      props = props || {};
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              placeholder: '请选择时间',
              type: 'date',
              clearable: true,
              value: data[property],
              ...props
            },
            on: {
              input(value) {
                format = format || 'YYYY-MM-DD hh:mm:ss'
                data[property] = value ? new Date(value).format(format) : ''
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts })
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
  $vxeFormText: {
    renderItem(h, { props, name, options }, { $form, property, data }) {
      if ($form.$parent.editable !== false || props.editable !== false) {
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
                $form.$parent.itemChange({ $form, property, itemValue: value, data });
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
  $vxeFormIntervar: {
    // 输入框
    // {
    //   field: 'prevfield#prevfield',
    //   title: '名称',
    //   span: 24,
    //   itemRender: {
    //     name: '$vxeFormIntervar',
    //     props: {
    //       disabled: true,
    //       type: 'text',
    //       placeholder: '请输入名称'
    //     }
    //   }
    // },
    renderItem(h, renderOpts, params) {
      let { props } = renderOpts
      const { property, data, $form } = params
      props = props || {};
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('EditIntervar', {
            ref: 'vxe-input' + property,
            props: {
              params,
              props
            },
            on: {
              input(value) {
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts });
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
  $vxeFormInput: {
    // 输入框
    // renderDefault(h, cellRender, { row, column }, context) {
    //   return [
    //     <span class="text">
    //       {row[column.property] === 1 ? '男男' : '女女'}
    //     </span>
    //   ]
    // },
    renderItem(h, renderOpts, { $form, property, data }) {
      data[property] = (data[property] + '').replace(/null|undefined/ig, '')
      let { props } = renderOpts
      props = props || {};
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('vxe-input', {
            ref: 'vxe-input' + property,
            props: {
              value: data[property],
              ...props
            },
            on: {
              input(value) {
                data[property] = value
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts });
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
  $vxeFormSelect: {
    // 下拉选择
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props, options } = renderOpts
      props = props || {}
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('vxe-select', {
            props: {
              ref: 'vxe-select-' + property,
              value: data[property],
              ...props
            },
            on: {
              change: ({ value }) => {
                data[property] = value
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts });
              }
            }
          }, options.map(item => {
            return h('vxe-option', {
              props: {
                value: item.value,
                label: item.label
              }
            });
          })
          )
        ]
      } else {
        // let val = ''
        // options.forEach((item, index) => {
        //   if (data[property] === item.value) {
        //     val = item.label
        //   }
        // })
        // return [
        //   <span class="tl fn-inline"> {val} </span>
        // ]
        props.multiple = props.multiple === undefined ? false : props.multiple
        options = options || []
        if (props.multiple) {
          let value = []
          options.forEach((item, index) => {
            if (data[property].indexOf(item.value) >= 0) {
              value.push(item.label)
            }
          })
          data[property + '_select_sort'] = value.join(',')
          return [<span>{data[property + '_select_sort']}</span>]
        } else {
          let arrValue = options.filter((item, index) => {
            return item.value === data[property]
          })
          let value = arrValue[0] ? arrValue[0].label : ''
          return [<span>{value}</span>]
        }
      }
    }
  },
  $vxeFormRadio: {
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props, propsC, options } = renderOpts
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('vxe-radio-group', {
            props: {
              value: data[property],
              ...props
            },
            on: {
              change({ $event, label }) {
                data[property] = label
                $form.$parent.itemChange({ $form, property, itemValue: label, data, renderOpts });
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
        let value = ''
        options.forEach((item, index) => {
          if (data[property] === item.value) {
            value = item.label
          }
        })
        return [<span>{value}</span>]
      }
    }
  },
  $vxeFormCheckbox: {
    renderItem(h, renderOpts, { $form, property, data }) {
      let { props, propsC, options } = renderOpts
      data[property] = Array.isArray(data[property]) ? data[property] : []
      if ($form.$parent.editable !== false || props.editable !== false) {
        return [
          h('vxe-checkbox-group', {
            props: {
              value: data[property],
              ...props
            },
            on: {
              change({ $event, checked, checklist, label }) {
                data[property] = checklist
                $form.$parent.itemChange({ $form, property, itemValue: checklist, data, renderOpts });
              }
            }
          }, options.map(item => {
            return h('vxe-checkbox', {
              props: {
                label: item.value,
                ...propsC
              }
            }, item.label)
          }))
        ]
      } else {
        data[property] = Array.isArray(data[property]) ? data[property] : []
        let value = []
        options.forEach((item, index) => {
          if (data[property].indexOf(item.value) >= 0) {
            value.push(item.label)
          }
        })
        data[property + '_checkbox_sort'] = value.join(',')
        return [<span>{data[property + '_checkbox_sort']}</span>]
      }
    }
  },
  $formTreeInput: { // form表单treeinput单选
    renderItem(h, { props, options }, { $form, property, data }) {
      props = props || {}
      if ($form.$parent.editable !== false || props.editable !== false) {
        props['prefix'] = `${property}`
        props['openQuerySeach'] = true
        let timeStamp = +new Date()
        // 如果新建没有初始值，赋初始值
        data[property + 'id'] = data[property + 'id'] || 'initId' + timeStamp
        data[property + 'code'] = data[property + 'code'] || ' '
        data[property + 'name'] = data[property + 'name'] || ' '
        data[property] = data[property + 'id'] + '##' + data[property + 'code'] + '##' + data[property + 'name']
        return [
          h('BsTreeInput', {
            ref: 'BsTreeInput' + property,
            props: {
              datas: options || [],
              value: data[property],
              ...props
            },
            on: {
              input(value) {
                data[property] = value
                const valueArr = data[property].split('##')
                data[property + 'id'] = valueArr[0]
                data[property + 'code'] = valueArr[1]
                data[property + 'name'] = valueArr[2]
                $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts: { props, options } });
              }
            }
          })
        ]
      } else {
        data[property + '_tree_sort'] = props.formatter === '#code-#name' ? data[property + 'code'] + '-' + data[property + 'name'] : data[property + 'name']
        return [<span>{data[property + '_tree_sort']}</span>]
      }
    }
  },
  $formTreeInputCheck: { // form表单treeinput 多选
    renderItem(h, { props, options }, { $form, property, data }) {
      props['prefix'] = `${property}`
      props['openQuerySeach'] = true
      props['showcheckbox'] = true
      let timeStamp = +new Date()
      // 如果新建没有初始值，赋初始值
      data[property + 'id'] = data[property + 'id'] || 'initId' + timeStamp
      data[property + 'code'] = data[property + 'code'] || ' '
      data[property + 'name'] = data[property + 'name'] || ' '
      if (!data[property + 'name'].trim()) {
        data[property] = data[property + 'id'] + '##' + data[property + 'code'] + '##' + data[property + 'name']
      } else {
        const ids = data[property + 'id'] && data[property + 'id'].split(',')
        const codes = data[property + 'code'] && data[property + 'code'].split(',')
        const names = data[property + 'name'] && data[property + 'name'].split(',')
        let line = ''
        if (ids.length === names.length) {
          for (let i = 0, len = ids.length; i < len; i++) {
            line += `${ids[i]}##${codes[i]}##${names[i]}`
            if (i < len - 1) {
              line += ','
            }
          }
        } else {
          console.log('from: id,name数量匹配不上')
        }

        data[property] = line
      }

      return [
        h('BsTreeInput', {
          ref: 'BsTreeInput' + property,
          props: {
            datas: options || [],
            value: data[property],
            ...props
          },
          on: {
            input(value) {
              data[property] = value
              const nodes = data[property].split(',')
              let id = ''; let code = ''; let name = ''
              for (let i = 0, len = nodes.length; i < len; i++) {
                let item = nodes[i]
                if (!item) {
                  continue
                }
                id += item.split('##')[0] + ','
                code += item.split('##')[1] + ','
                name += item.split('##')[2] + ','
              }
              id = id.substr(0, id.length - 1)
              code = code.substr(0, code.length - 1)
              name = name.substr(0, name.length - 1)
              data[property + 'id'] = id
              data[property + 'code'] = code
              data[property + 'name'] = name
              $form.$parent.itemChange({ $form, property, itemValue: value, data, renderOpts: { props, options } });
            }
          }
        })
      ]
    }
  }
}

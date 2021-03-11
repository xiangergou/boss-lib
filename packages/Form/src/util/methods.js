// methods   Author:Titans@2396757591@qq.com
// import { defaultRenderers } from '../config/formDefaultConfig.js'
// import { typeConf, basicConf, pullConf } from '../../../gloabalDataSource/pullDownDataSource.js'
/* eslint-disable */
const util = {
  getbasicDataType(obj) {
    // 获取数据类型
    return Object.prototype.toString.call(obj).slice(8, -1)
  },
  deepCopy(obj) {
    // 深拷贝通用方法
    let me = this
    if (typeof obj !== 'object' || obj === null) return obj
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] =
           typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
      }
    }
    return newObj
  },
  debounce(fn, delay) {
    // 利用闭包保存定时器
    let timer = null
    return function() {
      let context = this
      let arg = arguments
      // 在规定时间内再次触发会先清除定时器后再重设定时器
      clearTimeout(timer)
      timer = setTimeout(function() {
        fn.apply(context, arg)
      }, delay)
    }
  },
  each: function(object, callback) {
    /* js原生each方法 */
    var type = (function(obj) {
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
      for (var i in object) {
        if (callback.call(object[i], i, object[i]) === false) {
          break
        }
      }
    }
  }
}
const initMethods = {
  initCreated() {
    // 初始化Created
  },
  initMounted() {
    this.itemChangeTimer = null
    this.initFirst()
    // 初始化Mounted
  },
  initFirst() {
    // 组件初始化
    this.itemChangeTimer = this.debounce(() => {}, 200)
    // this.registFormItemRender(defaultRenderers)
    this.initFormInitGloabalData()
    this.initFormConfig()
    this.initFormItemsConfig()
    this.registFormItemRender(this.formConfigCp.renderers)
    this.initFormGloabalConfig()
    this.registRenderers(this.formItemsConfigIn)
    this.initFormValidationConfig()
    this.initFormDataList()
  },
  initFormInitGloabalData() {
    this.formInitGloabalDataCp = Object.assign(
      {},
      this.formInitGloabalDataCp,
      this.formInitGloabalData
    )
  },
  initFormConfig() {
    this.formConfigCp = Object.assign({}, this.formConfigCp, this.formConfig)
  },
  initFormGloabalConfig(newVal) {
    // 初始化工具栏
    this.formGloabalConfigIn = Object.assign(
      {},
      this.formGloabalConfigIn,
      this.formGloabalConfig
    )
  },
  initFormDataList(newVal) {
    this.formDataListIn = this.deepCopy(this.formDataList)
    this.initDefaultFormDataList()
  },
  initFormValidationConfig(newVal) {
    this.formValidationConfigIn = Object.assign({}, this.addTreeReg({ ...this.formValidationConfig }))
  },
  initFormItemsConfig(newVal) {
    this.formItemsConfigIn = JSON.parse(JSON.stringify(this.formItemsConfig))
    this.initDefaultFormDataList(this.formItemsConfig)
  },
  initDefaultFormDataList(arr) {
    // Object.keys(this.formDataListIn).forEach(item => {
    //   this.formDataListIn[item] = this.formDataListIn[item] === undefined || this.formDataListIn[item] === null ? '' : this.formDataListIn[item]
    // })
    let self = this
    this.formItemsConfigIn.forEach((item, index) => {
      if (item.field) {
        self.formDataListIn[item.field] = (typeof (self.formDataListIn[item.field]) !== 'object' && self.getbasicDataType(self.formDataListIn[item.field]) !== 'Null') ? (self.formDataListIn[item.field] + '').replace(/null|NaN|undefined/ig, '') : self.formDataListIn[item.field]
      }
    })
  }
}
const registFn = {
  registSingelItemRenderer(item) {
    // 绑定每个数据项渲染器配置
    // let self = this
    // let itemRender = item.itemRender
    // let pullTypes = ['$select', 'select', '$treeinput', '$radio', '$checkbox']
    // if (itemRender) {
    //   if (pullTypes.indexOf(itemRender.name) >= 0) {
    //     if (self.getbasicDataType(itemRender) === 'Object') {
    //       if (!Array.isArray(itemRender.options)) {
    //         let options = self.getbasicDataType(basicConf[item.field]) === 'Object' && basicConf[item.field].options
    //         if (options) {
    //           itemRender.options = options
    //         } else {
    //           let ajaxConf = typeConf[itemRender.name]
    //           if (ajaxConf) {
    //             self['$' + ajaxConf.methods](ajaxConf.url, Object.assign({}, ajaxConf.requestparams, this.formInitGloabalDataCp)).then(res => {
    //               itemRender.options = res
    //             }).catch(e => {
    //             })
    //           } else {
    //             let ajaxConf = pullConf[itemRender.name]
    //             if (ajaxConf) {
    //               self['$' + ajaxConf.methods](ajaxConf.url, Object.assign({}, ajaxConf.requestparams, this.formInitGloabalDataCp)).then(res => {
    //                 itemRender.options = res
    //               }).catch(e => {
    //               })
    //             }
    //           }
    //         }
    //         item['itemRender'] = itemRender
    //       }
    //     }
    //   }
    // } else {
    let formRenderConfig = this.formConfigCp.formRenderConfig
    if (item.field && formRenderConfig[item.field] && !item['itemRender']) {
      item['itemRender'] = formRenderConfig[item.field]
    }
    // }
  },
  registRenderers(arr = []) {
    // 初始化绑定数据项渲染器
    let self = this
    arr.forEach((item, index) => {
      self.registSingelItemRenderer(item)
      if (Array.isArray(item.children) && item.children) {
        self.registRenderers(item.children)
      }
    })
  },
  getFormData() {
    return this.formDataListIn
  },
  registFormItemRender(renderers) {
    // 注册渲染器
    for (let i in renderers) {
      this.$VXETable.renderer.add(i, renderers[i])
    }
  }
}
const axiosEvent = {
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
const formOptionFn = {
  itemChange({ $form, property, itemValue, data, renderOpts }) {
    let self = this
    if (!this.$refs.form) {
      return
    }
    self.$nextTick(() => {
    // clearTimeout(this.itemChangeTimer)
    // this.itemChangeTimer = setTimeout(() => {
      self.$emit('itemChange', { $form, property, itemValue, data, renderOpts }, self)
    //   }, 1000)
    })
  },
  reset() {
    // 重置表单
    return this.$refs.form.reset()
  },
  clearValidate(field) {
    // 手动清除校验状态
    return this.$refs.form.clearValidate(field)
  },
  updateStatus(scope) {
    // 更新项状态（当使用自定义渲染时可能会用到）
    return this.$refs.form.updateStatus(scope)
  },
  formOptionsFn() {
    return this.$refs.form
  },
  resetData({ nosetFields }) {
    let nosetFieldsCp = Array.isArray(nosetFields) ? nosetFields : []
    let self = this
    Object.keys(self.formDataListIn).forEach((item, index) => {
      if (nosetFieldsCp.indexOf(item) === -1) {
        self.formDataListIn[item] = null
      }
    })
  }
}
const optionEvent = {
  onFormSubmit(obj) {
    // 表单提交时会触发该事件 { data, $event }
    // debugger
    let self = this
    this.$emit('onSubmitClick', obj, self, this.$refs.form)
    let axiosDatas = self.formConfigCp.axiosDatas
    typeof axiosDatas.saveData === 'function' && axiosDatas.saveData(obj, self)
    // .then(
    //   saveResult => {
    //     typeof (saveResult) === 'function' && saveResult.call(self)
    //   }
    // ).catch(error => {
    //   console.log(error)
    // })
  },
  submitInvalid(obj) {
    // 表单提交时如果校验不通过会触发该事件 { data, errMap, $event }
    this.$emit('submitInvalid', obj, self, this.$refs.form)
  },
  reset(obj) {
    // 表单重置时会触发该事件 { data, $event }
    this.$emit('reset', obj, self, this.$refs.form)
  },
  toggleCollapse(obj) {
    // 当折叠按钮被手动点击时会触发该事件 { collapse, data, $event }
    this.$emit('toggleCollapse', obj, self, this.$refs.form)
  },
  formDataChange(obj) {
    let self = this
    let axiosDatas = self.formConfigCp.axiosDatas
    typeof axiosDatas.formDataChange === 'function' && axiosDatas.formDataChange(obj, self)
  }
}
const otherFn = {
  validItemRules(type, property, val) {
    let self = this
    const { data, editRules } = this
    const errorRules = []
    const syncVailds = []
    if (property && editRules) {
      const rules = self.$XEUtils.get(editRules, property)
      if (rules) {
        const itemValue = self.$XEUtils.isUndefined(val) ? self.$XEUtils.get(data, property) : val
        rules.forEach(rule => {
          if (type === 'all' || !rule.trigger || type === rule.trigger) {
            if (self.$XEUtils.isFunction(rule.validator)) {
              const customValid = rule.validator({
                itemValue,
                rule,
                rules,
                data,
                property,
                $form: this
              })
              if (customValid) {
                if (self.$XEUtils.isError(customValid)) {
                  errorRules.push(self.newRule({ type: 'custom', trigger: rule.trigger, message: customValid.message, rule: self.newRule(rule) }))
                } else if (customValid.catch) {
                  // 如果为异步校验（注：异步校验是并发无序的）
                  syncVailds.push(
                    customValid.catch(e => {
                      errorRules.push(self.newRule({ type: 'custom', trigger: rule.trigger, message: e ? e.message : rule.message, rule: self.newRule(rule) }))
                    })
                  )
                }
              }
            } else {
              const isNumber = rule.type === 'number'
              const numVal = isNumber ? self.$XEUtils.toNumber(itemValue) : self.$XEUtils.getSize(itemValue)
              if (itemValue === null || itemValue === undefined || itemValue === '') {
                if (rule.required) {
                  errorRules.push(self.newRule(rule))
                }
              } else if (
                (isNumber && isNaN(itemValue)) ||
                (!isNaN(rule.min) && numVal < parseFloat(rule.min)) ||
                (!isNaN(rule.max) && numVal > parseFloat(rule.max)) ||
                (rule.pattern && !(rule.pattern.test ? rule.pattern : new RegExp(rule.pattern)).test(itemValue))
              ) {
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
  validate(cb) {
    let self = this
    return new Promise((resolve, reject) => {
      self.$refs.form.validate(cb).then((res) => {
        resolve(res)
      }).catch((errMap) => {
        let errorInfor = []
        self.each(errMap, (item, key) => {
          errorInfor.push(errMap[item][0].rule.$options.message)
        })
        self.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: `<strong class="cred f14">${errorInfor.join('</br>')}</strong>`
        })
        reject(errMap)
      })
    })
  },
  getFormData() {
    // 获取表单数据
    const data = this.$refs.form.data
    // console.log('save', this.dealData(data))
    return this.deepCopy(this.dealData(data))
  },
  dealData(data) {
    Object.keys(data).map((item) => {
      let value = String(data[item]) || ''
      if (value.includes('initId')) {
        const prefix = item.substr(0, item.indexOf('id'))
        data[item] = ''
        data[prefix + 'code'] = ''
        data[prefix + 'name'] = ''
        data[prefix + 'id'] = ''
      }
    })
    return data
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
  }
}
export default {
  ...axiosEvent,
  ...util,
  ...formOptionFn,
  ...initMethods,
  ...registFn,
  ...optionEvent,
  ...otherFn
}

/* eslint-disable no-useless-constructor */
/*
 * describe:  基于vxe-table vxe-grid数据格式的导入工具类函数 基础版
 * @Date:   2020-09-16
 * Author: Titans@2396757591@qq.com
 * @Last Modified time: 2020-09-3
 */
// import { columns, datas } from './testData.js'
import XlsxTool from 'xlsx'
export class Import {
  constructor(gloabelConfig = {}) {
    let self = this
    this.XlsxTool = XlsxTool
    this.inputTag = document.createElement('input')
    this.inputTag.setAttribute('type', 'file')
    this.inputTag.setAttribute('accept', '.xlsx,.xls')
    this.inputTag.setAttribute('multiple', false)
    this.inputTag.addEventListener('change', function(e) {
      const files = e.target.files
      self.readWorkbookFromLocalFile(files)
    })
    this.importGlobleConf = {
      valiRules: {},
      conlums: []
    }
    this.importHistory = [] // 导出历史记录
  }
  importExcel(conf, cb) {
    // 触发导入Excel动作
    this.importGlobleConf = Object.assign(this.importGlobleConf, conf)
    this.callback = cb
    this.selectFile(cb)
  }
  selectFile() {
    // 触发选取文件操作
    this.workbook = {}
    this.inputTag.value = null
    this.inputTag.click()
  }
  readWorkbookFromLocalFile(files) {
    // 读取本地excel文件
    let self = this
    if (!files.length) {
      return
    }
    let filename = files[0].name
    // const { valiRules, conlums } = this.importGlobleConf
    let reader = new FileReader()
    reader.onload = function(e) {
      let data = e.target.result
      let workbook = self.XlsxTool.read(data, { type: 'binary' })
      self.workbook = workbook
      let excelJsonMap = {}
      let excelJsonSing = []
      for (let i = 0; i < workbook.SheetNames.length; i++) {
        let excelJson = self.XlsxTool.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]])
        if (i === 0) {
          excelJsonSing = excelJson
        }
        excelJsonMap[workbook.SheetNames[i]] = excelJson
      }
      self.callback(workbook.SheetNames.length === 1 ? excelJsonSing : excelJsonMap, filename)

      // self.deaImportViewData({
      //   conlums: conlums,
      //   viewData: excelJson,
      //   valiRules: valiRules
      // })
      self.importHistory.push({ import: workbook, viewData: excelJsonMap })
      self.importHistory = self.importHistory.reverse().slice(0, 20).reverse()
    }
    reader.readAsBinaryString(files[0])
  }
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
        if (tableColumnsFieldMap[tableColumnsTitleFieldMap[key]]) {
          // self.validCellRules({ type: 'all', row, column: tableColumnsFieldMap[tableColumnsTitleFieldMap[key]], val: parseViewValue, valiRules: obj.valiRules })
          //   .then(() => {
          //     if (customVal) {
          row[tableColumnsTitleFieldMap[key]] = parseViewValue
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
          validResultFieldTitle.push(key)
        }
      })
      row = Object.assign({}, rowsObjTemp, row)
      return this.reductionColFormula(colFormulaConfig, self.reductionColFormula(colFormulaConfig, row))
    })
    return validResult && !validResultFieldTitle.length && viewData
  }
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
      return value
    }
  }
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
  }
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
  }
  // outputWorkbook(workbook) {
  //   // 读取 excel文件
  //   var sheetNames = workbook.SheetNames // 工作表名称集合
  //   sheetNames.forEach(name => {
  //     var worksheet = workbook.Sheets[name] // 只能通过工作表名称来获取指定工作表
  //     for (var key in worksheet) {
  //       // v是读取单元格的原始值
  //       console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v)
  //     }
  //   })
  // }
  // readWorkbook(workbook) {
  //   var sheetNames = workbook.SheetNames // 工作表名称集合
  //   var worksheet = workbook.Sheets[sheetNames[0]] // 这里我们只读取第一张sheet
  //   var csv = this.XlsxTool.utils.sheet_to_csv(worksheet)
  //   console.log(csv)
  // }
  // csv2sheet(csv) {
  //   // csv转sheet对象
  //   var sheet = {} // 将要生成的sheet
  //   csv = csv.split('\n')
  //   csv.forEach(function (row, i) {
  //     row = row.split(',')
  //     if (i === 0) sheet['!ref'] = 'A1:' + String.fromCharCode(65 + row.length - 1) + (csv.length - 1)
  //     row.forEach(function (col, j) {
  //       sheet[String.fromCharCode(65 + j) + (i + 1)] = { v: col }
  //     })
  //   })
  //   return sheet
  // }
}
// 2.2 .1.Workbook Object
// workbook里面有什么东西呢， 我们打印出来看一下：
// 可以看到， SheetNames里面保存了所有的sheet名字， 然后Sheets则保存了每个sheet的具体内容（ 我们称之为Sheet Object）。 每一个sheet是通过类似A1这样的键值保存每个单元格的内容， 我们称之为单元格对象（ Cell Object）：

// 2.2 .2.Sheet Object
// 每一个Sheet Object表示一张表格， 只要不是!开头的都表示普通cell， 否则， 表示一些特殊含义， 具体如下：

// sheet['!ref']： 表示所有单元格的范围， 例如从A1到F8则记录为A1: F8；
// sheet[!merges]： 存放一些单元格合并信息， 是一个数组， 每个数组由包含s和e构成的对象组成， s表示开始， e表示结束， r表示行， c表示列；
// 等等；
// 2.2 .3.单元格对象
// 每一个单元格是一个对象（ Cell Object）， 主要有t、 v、 r、 h、 w等字段（ 详见这里）：
// t： 表示内容类型， s表示string类型， n表示number类型， b表示boolean类型， d表示date类型， 等等
// v： 表示原始值；
// f： 表示公式， 如B2 + B3；
// h： HTML内容
// w： 格式化后的内容
// r： 富文本内容rich text
// 等等
// 2.2 .4.读取workbook
// 根据!ref确定excel的范围， 再根据!merges确定单元格合并（ 如果有）， 最后输出整个table， 比较麻烦， 幸运的是， 插件自身已经写好工具类XLSX.utils给我们直接使用， 无需我们自己遍历， 工具类输出主要包括如下：

// 常用的主要是：

// XLSX.utils.sheet_to_csv： 生成CSV格式
// XLSX.utils.sheet_to_txt： 生成纯文本格式
// XLSX.utils.sheet_to_html： 生成HTML格式
// XLSX.utils.sheet_to_json： 输出JSON格式
// 常用的主要是sheet_to_csv或者sheet_to_html， 转csv的话会忽略格式、 单元格合并等信息， 所以复杂表格可能不适用。 转html的话会保留单元格合并， 但是生成的是 < html > < /html>代码，而不是<table></table > ，需要对表格进行一些定制时不太方便， 所以具体还是要视情况来采用合适的工具类。2.2.4. 读取workbook
// 普通方法：
// // 读取 excel文件
// function outputWorkbook(workbook) {
//  var sheetNames = workbook.SheetNames; // 工作表名称集合
//  sheetNames.forEach(name => {
//    var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
//    for(var key in worksheet) {
//     // v是读取单元格的原始值
//     console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v);
//    }
//  });
// }
// aoa_to_sheet: 这个工具类最强大也最实用了， 将一个二维数组转成sheet， 会自动处理number、 string、 boolean、 date等类型数据；
// table_to_sheet: 将一个table dom直接转成sheet， 会自动识别colspan和rowspan并将其转成对应的单元格合并；
// json_to_sheet: 将一个由对象组成的数组转成sheet；

// var wb; //读取
// var rABS = false;

// //开始导入
// function importf(obj) {
//   if (!obj.files) {
//     return;
//   }
//   var f = obj.files[0];
//   var reader = new FileReader();
//   reader.onload = function(e) {
//     var data = e.target.result;
//     if (rABS) {
//       wb = XLSX.read(btoa(fixdata(data)), { //手动转化
//         type: 'base64'
//       });
//     } else {
//       wb = XLSX.read(data, {
//         type: 'binary'
//       });
//     }
//     /**
//      * wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
//      * wb.Sheets[Sheet名]获取第一个Sheet的数据
//      */
//     var excelJson = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
//     document.getElementById("excelContent").innerHTML = JSON.stringify(excelJson);
//   };
//   if (rABS) {
//     reader.readAsArrayBuffer(f);
//   } else {
//     reader.readAsBinaryString(f);
//   }
// }

// //文件流转BinaryString
// function fixdata(data) {
//   var o = "",
//     l = 0,
//     w = 10240;
//   for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w +

//     w)));
//   o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
//   return o;
// }

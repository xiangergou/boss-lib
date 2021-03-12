/* eslint-disable no-useless-constructor */
/*
 * describe:  基于vxe-table vxe-grid数据格式的导出工具类函数 基础版
 * @Date:   2020-09-02
 * Author: Titans@2396757591@qq.com
 * @Last Modified time: 2020-09-3
 */
import { columns, datas } from './testData.js'
import xlsx from './util/xlsx'
export class Export {
  constructor(gloabelConfig = {}) {
    this.xlsx = xlsx
    this.exportHistory = [] // 导出历史记录
    this.exportDefaultConfig = {
      fileName: 'export.xlsx', // 文件名
      isExportHead: true, // 是否导出表头
      isExportFooter: true, // 是否导出表尾部
      isExportOriginalData: true, // 是否导出源数据
      isExportData: true, // 是否导出数据
      columns: columns, // 表头配置
      datas: datas, // 源数据
      index: true, // 是否添加序号
      ignoreColsTypes: ['dragSort', 'seq', 'checkbox', 'radio', 'optionRow', 'expand', 'attach', 'ach', 'list', 'attachlist'], // 忽略导出的列类型
      viewValueFormat(value, row, column) { // 视图数据格式化方法
        // return value
      }
    }
    this.exportDefaultConfig = Object.assign({}, this.exportDefaultConfig, gloabelConfig)
  }
  exportExcel(curUserConfig = {}) {
    // 导出excel
    this.init(curUserConfig)
    this.setExportColums()
    this.generateExportRowsMap(this.curExportConfig.columns)
    this.generateExportViewDataSource()
    if (this.curExportConfig.isExportOriginalData) {
      this.generateExportOriginalDataSource()
    }
    this.exportDownload(this.Xlsx)
  }
  init(obj) {
    // 初始化并记录上次导出历史
    this.headerRows = 1
    this.dataColMap = []
    this.headerRowsMap = {}
    this.exportDefaultConfig.viewValueFormat = this.defaultViewValueFormat
    this.curExportConfig = Object.assign({}, this.exportDefaultConfig, obj)
    // let xlsx = window.xlsx
    this.Xlsx = new this.xlsx.File()
    this.exportHistory.push({ exportConfig: this.curExportConfig, exportDataSource: this.Xlsx })
    this.exportHistory = this.exportHistory.reverse().slice(0, 20).reverse()
  }
  setExportColums() {
    // 设置导出列
    let self = this
    this.curExportConfig.columns = this.curExportConfig.columns.filter((item) => {
      return self.curExportConfig.ignoreColsTypes.indexOf(item.type) < 0
    })
    if (this.curExportConfig.index) {
      this.curExportConfig.columns.unshift({ title: '序号', field: 'seqIndex', type: 'seqIndex' })
    }
  }
  generateExportRowsMap(columns, curRowIndex = 1, pcCount) {
    // 生成视图数据导出元数据 列映射数据
    let self = this
    columns.forEach((rowConlum, index) => {
      if (curRowIndex > self.headerRows) {
        self.headerRows = curRowIndex
      }
      if (Array.isArray(rowConlum.children) && rowConlum.children.length) {
        self.generateExportRowsMap(rowConlum.children, curRowIndex + 1, rowConlum.children.length)
      } else {
        // if (rowConlum !== undefined) {
        //   rowConlum.pcCount = pcCount
        //   // self.dataColCellsMap[rowConlum.field] = pcCount
        // }
        self.dataColMap.push(rowConlum)
      }
    })
  }
  defaultViewValueFormat(value, row, column) {
    let render = column.editRender || column.cellRender || column.contentRender
    if (render && render.name) {
      let options = render.options || []
      switch (render.name) {
        case '$treeinput':
          return (row[column.field + 'code'] + '-' + row[column.field + 'name']).replace(/(null-null|undefined-undefined)/ig, '')
        case '$treeText':
          return (row[column.field + 'code'] + '-' + row[column.field + 'name']).replace(/(null-null|undefined-undefined)/ig, '')
        case '$span':
          return value
        case '$href':
          return value
        case '$EditDownTextarea':
          return value
        case '$EditDownConditions':
          return value
        case '$moneyRender':
          return parseFloat(value).toFixed(2)
        case '$calculateRender':
          return parseFloat(value).toFixed(2)
        case '$vxeDays':
          return value
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
        default:
          return value
      }
    } else {
      return value
    }
  }
  generateVisibleHeaderRowsMap() {
    // 生成嵌套表头行映射数据
    for (let i = 1; i <= this.headerRows; i++) {
      this.headerRowsMap['rows' + i] = this.sheetVisibleData.addRow()
    }
  }
  generateExportViewDataSource() {
    // 生成视图数据导出数据源
    if (this.curExportConfig.isExportOriginalData) {
      this.sheetVisibleData = this.Xlsx.addSheet('视图数据')
    } else {
      this.sheetVisibleData = this.Xlsx.addSheet(this.curExportConfig.fileName.replace('.xlsx', ''))
    }
    this.generateVisibleHeaderRowsMap()
    this.riverGenerateExportNestedHeader(this.curExportConfig.columns)
    this.setSheetCol(this.sheetVisibleData)
    this.generateExportViewDataBody(this.curExportConfig.datas)
  }
  setSheetCol(sheet, type = 'title') {
    // 设置 列信息
    // collapsed: false
    // hidden: false
    // max: 1
    // min: 1
    // numFmt: ""
    // outlineLevel: 0
    // style: Style
    // align: (...)
    // applyAlignment: (...)
    // applyBorder: (...)
    // applyFill: (...)
    // applyFont: (...)
    // border: (...)
    // fill: (...)
    // font: (...)
    // width:0
    // namedStyleIndex: (...)
    let self = this
    sheet.cols.forEach((col, colIndex) => {
      col.width = self.getColWidth(colIndex, type)
      col.max = 2000
      col.field = this.dataColMap[colIndex]['field']
    })
  }
  getColWidth(colIndex, type) {
    // 获取colwidth
    let text = this.dataColMap[colIndex][type]
    if (!isNaN(parseInt(this.dataColMap[colIndex].width))) {
      return Math.ceil(this.dataColMap[colIndex].width / 10)
    } else if (text.length < 5) {
      return 15
    }
    return Math.ceil(this.getStrByte(text) * 2)
  }
  getStrByte(str) {
    //  获取字符串字节数
    let arr = str.split('')
    let len = arr.length
    let count = 0
    for (let i = 0; i < len; i++) {
      let s = escape(arr[i])
      // 例如：s = '你'; escape(a); "%u4F60"
      if (s.indexOf('%u') >= 0) {
        count = count + 2
      } else {
        count++
      }
    }
    console.log(str, count)
    return count
  }
  generateExportOriginalDataSource() {
    // 生成源数据导出数据源
    this.sheetOriginalData = this.Xlsx.addSheet('源数据')
    this.generateExportOriginalDataHeader()
    this.generateExportOriginalDataBody(this.curExportConfig.datas)
    this.setSheetCol(this.sheetOriginalData, 'field')
  }
  riverGenerateExportNestedHeader(columns, curRowIndex = 1, pCell) {
    // 递归生成嵌套表头
    let self = this
    columns.forEach((column, index) => {
      if (Array.isArray(column.children) && column.children.length) {
        let cell0 = self.generateCurNestedHeaderCell(self.headerRowsMap['rows' + curRowIndex], column, curRowIndex, pCell)
        self.riverGenerateExportNestedHeader(column.children, curRowIndex + 1, cell0)
      } else {
        self.generateCurNestedHeaderCell(self.headerRowsMap['rows' + curRowIndex], column, curRowIndex, pCell)
      }
    })
  }
  generateCurNestedHeaderCell(row, column, curRows, pCell) {
    // 生成表头数据并补齐空位
    // cellType: (...)
    // date1904: (...)
    // formula: (...)
    // hMerge: (...)
    // hidden: (...)
    // numFmt: (...)
    // row: (...)
    // vMerge: (...)
    // _style: (...)
    // _value: (...)
    let cell0 = {}
    if (Array.isArray(column.children) && column.children.length) {
      let { floorLength } = this.getFloorData(column.children)
      // for (let i = 0; i < column.children.length; i++) {
      for (let i = 0; i < floorLength; i++) {
        let cell = row.addCell()
        if (i === 0) {
          cell.value = column['title']
          cell.hMerge = floorLength - 1
          cell.vMerge = 0
          cell0 = cell
        } else {
          cell.value = column['title']
          cell.hMerge = 0
          cell.vMerge = 0
        }
        this.generateCellVisibletitleStyle(cell)
      }
    } else {
      let cellSing = row.addCell()
      cellSing.value = column['title']
      cellSing.hMerge = 0
      cellSing.vMerge = this.headerRows - curRows
      cell0 = cellSing
      this.generateCellVisibletitleStyle(cellSing)
      this.supplementHeaderVMergeCells(row, column, curRows, pCell)
      return cell0
    }
  }
  getFloorData(treeData) {
    // 获取当前嵌套子集的单元格个数以及深度
    let max = 0
    let floorCols = []
    function each(data, floor) {
      data.forEach((rowConlum, index) => {
        if (floor > max) {
          max = floor
        }
        if (Array.isArray(rowConlum.children) && rowConlum.children.length) {
          each(rowConlum.children, floor + 1, rowConlum.children.length)
        } else {
          floorCols.push(rowConlum)
        }
      })
    }
    each(treeData, 1)
    return {
      floor: max,
      floorLength: floorCols.length
    }
  }
  generateExportViewDataBody(data) {
    // 生成视图数据导出主体数据
    let self = this
    data.forEach((row, rowIndex) => {
      let newrow = self.sheetVisibleData.addRow()
      self.dataColMap.forEach((column, columnIndex) => {
        let cell = newrow.addCell()
        self.generateCellViewValue(cell, row, column, rowIndex)
      })
    })
  }
  supplementHeaderVMergeCells(row, column, curRows, pCell) {
    // 当表头有合计行时补齐行单元格空位
    for (let i = curRows + 1; i <= this.headerRows; i++) {
      if (pCell) {
        let cells = pCell.vMerge
        for (let i = 0; i < cells; i++) {
          this.headerRowsMap['rows' + i].addCell()
        }
      } else {
        this.headerRowsMap['rows' + i].addCell()
      }
    }
  }
  generateCellViewValue(cell, item, column, rowIndex) {
    // 生成body单元格数据
    if (column.field === 'seqIndex') {
      cell.value = rowIndex + 1
    } else {
      cell.value = this.getViewCellValue(item, column)
    }
    this.generateCellViewValueStyle(cell, column)
  }
  getViewCellValue(item, column) {
    // 获取body单元格视图数据
    return this.curExportConfig.viewValueFormat(item[column.field], item, column)
    // item[column.field]
  }
  generateCellVisibletitleStyle(cell) {
    // 生成表头样式
    cell.style.align = {
      indent: 0,
      shrinkToFit: false,
      textRotation: 0,
      wrapText: false,
      h: 'center',
      v: 'center'
    }
    cell.style.border = {
      left: 'thin',
      right: 'thin',
      top: 'thin',
      bottom: 'thin',
      leftColor: 'FF000000',
      rightColor: 'FF000000',
      topColor: 'FF000000',
      bottomColor: 'FF000000'
    }
    cell.style.font = {
      color: '00000000',
      bold: true,
      family: 0,
      charset: 0,
      italic: false,
      underline: false,
      size: 12,
      name: 'Verdana'
    }
    cell.style.fill = {
      bgColor: 'ffffffff',
      fgColor: 'ffD2E9FF',
      patternType: 'solid'
    }
  }
  generateCellViewValueStyle(cell, column) {
    cell.style.border = {
      left: 'thin',
      right: 'thin',
      top: 'thin',
      bottom: 'thin',
      leftColor: 'FF000000',
      rightColor: 'FF000000',
      topColor: 'FF000000',
      bottomColor: 'FF000000'
    }
    cell.style.align = {
      indent: 0,
      shrinkToFit: false,
      textRotation: 0,
      wrapText: false,
      h: this.getCellValueAlign(column),
      v: 'center'
    }
  }
  getCellValueAlign(column) {
    let render = column.editRender || column.cellRender || column.contentRender
    switch (column.type) {
      case 'money':
        return 'right'
      case 'seqIndex':
        return 'center'
      default:
        if (render && render.name) {
          switch (render.name) {
            case '$moneyRender':
              return 'right'
            case '$calculateRender':
              return 'right'
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
  generateExportOriginalDataHeader() {
    // 设置表头部样式
    /**
     * Cell intended to provide user access to the contents of Cell within an xlsx.Row.
     *
     * ```js
     * const cell = row.addCell();
     * cell.value = 'I am a cell!';
     * cell.hMerge = 2;
     * cell.vMerge = 1;
     * cell.style.fill.patternType = 'solid';
     * cell.style.fill.fgColor = '00FF0000';
     * cell.style.fill.bgColor = 'FF000000';
     * cell.style.align.h = 'center';
     * cell.style.align.v = 'center';
     * ```
     *
     * Set the cell value
     *
     * ```js
     * const cell = row.addCell();
     * // Date type
     * cell.setDate(new Date());
     * // Number type
     * cell.setNumber(123456);
     * cell.numFmt = '$#,##0.00';
     * ```
     */
    let self = this
    let newrow = self.sheetOriginalData.addRow()
    self.dataColMap.forEach((column, columnIndex) => {
      let cell = newrow.addCell()
      self.generateCellVisibletitleStyle(cell, column)
      cell.value = column.field || ''
    })
  }
  generateExportOriginalDataBody(data) {
    // 生成body源数据
    let self = this
    data.forEach((row, rowIndex) => {
      let newrow = self.sheetOriginalData.addRow()
      self.dataColMap.forEach((column, columnIndex) => {
        let cell = newrow.addCell()
        self.generateCellViewValueStyle(cell, column)
        if (column.field === 'seqIndex') {
          cell.value = rowIndex + 1
        } else {
          cell.value = row[column.field] === undefined ? '' : row[column.field]
        }
      })
    })
  }
  exportDownload(exportXlsx) {
    // 下载
    let self = this
    exportXlsx.saveAs('blob').then(function(content) {
      const blob = new Blob([content], {
        type: 'application/octet-stream'
      })
      let objectUrl = URL.createObjectURL(blob)
      if ('download' in document.createElement('a')) {
        let a = document.createElement('a')
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', self.curExportConfig.fileName)
        a.click()
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, self.curExportConfig.fileName)
      }
    })
  }
}
// 调用
// const $globalExport= new Export()
// $globalExportExcel.exportExcel({
//   fileName: 'export.xlsx', // 文件名
//   isExportHead: true, // 是否导出表头
//   isExportFooter: true, // 是否导出表尾部
//   isExportOriginalData: true, // 是否导出源数据
//   isExportData: true, // 是否导出数据
//   columns: [], // 表头配置
//   datas: [], // 数据源头
//   index: true, // 是否添加序号
//   ignoreColsTypes: ['dragSort', 'seq', 'checkbox', 'radio', 'optionRow', 'expand'],
//   viewValueFormat(value, row, column) {
//     return value
//   }
// })

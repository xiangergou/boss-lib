/* eslint-disable no-useless-constructor */
/*
 * describe:  基于vxe-table vxe-grid数据格式的导出工具类函数 基础版
 * @Date:   2020-09-02
 * Author: Titans@2396757591@qq.com
 * @Last Modified time: 2020-11-30
 */
// import { columns, datas } from './testData.js'
// import xlsx from 'js-xlsx'
// import jszip from './util/jszipU.js'
import { defaultViewValueFormat, defaultViewValueFormatType, getCellValueAlign, getCellViewTitle } from './exportUtil.js'
import XlsxTool from 'xlsx'
import FileSaver from 'file-saver'
export class Export {
  constructor(gloabelConfig = {}) {
    this.XlsxTool = XlsxTool
    this.xlsx = window.xlsx
    this.aTag = document.createElement('a')
    this.exportHistory = [] // 导出历史记录
    this.exportDefaultConfig = {
      saveType: '.xlsx',
      fileName: 'export', // 文件名
      dataType: 'fullData',
      isExportOnlySourceField: false, // 是否只导出数据源表头字段，
      isExportOnlyViewTitle: false, // 是否只导出数据表头名称，
      isExportHead: true, // 是否导出表头
      exportViewTitleType: 'nestTitle', // nestTitle(嵌套表头)， singTitle(单表头)
      isExportFooter: false, // 是否导出表尾部
      isExportOriginalData: true, // 是否导出源数据
      isExportData: true, // 是否导出数据
      columns: [], // 表头配置
      datas: [], // 源数据,
      selection: [], // 选中数据
      isExportTree: false, // 是否是树形数据
      index: true, // 是否添加序号,
      ignoreColsTypes: ['dragSort', 'seq', 'checkbox', 'radio', 'optionRow', 'expand', 'attach', 'ach', 'list', 'attachlist', 'gloableOptionRow'], // 忽略导出的列类型
      viewValueFormat(value, row, column) { // 视图数据格式化方法
        // return value
      },
      footerMethods({ columns, data }) {
        return columns.map((column, columnIndex) => {
          //  combinedType: ['average', 'total'],
          let columnIndexText = '合计'
          let combinedType = 'total'
          if (columnIndex === 0) {
            return columnIndexText
          } else if (Array.isArray(column.combinedType) && column.combinedType.indexOf(combinedType) >= 0) {
            try {
              let result = data.map((item, index) => {
                let value = (typeof (item[column.field]) === 'number' || typeof (item[column.field]) === 'string') ? parseFloat(item[column.field].toString().split(',').join('')) : 0
                return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
              })
              if (result.length) {
                result = result.reduce((prev, next) => {
                  return prev + next
                })
                result = (result).toFixed(2)
                return result
              } else {
                return 0
              }
            } catch (e) {
              throw (e)
            }
          } else {
            return ''
          }
        })
      }
    }
    this.exportDefaultConfig = Object.assign({}, this.exportDefaultConfig, gloabelConfig)
  }
  exportExcel(curUserConfig = {}, context, cb) {
    this.context = context
    // 导出excel
    this.init(curUserConfig)
    this.generateExportRowsMap(this.curExportConfig.columns)
    this.curExportConfig.datas = this.curExportConfig[this.curExportConfig.dataType]
    if (this.curExportConfig.isExportOnlySourceField || this.curExportConfig.isExportOnlyViewTitle) {
      this.generateExportSourceField(this.curExportConfig.isExportOnlySourceField ? 'field' : 'title')
    } else {
      if (this.curExportConfig.isExportData) {
        this.generateExportViewDataSource()
      }
      if (this.curExportConfig.isExportOriginalData) {
        this.generateExportOriginalDataSource()
      }
    }
    if (this.curExportConfig.saveType === '.xlsx') {
      this.exportDownload(this.Xlsx)
    } else {
      this.downloadCsv()
    }
  }
  init(obj) {
    // 初始化并记录上次导出历史
    this.headerRows = 1
    this.dataColMap = []
    this.headerRowsMap = {}
    this.curExportConfig = Object.assign({}, this.exportDefaultConfig, obj)
    this.curExportConfig.viewValueFormat = defaultViewValueFormat
    this.curExportConfig.viewValueFormatType = defaultViewValueFormatType
    this.setExportColumns()
    // let xlsx = window.xlsx
    this.Xlsx = new this.xlsx.File()
    this.exportHistory.push({ exportConfig: this.curExportConfig, exportDataSource: this.Xlsx })
    this.exportHistory = this.exportHistory.reverse().slice(0, 20).reverse()
  }
  setExportColumns() {
    // 设置导出列
    let self = this
    this.curExportConfig.columns = this.curExportConfig.columns.filter((item) => {
      if (item.treeNode) {
        return false
      } else {
        return self.curExportConfig.ignoreColsTypes.indexOf(item.type) < 0
      }
    })
    // if (this.curExportConfig.index) {
    //   this.curExportConfig.columns.unshift({ title: '序号', field: 'seqIndex', type: 'seqIndex' })
    // }
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
  generateVisibleHeaderRowsMap() {
    // 生成嵌套表头行映射数据
    for (let i = 1; i <= this.headerRows; i++) {
      this.headerRowsMap['rows' + i] = this.sheetVisibleData.addRow()
    }
  }
  generateExportSourceField(type) {
    let self = this
    this.sheetFieldData = this.Xlsx.addSheet(this.curExportConfig.fileName.replace('.xlsx', ''))
    let newrow = self.sheetFieldData.addRow()
    self.dataColMap.forEach((column, columnIndex) => {
      let cell = newrow.addCell()
      cell.value = column[type]
      cell.hMerge = 0
      cell.vMerge = 0
      self.generateCellVisibletitleStyle(cell)
    })
  }
  generateExportViewDataSource() {
    // 生成视图数据导出数据源
    if (this.curExportConfig.isExportOriginalData) {
      this.sheetVisibleData = this.Xlsx.addSheet('视图数据')
    } else {
      this.sheetVisibleData = this.Xlsx.addSheet(this.curExportConfig.fileName.replace('.xlsx', ''))
    }
    this.generateVisibleHeaderRowsMap()
    if (this.curExportConfig.isExportHead) {
      if (this.curExportConfig.isExportHead === 'nestTitle') {
        this.riverGenerateExportNestedHeader(this.curExportConfig.columns)
      } else {
        this.riverGenerateExportNestedHeader(this.dataColMap)
      }
    }
    this.setSheetCol(this.sheetVisibleData)
    this.generateExportViewDataBody(this.curExportConfig.datas)
    if (this.curExportConfig.isExportFooter) {
      this.generateExportViewDatafooter(this.curExportConfig.datas)
    }
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
    return count
  }
  generateExportOriginalDataSource() {
    // 生成源数据导出数据源
    this.sheetOriginalData = this.Xlsx.addSheet('源数据')
    if (this.curExportConfig.isExportHead) {
      this.generateExportOriginalDataHeader()
    }
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
          cell.value = getCellViewTitle(column)
          cell.hMerge = floorLength - 1
          cell.vMerge = 0
          cell0 = cell
        } else {
          cell.value = getCellViewTitle(column)
          cell.hMerge = 0
          cell.vMerge = 0
        }
        this.generateCellVisibletitleStyle(cell)
      }
    } else {
      let cellSing = row.addCell()
      cellSing.value = getCellViewTitle(column)
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
  generateExportViewDataBody(data, pRowIndex) {
    // 生成视图数据导出主体数据
    let self = this
    data.forEach((row, rowIndex) => {
      let newrow = self.sheetVisibleData.addRow()
      row.seqIndex = pRowIndex === undefined ? rowIndex + 1 : pRowIndex + '.' + (+rowIndex + 1)
      self.dataColMap.forEach((column, columnIndex) => {
        let cell = newrow.addCell()
        self.generateCellViewValue(cell, row, column, rowIndex + 1, pRowIndex)
      })
      if (self.curExportConfig.isExportTree && Array.isArray(row.children) && row.children.length) {
        self.generateExportViewDataBody(row.children, row.seqIndex)
      }
    })
  }
  generateExportViewDatafooter(data) {
    let self = this
    let footData = this.curExportConfig.footerMethods({ columns: self.dataColMap, data: data })
    let newrow = this.sheetVisibleData.addRow()
    this.dataColMap.forEach((column, columnIndex) => {
      let cell = newrow.addCell()
      self.generateFooterCellViewValue(cell, footData[columnIndex], column)
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
  generateCellViewValue(cell, item, column, rowIndex, pRowIndex) {
    // 生成body单元格数据
    if (column.field === 'seqIndex') {
      cell.value = pRowIndex !== undefined ? pRowIndex + '.' + rowIndex : rowIndex
    } else {
      cell.value = this.getViewCellValue(item, column)
      cell.cellType = this.getViewCellValueType(item, column)
    }
    this.generateCellViewValueStyle(cell, column)
  }
  generateFooterCellViewValue(cell, value, column) {
    // 生成footer单元格数据
    cell.value = value
    this.generateCellViewValueStyle(cell, column)
  }
  getViewCellValueType(item, column) {
    return this.curExportConfig.viewValueFormatType(item[column.field], item, column)
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
      h: getCellValueAlign(column),
      v: 'center'
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
  generateExportOriginalDataBody(data, pRowIndex) {
    // 生成body源数据
    let self = this
    data.forEach((row, rowIndex) => {
      let newrow = self.sheetOriginalData.addRow()
      row.seqIndex = pRowIndex === undefined ? rowIndex + 1 : pRowIndex + '.' + (+rowIndex + 1)
      self.dataColMap.forEach((column, columnIndex) => {
        let cell = newrow.addCell()
        self.generateCellOrangeValue(cell, row, column, rowIndex + 1, pRowIndex)
      })
      if (self.curExportConfig.isExportTree && Array.isArray(row.children) && row.children.length) {
        self.generateExportOriginalDataBody(row.children, row.seqIndex)
      }
    })
  }
  generateCellOrangeValue(cell, item, column, rowIndex, pRowIndex) {
    // 生成body单元格数据
    if (column.field === 'seqIndex') {
      cell.value = pRowIndex !== undefined ? pRowIndex + '.' + rowIndex : rowIndex
    } else {
      cell.value = item[column.field] === undefined ? '' : item[column.field]
    }
    this.generateCellViewValueStyle(cell, column)
  }
  toBuffer(wbout) {
    const buf = new ArrayBuffer(wbout.length)
    const view = new Uint8Array(buf)
    for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
    return buf
  }
  exportDownload(exportXlsx) {
    // 下载
    let self = this
    // const wbout = this.XlsxTool.write(exportXlsx, { bookType: 'xlsx', bookSST: false, type: 'binary' })
    // const blob = new Blob([this.toBuffer(wbout)], { type: 'application/octet-stream' })
    exportXlsx.saveAs('blob').then(function (content) {
      const blob = new Blob([content], {
        type: 'application/octet-stream'
      })
      // var blob = new Blob(['Hello, world!'], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, self.curExportConfig.fileName + self.curExportConfig.saveType)
      // let objectUrl = URL.createObjectURL(blob)
      // if ('download' in document.createElement('a')) {
      //   let aTag = self.aTag
      //   aTag.setAttribute('href', objectUrl)
      //   aTag.setAttribute('download', self.curExportConfig.fileName + self.curExportConfig.saveType)
      //   aTag.click()
      //   self.curExportConfig.successCb(self.curExportConfig)
      // } else {
      //   // IE10+下载
      //   navigator.msSaveBlob(blob, self.curExportConfig.fileName)
      // }
    })
  }
  downloadCsv(exportXlsx) {
    let worksheet = this.sheetVisibleData // 这里我们只读取第一张sheet
    let csv = this.XlsxTool.utils.sheet_to_csv(worksheet)
    let blob = new Blob(['\uFEFF' + csv], {
      type: 'text/plaincharset=utf-8'
    })
    let aTag = this.aTag
    aTag.setAttribute('download', this.curExportConfig.fileName + this.curExportConfig.saveType)
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
    URL.revokeObjectURL(blob)
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

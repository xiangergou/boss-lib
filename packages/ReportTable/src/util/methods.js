// method   Author:Titans@2396757591@qq.com
import { columnsMap } from '../config/dataMap/dataMap'
const initReportTable = {// 初始化报表
  initCreated() {

  },
  initMounted() {
    this.initEditTable()
  },
  initEditTable(obj = { cols: 8, rows: 10 }) {
    const { cols, rows } = obj
    this.columns = [
      {
        title: '*',
        field: 'index',
        className: 'excel-index',
        type: 'index',
        width: 50,
        align: 'center',
        headerAlign: 'center'
      }
    ].concat(columnsMap.columnsLetterMap.slice(0, cols).map((name, index) => {
      return {
        field: columnsMap.columnsLetterMap[index],
        title: columnsMap.columnsLetterMap[index],
        width: 'auto',
        headerAlign: 'center',
        editRender: {
          name: '$vxeInput'
        }
      }
    }))
    this.tableData = Array.from(new Array(rows)).map((num, index) => {
      let item = {}
      columnsMap.columnsLetterMap.slice(0, cols).forEach(name => {
        item[name] = ''
      })
      return item
    })
  }
}
const reportTableMapDataUtil = {// 报表支撑数据维护

}
const optionTool = {

}

export default {
  ...initReportTable,
  ...reportTableMapDataUtil,
  ...optionTool
}

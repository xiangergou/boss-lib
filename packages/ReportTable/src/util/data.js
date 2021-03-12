
// data   Author:Titans@2396757591@qq.com

export default function () {
  return {
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      activeMethod: ({ row, rowIndex, column, columnIndex }) => {
        return true
      },
      showStatus: false
    },
    showHeader: true,
    columns: [],
    tableData: []
  }
}

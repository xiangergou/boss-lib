export const excelContextMenu = {
  header: {
    options: [{
      code: 'addCol',
      name: '新增列'
    }, {
      code: 'delCol',
      name: '删除列'
    },
    {
      code: 'setColWidth',
      name: '设置列宽'
    }]
  },
  body: {
    options: [
      [
        {
          code: 'addRow',
          name: '新增行'
        }, {
          code: 'delRow',
          name: '删除行'
        },
        {
          code: 'setColWidth',
          name: '设置行高'
        }
      ],
      [
        {
          code: 'resetCellConfig',
          name: '重置单元格设置'
        }, {
          code: 'setCellConfig',
          name: '设置单元格'
        }
      ],
      [
        {
          code: 'mergeSelectCell',
          name: '合并单元格'
        },
        {
          code: 'cancelMergeCell',
          name: '取消单元格合并'
        }
      ]
    ]
  }
}

export const onExcelContextMenuClick = () => {

}

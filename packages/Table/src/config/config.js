// config   Author:Titans@2396757591@qq.com
export const columns = [
  {
    title: 'basicinfor',
    children: [
      {
        title: 'Name',
        field: 'name',
        editRender: {
          name: '$input',
          props: {
            type: 'string',
            redonly: true
          }
        }
      },
      {
        title: 'Age',
        field: 'age',
        sortable: true,
        editRender: {
          name: '$input',
          props: {
            type: 'number',
            redonly: true
          }
        }
      }]
  },
  {
    title: 'Sex',
    field: 'sex',
    editRender: {
      name: '$select',
      options: [
        { value: 1, label: '男' },
        { value: 0, label: '女' }
      ]
    }
  },
  {
    title: 'Personality',
    field: 'personality'
  },
  {
    title: 'Category',
    field: 'category',
    editRender: {
      name: '$select',
      options: [
        { value: '前端', label: '前端' },
        { value: '后端', label: '后端' },
        { value: '运维', label: '测试' },
        { value: '实施', label: '实施' },
        { value: '测试', label: '测试' }
      ]
    }
  },
  {
    title: 'Address',
    field: 'address',
    align: 'center',
    tooltip: true,
    visible: true,
    width: '10%',
    formatter: ''
  },
  {
    title: 'Status',
    field: 'status',
    editRender: {
      name: '$select',
      options: [
        { value: 1, label: '是' },
        { value: 0, label: '否' }
      ]
    }
  }]
export const tableData = [
  {
    name: 'John Brown',
    age: 18,
    sex: 0,
    category: '前端',
    address: 'New York No. 1 Lake Park',
    status: 0
  },
  {
    name: 'Jim Green',
    age: 24,
    sex: 1,
    category: '运维',
    address: 'London No. 1 Lake Park',
    status: 1
  },
  {
    name: 'Joe Black',
    age: 30,
    sex: 0,
    category: '后端',
    address: 'Sydney No. 1 Lake Park',
    status: 0
  },
  {
    name: 'Jon Snow',
    age: 26,
    sex: 1,
    status: 1,
    category: '实施',
    address: 'Ottawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake Park'
  },
  {
    name: 'Tom',
    age: 50,
    sex: 1,
    status: 1,
    category: '测试',
    address: 'Ottawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake Park'
  }]
export const tableConfig = {
  globalConfig: {
    // 全局配置
    checkType: 'checkbox', // hasCheckbox
    seq: true, // 序号列
    hasOptionRow: false // 操作列
  },
  formatters: {
  },
  filters: {},
  cellRenderConfig: {
    cellRender: {
      name: '$input'
    },
    personality: {
      type: 'cellRender', // renderEdit
      name: 'personality'
    },
    optionRow: {
      type: 'cellRender', // renderEdit
      name: 'optionRow'
    }
  },
  sorts: {
    age(prevRow, nexRow) {
    }
  },
  renderers: {
    optionRow: {
      renderDefault(h, cellRender, params, context) {
        let self = context.$grid.$parent
        let { row, column } = params
        // <a class="optionRow" href={row.link}>{'操作' + row[column.property]}</a>
        if (row.status === 0) {
          return [
            <a class="optionRow-delete fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'delete' }) }>删除</a>,
            <a class="optionRow-edit fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'edit' }) }>编辑</a>,
            <a class="optionRow-report fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'report' }) }>上报</a>,
            <a class="optionRow-detail fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'detail' }) }>详情</a>
          ]
        } else {
          return [
            <a class="optionRow-delete fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'delete' }) }>删除</a>,
            <a class="optionRow-detail fn-inline" onClick={() => self.onOptionRowClick({ row, column, optionType: 'detail' }) }>详情</a>
          ]
        }
      }
    },
    personality: {
      renderDefault(h, cellRender, { row, column }, context) {
        let sex = ['女', '男']
        let age = ['优秀青年', '杰出中年', '颐养天年']
        let result = age[Math.floor(row.age / 25)] + sex[row.sex]
        return [<span class="text">{ result }</span>]
      }
    }
  },
  methods: {
    // 用户自定义配置对应事件
    toolbarButtonClickEvent(obj, context, e) {
      switch (obj.code) {
        case '':
          break
        default:
      }
    },
    onOptionRowClick({ row, optionType }) {
      console.log(this)
      switch (optionType) {
        case 'delete':
          console.log('delete', row)
          break
        case 'edit':
          console.log('edit', row)
          break
        case 'report':
          console.log('report', row)
          break
        case 'detail':
          console.log('detail', row)
          break
        default:
      }
    }
  }
}
export let toolbarConfig = { // table工具栏配置
  buttons: [
    {
      code: 'toolbar-insert',
      name: '新增',
      callback(obj, context, e) {

      }
    },
    {
      code: 'toolbar-save',
      name: '保存',
      status: 'primary'
    },
    {
      code: 'toolbar-batch-delete',
      name: '批量删除'
    },
    {
      code: 'toolbar-export',
      name: '导出数据',
      type: 'text',
      status: 'warning'
    },
    {
      name: '禁用按钮',
      disabled: false,
      dropdowns: [
        {
          code: 'other1',
          name: '下拉的按钮1',
          type: 'text',
          disabled: false
        },
        {
          code: 'other2',
          name: '下拉的按钮2',
          type: 'text',
          disabled: true

        },
        {
          code: 'other3',
          name: '下拉的按钮3',
          type: 'text',
          disabled: false

        }]
    }
  ]
}
export let tableFormConfig = {
  items: [
    { field: 'keyword', title: '', itemRender: { name: '$input', props: { clearable: true, placeholder: '关键字查询' } } },
    { itemRender: { name: '$button', attrs: { type: 'submit', value: '查询' } } },
    { itemRender: { name: '$button', attrs: { type: 'reset', value: '重置' } } }
  ]
}

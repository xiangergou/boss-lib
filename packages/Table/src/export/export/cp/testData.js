/* eslint-disable */
export const columns = [
  {
    title: '展开',
    type: 'expand',
    contentRender: {
      name: '$contentTable',
      props: {
        params: {}
      }
    }
  },
  {
    title: 'basicinfor',
    children: [
      {
        title: 'Name',
        field: 'name',
        width: 150,
        align: 'center',
        filters: false,
        filterRender: { name: 'FilterInput' },
        editRender: {
          name: '$href',
          defaultValue: '默认的名字',
          props: {
            type: 'string',
            redonly: true,
            placeholder: '抢输入姓名'
          }
        }
      },
      {
        title: 'Age',
        field: 'age',
        sortable: true,
        width: 120,
        align: 'center',
        combinedType: ['average'],
        editRender: {
          name: '$input',
          defaultValue: 1,
          props: {
            type: 'number',
            placeholder: '抢输入年龄',
            redonly: true
          }
        }
      },
      {
        title: 'Sex',
        field: 'sex',
        width: 120,
        align: 'center',
        filters: [
          { value: 1, label: '男' },
          { value: 0, label: '女' }
        ],
        filterMultiple: true,
        // filterMethod({ value, row, column }) {
        //   return row[column.property].toLowerCase().indexOf(value.toLowerCase()) >= 0
        // },
        editRender: {
          name: '$select',
          options: [
            { value: 1, label: '男' },
            { value: 0, label: '女' }
          ],
          props: {
            placeholder: '请选择性别'
          }
        }
      },
      {
        field: 'eduBack',
        title: 'education background',
        span: 8,
        width: 250,
        editRender: {
          name: '$select',
          defaultValue: '005',
          options: ((str) => {
            return str.split('+').map((item, index) => {
              return { value: item.split('#')[0], label: item.split('#')[1] }
            })
          })('009#博士后+001#小学+002#初中+003#高中+004#中专+005#大专+006#本科+007#硕士+008#博士'),
          props: {
            placeholder: '请选择学历'
          }
        }
      },
      {
        title: 'Interest',
        field: 'interest',
        width: 250,
        align: 'center',
        editRender: {
          name: '$vxeCheckbox',
          options: [
            { value: 1, label: '绘画' },
            { value: 0, label: '棋牌' }
          ],
          props: {
            placeholder: '请选择兴趣'
          }
        }
      }]
  },
  {
    title: 'Name',
    field: 'name',
    width: 150,
    align: 'center',
    filters: false,
    filterRender: { name: 'FilterInput' },
    editRender: {
      name: '$href',
      defaultValue: '默认的名字',
      props: {
        type: 'string',
        redonly: true,
        placeholder: '抢输入姓名'
      }
    }
  },
  {
    title: 'Age',
    field: 'age',
    sortable: true,
    width: 120,
    align: 'center',
    combinedType: ['average'],
    editRender: {
      name: '$input',
      defaultValue: 1,
      props: {
        type: 'number',
        placeholder: '抢输入年龄',
        redonly: true
      }
    }
  },
  {
    title: 'basicinfor',
    children: [
    {
      title: 'Sex',
      children: [{
        title: 'Name',
        field: 'name',
        align: 'center',
        filters: false,
        filterRender: { name: 'FilterInput' },
        editRender: {
          name: '$href',
          defaultValue: '默认的名字',
          props: {
            type: 'string',
            redonly: true,
            placeholder: '抢输入姓名'
          }
        },
        children: [
          {
            title: 'Name',
            field: 'name',
            align: 'center',
            filters: false,
            filterRender: { name: 'FilterInput' },
            editRender: {
              name: '$href',
              defaultValue: '默认的名字',
              props: {
                type: 'string',
                redonly: true,
                placeholder: '抢输入姓名'
              }
            }
          },
          {
            title: 'Age',
            field: 'age',
            sortable: true,
            width: 120,
            align: 'center',
            combinedType: ['average'],
            editRender: {
              name: '$input',
              defaultValue: 1,
              props: {
                type: 'number',
                placeholder: '抢输入年龄',
                redonly: true
              }
            }
          }
        ]
      },
      {
        title: 'Age',
        field: 'age',
        sortable: true,
        width: 120,
        align: 'center',
        combinedType: ['average'],
        editRender: {
          name: '$input',
          defaultValue: 1,
          props: {
            type: 'number',
            placeholder: '抢输入年龄',
            redonly: true
          }
        }
      }],
      align: 'center',
      filters: [
        { value: 1, label: '男' },
        { value: 0, label: '女' }
      ],
      filterMultiple: true,
      // filterMethod({ value, row, column }) {
      //   return row[column.property].toLowerCase().indexOf(value.toLowerCase()) >= 0
      // },
      editRender: {
        name: '$select',
        options: [
          { value: 1, label: '男' },
          { value: 0, label: '女' }
        ],
        props: {
          placeholder: '请选择性别'
        }
      }
    },
    {
      field: 'eduBack',
      title: 'education background',
      span: 8,
      width: 250,
      editRender: {
        name: '$select',
        defaultValue: '005',
        options: ((str) => {
          return str.split('+').map((item, index) => {
            return { value: item.split('#')[0], label: item.split('#')[1] }
          })
        })('009#博士后+001#小学+002#初中+003#高中+004#中专+005#大专+006#本科+007#硕士+008#博士'),
        props: {
          placeholder: '请选择学历'
        }
      }
    },
    {
      title: 'Interest',
      field: 'interest',
      width: 250,
      align: 'center',
      editRender: {
        name: '$vxeCheckbox',
        options: [
          { value: 1, label: '绘画' },
          { value: 0, label: '棋牌' }
        ],
        props: {
          placeholder: '请选择兴趣'
        }
      }
    }]
  },
  {
    title: 'Position the glory',
    children: [
      {
        title: 'Category',
        field: 'category',
        width: 150,
        editRender: {
          name: '$select',
          defaultValue: '前端',
          options: [
            { value: '前端', label: '前端' },
            { value: '后端', label: '后端' },
            { value: '运维', label: '测试' },
            { value: '实施', label: '实施' },
            { value: '测试', label: '测试' }
          ],
          props: {
            placeholder: '请输入角色'
          }
        }
      },
      {
        title: 'Personality',
        width: 150,
        field: 'personality'
      },
      {
        title: 'Whether in office',
        field: 'status',
        width: 200,
        editRender: {
          name: '$vxeRadio',
          defaultValue: 1,
          options: [
            { value: 1, label: '是' },
            { value: 0, label: '否' }
          ],
          props: {
            placeholder: '是否在职'
          }
        }
      },
      {
        title: 'Working days',
        field: 'days',
        width: 200,
        editRender: {
          name: '$vxeDays',
          defaultValue: 0,
          props: {
            placeholder: '在职天数',
            type: 'number'
          }
        }
      }]
  },
  {
    title: 'calculation',
    children: [{
      title: 'income',
      field: 'income',
      fieldType: 'money',
      combinedType: ['average', 'total'],
      formula: '{age}>=18?Math.pow({age},4)/2:0',
      width: 150,
      align: 'right',
      cellRender: {
        name: '$calculateRender',
        defaultValue: 0,
        props: {}
      }
    },
    {
      title: 'Tax',
      field: 'tax',
      fieldType: 'money',
      align: 'right',
      combinedType: ['average', 'total'],
      width: 150,
      formula: '{income}>=60000?({income}-60000)*0.03:0',
      cellRender: {
        name: '$calculateRender',
        props: {
          type: 'float',
          placeholder: '应该交税额度'
        }
      }
    },
    {
      title: 'Deduction',
      field: 'deduction',
      width: 150,
      align: 'right',
      combinedType: ['average', 'total'],
      formula: '{income}*0.07',
      cellRender: {
        name: '$calculateRender',
        props: {
          type: 'float',
          placeholder: '其他扣除'
        }
      }
    },
    {
      title: 'Profit',
      field: 'profit',
      width: 150,
      align: 'right',
      combinedType: ['average', 'total'],
      formula: '{income}-{tax}-{deduction}',
      cellFormula: {
        // 4: '{0:income}*{1:tax}*{2:deduction}*{3:profit}'
        0: '{4:income}+{3:tax}+{2:deduction}+{1:profit}',
        4: '{0:income}+{1:tax}+{2:deduction}+{3:profit}'
      },
      cellRender: {
        name: '$calculateRender'
      }
    },
    {
      title: 'Bonus',
      width: 150,
      align: 'right',
      field: 'bonus',
      filters: [{ data: { type: 'has', isCase: false, value: '' } }],
      filterRender: { name: 'FilterComplex' },
      combinedType: ['average', 'total'],
      editRender: {
        name: '$moneyRender',
        props: {
          type: 'float'
        }
      }
    },
    {
      title: 'Actual income',
      width: 180,
      align: 'right',
      field: 'actualIncome',
      combinedType: ['average', 'total'],
      formula: '{profit}+{bonus}',
      cellRender: {
        name: '$calculateRender'
      }
    }]
  },
  {
    title: 'Address',
    field: 'address',
    align: 'left',
    filters: [{ data: { vals: [], sVal: '' } }],
    filterRender: { name: 'FilterContent' },
    width: 300,
    tooltip: true,
    editRender: {
      name: '$EditDownTextarea',
      defaultValue: '陕西省西安市',
      props: {
        type: 'text',
        placeholder: '请输入联系地址'
      }
    }
  },
  {
    title: 'Conditions',
    field: 'conditions',
    align: 'left',
    filters: [{ data: '' }],
    filterRender: { name: 'FilterInput' },
    width: 300,
    tooltip: true,
    editRender: {
      name: '$EditDownConditions',
      defaultValue: '',
      props: {
        matchSourcePostMethods: 'get',
        matchTargetPostMethods: 'get',
        matchSourceUrl: 'mp-b-user-service/v1/user/app/message',
        matchTargetUrl: 'mp-b-user-service/v1/user/app/message',
        matchSourcePostRequestParams: {},
        matchTargetRequestParams: {}
      }
    }
  }]
export const datas = [
  {
    name: 'jack',
    age: 25,
    sex: 1,
    days: 380,
    eduBack: '008',
    category: '前端',
    interest: [0, 1],
    bonus: 40000,
    income: 300000,
    actualIncome: 0,
    address: 'Sydney No. 1 Lake Park',
    conditions: '',
    status: 0
  },
  {
    name: 'Tim',
    age: 26,
    sex: 1,
    interest: [0, 1],
    days: 390,
    eduBack: '008',
    category: '前端',
    bonus: 50000,
    income: 400000,
    actualIncome: 0,
    address: 'Sydney No. 1 Lake Park',
    conditions: '',
    status: 0
  },
  {
    name: 'John Brown',
    age: 18,
    interest: [0],
    sex: 0,
    days: 480,
    income: 100000,
    bonus: 10000,
    actualIncome: 0,
    eduBack: '009',
    category: '前端',
    address: 'New York No. 1 Lake Park',
    conditions: '',
    status: 0
  },
  {
    name: 'Jim Green',
    age: 24,
    sex: 1,
    interest: [0, 1],
    eduBack: '008',
    income: 80000,
    bonus: 18000,
    days: 580,
    actualIncome: 0,
    category: '前端',
    address: 'London No. 1 Lake Park',
    conditions: '',
    status: 1
  },
  {
    name: 'Joe Black',
    age: 30,
    sex: 0,
    eduBack: '008',
    category: '前端',
    interest: [0],
    bonus: 20000,
    income: 50000,
    days: 880,
    actualIncome: 0,
    address: 'Sydney No. 1 Lake Park',
    conditions: '',
    status: 0
  },
  {
    name: 'Jon Snow',
    age: 26,
    sex: 1,
    eduBack: '007',
    income: 60000,
    bonus: 30000,
    days: 680,
    status: 1,
    actualIncome: 0,
    interest: [0],
    category: '前端',
    address: 'Ottawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake Park',
    conditions: ''
  },
  {
    name: 'Tom',
    age: 50,
    sex: 1,
    status: 1,
    bonus: 100000,
    days: 1680,
    interest: [0, 1],
    eduBack: '009',
    income: 70000,
    actualIncome: 0,
    category: '前端',
    address: 'Ottawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake ParkOttawa No. 2 Lake Park',
    conditions: ''
  }]
export const format = (value, row, column) => { // 自定义封装格式化方法
  if (Object.prototype.toString.call(value) == '[object Object]') {
    // 导出格式化自动调用格式化直接返回
    return value['cellValue']
  }
  if ('money,number,integer'.indexOf(column.type) != -1 && ((!value && value != 0) || value.length == 0 || isNaN(value) || (!this.showZero && parseFloat(value) == 0.00))) { // 金额为0 不显示
    return ''
  }
  if (row && this.levelShow) { // 只有单元格的值需要特殊处理
    let curColName = column.type == 'treeinput' ? column.field + 'code' : column.field // 获取当前的元素名称
    if (this.groupcoltolvlObj.hasOwnProperty(curColName) && row['rowlvlnum'] > this.groupcoltolvlObj[curColName]) { // 分组更细的不显示
      return ''
    }
  }
  if (row && !row['lvlgrouprow'] && !row[column.field] && row[column.field] != 0 && column.defaultvalue) { // 汇总出来的虚拟行不使用默认值
    if (column.type == 'treeinput' && !row[column.field + 'name']) {
      let treeDefaultVal = column.defaultvalue.split('-')
      row[column.field + 'id'] = treeDefaultVal[0]
      row[column.field + 'code'] = treeDefaultVal.length >= 2 ? treeDefaultVal[1] : ''
      row[column.field + 'name'] = treeDefaultVal.length >= 3 ? treeDefaultVal[2] : ''
    } else {
      row[column.field] = column.defaultvalue
    }
  }
  var result = value
  var fieldcache = this.defaultCacheFormatter[column.field]
  if (!fieldcache || JSON.stringify(fieldcache) == '{}') {
    fieldcache = {}
    if (column.refmodel && column.refmodel != '') {
      var arr = column.refmodel.split('+')
      for (var i = 0; i < arr.length; i++) {
        var oneArr = arr[i].split('#')
        var obj = {
          text: oneArr[1],
          val: oneArr[0]
        }
        fieldcache[oneArr[0]] = obj
      }
      this.defaultCacheFormatter[column.field] = fieldcache
    }
  }
  if (column.type == 'select' || column.type == 'radio') {
    if (fieldcache[value] && fieldcache[value].text) {
      result = fieldcache[value].text
    }
  }
  if (column.type == 'money') {
    let unit = nonStr(this.unit, 1)
    if (this.options.isunittypeshow && this.options.unittypedefaultval) {
      value = value * unit / this.options.unittypedefaultval
    }
    result = XEUtils.commafy(value, { digits: 2 })
  }

  if (column.type == 'treeinput') {
    if (row[column.field + 'id'] || row[column.field + 'code'] || row[column.field + 'name']) {
      let fmt = '#code-#name'
      if (column.colattrset && column.colattrset.formatter) { // 如果高级属性配置了格式 就赋值
        fmt = column.colattrset.formatter
      }
      let fmtArr = fmt.split('-')
      let fmLen = fmtArr.length
      for (let i = 0; i < fmLen; i++) {
        let frItem = fmtArr[i]
        let showField = nonStr(row[column.field + frItem.replace('#', '')]) || ''
        if (showField && i != fmLen - 1) {
          showField += '-'
        }
        fmt = fmt.replace(frItem + (i == fmLen - 1 ? '' : '-'), showField)
      }
      // 复选框需要特殊处理为code-name,code-name格式 fmt为 code,code-name,name格式
      if (column.colattrset && column.colattrset.showcheckbox) {
        let showField = ''
        let items = fmt.split('-')
        if (items.length) {
          let itemlength = items[0].split(',').length
          for (let i = 0; i < itemlength; i++) {
            for (let j = 0; j < items.length; j++) {
              if (j == items.length - 1) {
                showField += nonStr(items[j].split(',')[i])
              } else {
                showField += nonStr(items[j].split(',')[i]) + '-'
              }
            }
            showField += ','
          }
          fmt = showField.substring(0, showField.length - 1)
        }
      }
      result = fmt
    }
  }
  if (typeof column['formatter'] === 'function') {
    result = column['formatter'](value, row, column)
  }
  if (column['contentvisible'] != undefined && !column.contentvisible) { // 内容是否可见
    if (result) {
      var visibletext = []
      for (var i = 0; i < result.length; i++) {
        visibletext[i] = '*'
      }
      return visibletext.join('')
    }
  }
  if (this.filterName) {
    const filterRE = new RegExp(this.filterName, 'gi')
    return XEUtils.toString(result).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
  }
  return result
}

/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
/* eslint-disable eqeqeq */

let calcType = [
  {
    id: '001',
    name: '求和',
    value: 'COUNT'
  },
  {
    id: '002',
    name: '平均值',
    value: 'AVERAGE'
  },
  {
    id: '003',
    name: '最大值',
    value: 'MAX'
  },
  {
    id: '004',
    name: '最小值',
    value: 'MIN'
  },
  {
    id: '005',
    name: '混合运算',
    value: 'hybirdOpration'
  }
]
let CalcSymbols = [
  {
    id: '001',
    type: 'symbol',
    value: '+'
  },
  {
    id: '002',
    type: 'symbol',
    value: '-'
  },
  {
    id: '003',
    type: 'symbol',
    value: '*'
  },
  {
    id: '004',
    type: 'symbol',
    value: '/'
  },
  {
    id: '005',
    type: 'symbol',
    value: '='
  },
  {
    id: '006',
    type: 'symbol',
    value: '>'
  },
  {
    id: '007',
    type: 'symbol',
    value: '>='
  },
  {
    id: '008',
    type: 'symbol',
    value: '<'
  },
  {
    id: '009',
    type: 'symbol',
    value: '<='
  },
  {
    id: '010',
    type: 'symbol',
    value: '=='
  },
  {
    id: '011',
    type: 'symbol',
    value: '!='
  },
  {
    id: '012',
    type: 'symbol',
    value: '('
  },
  {
    id: '013',
    type: 'symbol',
    value: ')'
  },
  {
    id: '014',
    type: 'symbol',
    value: '['
  },
  {
    id: '015',
    type: 'symbol',
    value: ']'
  },
  {
    id: '016',
    type: 'symbol',
    value: 'in'
  },
  {
    id: '017',
    type: 'symbol',
    value: 'not in'
  },
  {
    id: '018',
    type: 'symbol',
    value: 'if'
  },
  {
    id: '019',
    type: 'symbol',
    value: 'else'
  },
  {
    id: '020',
    type: 'symbol',
    value: 'and'
  },
  {
    id: '021',
    type: 'symbol',
    value: 'or'
  },
  {
    id: '023',
    type: 'symbol',
    value: 'delete'
  }
]
let constraint = {
  checktypecode: 'error',
  colfield: 'cc41',
  coltitle: '工资类别',
  conditioncode: '{13708. cc41}==\'001\'',
  formuladet: '001#行政工资',
  formuladetcode: '001#行政工资',
  iscalculation: '2',
  isdisableempty: '0',
  issavecalculation: ' 0',
  settypecode: '<>',
  type: 'select'
}

let constraintConfig = {
  constrainttype: '1', // 1 计算 ,2 范围公式 3，禁用公式,
  constraintColField: '',
  condition: '',
  colValue: '',
  message: ''
}
export {
  calcType,
  CalcSymbols
}

// 全局渲染器   Author:Titans@2396757591@qq.com
// 全局提供表格和form配套渲染器共 15 组，分别为： 新全局下拉树，文本数字输入，下拉选择，计算渲染器，金额输入，下拉文本框，天数，时间日期，单选，多选，间隔时间或数值选择输入渲染器，开关，进度条，条件渲染器。其中，条件渲染器，进度条（评测和developing）

// 全局下拉树
export default {
  // 表格form通用渲染器
  // 输入
  $vxeInput: {
    type: 'text', // text, search, number, integer, float, password, date, time, datetime, week, month, year
    clearable: false, // 当有值时，是否在右侧显示清除按钮 默认 false,
    placeholder: '请输入', // 提示
    readonly: false, // 只读
    disabled: false, // 是否禁用,
    digits: 2, // 只对 type=float 有效，小数位数
    align: 'left', // left, center, right
    editable: true // 只对 type=date|time|datetime|week|month|year 有效，文本框是否允许输入
    // max: 100000000000, // 只对 type=number|integer|float 有效，最大值
    // min: 0 // 只对 type=number|integer|float 有效，最小值
  },
  // 下拉选择
  $vxeSelect: {
    multiple: false, // 是否多选,
    placeholder: '请选择', // 提示
    disabled: false, // 是否禁用,
    options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] // 下拉选项列表 1#是+0#否
  },
  // 金额输入
  $vxeMoney: {
    type: 'float',
    clearable: false, // 当有值时，是否在右侧显示清除按钮 默认 false,
    placeholder: '请输入', // 提示
    readonly: false, // 只读
    disabled: false, // 是否禁用,
    digits: 2, // 只对 type=float 有效，小数位数
    align: 'left', // left, center, right
    editable: true, // 只对 type=date|time|datetime|week|month|year 有效，文本框是否允许输入
    max: 100000000000, // 只对 type=number|integer|float 有效，最大值
    min: 0 // 只对 type=number|integer|float 有效，最小值
  },
  // 下拉文本输入
  $vxeEditDownTextarea: {

  },
  // 天数 不足0.25天按0记，大于0.75天按1天记，其他按0.5天记
  $vxeDays: {
    type: 'number',
    readonly: false, // 只读
    disabled: false, // 是否禁用,
    align: 'left' // left, center, right
  },
  // 时间
  $vxeTime: {
    type: 'date', // date, time, datetime, week, month, year
    format: 'YYYY-MM-DD', // "当前日期为YYYY-MM-DD，星期W，为第Q季度，时间为：hh:mm:ss:c
    clearable: false, // 当有值时，是否在右侧显示清除按钮 默认 false,
    placeholder: '请输入', // 提示
    readonly: false, // 只读
    align: 'left', // left, center, right
    editable: true // 只对 type=date|time|datetime|week|month|year 有效，文本框是否允许输入
    // max: 100000000000, // 只对 type=number|integer|float 有效，最大值
    // min: 0 // 只对 type=number|integer|float 有效，最小值
  },
  // 单选
  $vxeRadio: {
    disabled: false, // 是否禁用,
    options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] // 下拉选项列表 1#是+0#否
  },
  // 复选
  $vxeCheckbox: {
    disabled: false, // 是否禁用,
    options: [{ label: '类型0', value: 0 }, { label: '类型1', value: 1 }] // 下拉选项列表 0#类型0+1#类型1
  },
  // 开关
  $vxeSwitch: {
    disabled: false, // 是否禁用,
    options: [{ label: '开', value: 1 }, { label: '关', value: 0 }] // 下拉选项列表 1#开+0#关
  },
  // 进度条
  $vxeProgress: {
  },
  // 计算
  $vxeCalculate: {

  },
  // 下拉框json编辑
  $vxeEditDownJson: {

  },
  // 下拉树
  $vxeTree: {
    config: {
      showFilter: true, // 是否显示过滤
      isInitLoadData: false, // 初始化是否加载数据
      isleaf: 0, // 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
      levelno: -1, // 可选层级 数字级别
      valueKeys: ['code', 'name', 'id'],
      format: '{code}-{name}',
      placeholder: '请选择',
      disabled: false, // 是否禁用
      treeProps: {
        // 树配置选项
        labelFormat: '', // 树格式化 {code}-{name}
        nodeKey: 'id', // 树的主键
        label: 'name', // 树的显示lalel字段
        children: 'children' // 树的嵌套字段
      },
      axiosConfig: {
        successCode: '200', // 成功code
        statusField: 'rscode',
        method: 'post', // 请求方式
        url: '' // 'queryTreeAssistData', // 是否调用接口直接获取数据，当此项有值时将会自动家数据
      },
      multiple: false, // 是否多选,
      readonly: true, // 可录入
      clearable: true // 可清除
    },
    queryparams: {// 查询参数

    }

  }

}

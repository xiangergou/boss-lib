// watch   Author:Titans@2396757591@qq.com
export default {
  id: {
    handler(newvalue, oldValue) {
    },
    deep: true,
    immediate: true
  },
  tableGlobalConfig: { // 全局配置
    handler(newvalue, oldValue) {
      this.initTableGlobalConfig()
    },
    deep: true,
    immediate: true
  },
  tableColumnsConfigIn: { // 监听表头渲染数据
    handler(newvalue, oldValue) {
    },
    deep: true,
    immediate: true
  },
  tableConfig: { // 表格配置监听
    handler(newvalue, oldValue) {
      this.initTableConfig()
    },
    deep: true,
    immediate: true
  },
  toolbarConfig: { // 工具栏配置监听
    handler(newvalue, oldValue) {
    //   console.log(newvalue, oldValue)
      this.initToolbar()
    },
    deep: true,
    immediate: true
  },
  pagerConfig: { // 分页配置监听
    handler(newvalue, oldValue) {
      this.setPagerConfig()
    },
    deep: true,
    immediate: true
  },
  tableData: { // 表格数据
    handler(newvalue, oldValue) {
      this.initTableData()
    },
    immediate: true
  },
  tableColumnsConfig: { // 表头配置监听
    handler(newvalue, oldValue) {
      this.initTable()
    },
    deep: true,
    immediate: true
  },
  tableFormConfig: { // table Form配置监听
    handler(newvalue, oldValue) {
      this.initTableFormConfig()
    },
    deep: true,
    immediate: true
  },
  editConfig: { // table edit配置监听
    handler(newvalue, oldValue) {
      this.initEditConfig()
    },
    deep: true,
    immediate: true
  },
  keyboardConfig: { // 键盘配置
    // mouse-config 鼠标配置：
    //   | Mouse + Left | (area) 鼠标选取指定范围的单元格 |
    //   | Mouse + Right | (area) 鼠标选取选中位置的单元格 |
    //   | Mouse + Left + Ctrl | (area) 鼠标选取多区域的单元格 |
    //   | Mouse + Left | (extension) 鼠标左键按住区域内右下角延伸按钮，将区域横向或纵向扩大 |
    // keyboard-config 按键配置：
    //   | Ctrl + X | (isClip) 将单元格标记为剪贴状态并将内容复制到剪贴板，支持 Excel 和 WPS |
    //   | Ctrl + C | (isClip) 将单元格标记为复制状态并将内容复制到剪贴板，支持 Excel 和 WPS |
    //   | Ctrl + V | (isClip) 将剪贴板的内容粘贴到指定区域中，支持 Excel 和 WPS |
    //   | Ctrl + M | (isMerge) 将选取的单元格合并或取消合并 |
    //   | Ctrl + F | (isFNR) 查找单元格数据，全表或查找指定区域单元格数据 |
    //   | Ctrl + H | (isFNR) 替换单元格数据，全表或替换指定区域单元格数据 |
    //   | ArrowUp | （isArrow）如果存在，则移动到上面的单元格 |
    //   | Shift + ArrowUp | （isArrow）如果存在，则往上面延伸单元格区域 |
    //   | ArrowDown | （isArrow）如果存在，则移动到下面的单元格 |
    //   | Shift + ArrowDown | （isArrow）如果存在，则往下面延伸单元格区域 |
    //   | ArrowLeft | （isArrow）如果存在，则移动到左边的单元格 |
    //   | Shift + ArrowLeft | （isArrow）如果存在，则往左边延伸单元格区域 |
    //   | ArrowRight | （isArrow）如果存在，则移动到右边的单元格 |
    //   | Shift + ArrowRight | （isArrow）如果存在，则往右边延伸单元格区域 |
    //   | Tab | （isTab）如果存在，则移动到右边单元格；如果存在区域，则在指定区域内移动；如果移动到最后一列，则从下一行开始移到，以此循环 |
    //   | Tab + Shift | （isTab）如果存在，则移动到左边单元格，则在指定区域内移动；如果移动到第一列，则从上一行开始移到，以此循环 |
    //   | Spacebar | (isChecked) 如果选取的区域存在复选框，则切换勾选状态 |
    //   | Enter | （isEnter）如果存在，取消单元格编辑并移动到下面的单元格，则在指定区域内移动；如果移动到最后一行，则从下一列开始移到，以此循环 |
    //   | Enter + Shift | （isEnter）如果存在，取消单元格编辑并移动到上面的单元格，则在指定区域内移动；如果移动到第一行，则从上一列开始移到，以此循环 |
    //   | Delete | （isDel）清空单元格内容 |
    //   | Backspace | （isDel）清空单元格内容并激活为编辑状态 |
    //   | F2 | 如果存在，激活单元格为编辑状态 |
    //   | Escape | 如果存在，取消单元格编辑状态 |
    //   | * | （isEdit）按下除功能键之外的任意键激活覆盖式单元格编辑 |
    handler(newvalue, oldValue) {
    },
    deep: true,
    immediate: true
  },
  editRules: {// 校验
    handler(newvalue, oldValue) {
      this.initEditRules()
    },
    deep: true,
    immediate: true
  },
  expandConfig: { // table 展开行配置监听
    handler(newvalue, oldValue) {
      this.initExpandConfig()
    },
    deep: true,
    immediate: true
  },
  footerConfig: { // 表尾配置
    handler(newvalue, oldValue) {
      this.initFooterConfig()
    },
    deep: true,
    immediate: true
  },
  treeConfig: { // table 展开行配置监听
    handler(newvalue, oldValue) {
      this.initTreeConfig()
    },
    deep: true,
    immediate: true
  },
  moneyUnit: { // 金额单位变换
    handler(newvalue, oldValue) {
      this.setMoneyUnit(newvalue, oldValue)
    },
    immediate: true
  },
  contextMenuConfig: { // 右键菜单
    handler(newvalue, oldValue) {
      this.initContextMenuConfig()
    },
    immediate: true
  },
  checkboxConfig: { // 复选框
    handler(newvalue, oldValue) {
    },
    deep: true,
    immediate: true
  },
  rowStyle: { // rowStyle回调
    handler(newvalue, oldValue) {
    },
    immediate: true
  },
  cellStyle: { // cellStyle回调
    handler(newvalue, oldValue) {},
    immediate: true
  },
  defaultMoneyUnit: {
    handler(newvalue, oldValue) {
      this.moneyUnit = this.defaultMoneyUnit
    },
    immediate: true
  },
  calculateConstraintConfig: {
    handler(newvalue, oldValue) {
      this.initCalculateConstraintConfig()
    },
    deep: true,
    immediate: true
  },
  tableDataIn: {
    handler(newvalue, oldValue) {
      // debugger
    },
    immediate: true
  },
  importModalVisible: {
    handler(newvalue, oldvalue) {
      this.fileConfig.fileName = ''
    },
    immediate: true
  },
  highConfig: {
    handler(newvalue, oldValue) {
      this.highConfigIn = Object.assign(this.highConfigIn, this.highConfig)
    },
    deep: true,
    immediate: true
  },
  contentTableConfig: {
    handler(newvalue, oldValue) {
    },
    deep: true,
    immediate: true
  }
}

const defaultCardConfig = {
  btnColor: '#E3F2FE', // 按钮背景色
  btnHoverColor: '#2D8DFD', // 按钮背景色
  iconColor: '#2D8DFD', // 矢量图标颜色
  title: {}, // 标题
  buttons: [], // 按钮组
  methods: {
    bsCardClickEvent: function(obj, $this) {
      // console.log('回调方式二', obj, $this.$options)
    }
  }
}

const defaultCardData = {
  type: 'baseInfo',
  btnHoverColorName: 'btn-hover__class', // card按钮悬浮和选中时样式名称
  iconColorName: 'icon-class', // card小icon图标样式名称
  title: {
    icon: 'base-base-info-icon',
    title: '基础信息管理'
  },
  buttons: [
    {
      icon: 'base-fun-menu', // 按钮icon矢量图
      title: '功能菜单',
      code: 'funMenu' // 以这个为基准，cardBtns下的要对应 *  code值不要改
    },
    {
      icon: 'base-oprate-guide', // 按钮icon矢量图
      title: '操作指南',
      code: 'oprateGuide' // 以这个为基准，cardBtns下的要对应 * code值不要改
    },
    {
      icon: 'base-agent-item', // 按钮icon矢量图
      title: '代办事项',
      num: 0,
      code: 'agentItem' // 以这个为基准，cardBtns下的要对应 * code值不要改
    },
    {
      icon: 'base-done-item', // 按钮icon矢量图
      title: '已办事项',
      num: 0,
      code: 'doneItem' // 以这个为基准，cardBtns下的要对应 * code值不要改
    }
  ]
}

export {
  defaultCardConfig,
  defaultCardData
}

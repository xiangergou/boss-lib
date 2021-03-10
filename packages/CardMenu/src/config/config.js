const defaultConfig = {
  // card上颜色
  color: [
    {
      btnColor: '#E4F2FF', // card按钮初始背颜色
      iconColor: '#2D8DFD' // 按钮加重时颜色
    },
    {
      btnColor: '#FFEFEB',
      iconColor: '#FF652E'
    },
    {
      btnColor: '#F4F1FF',
      iconColor: '#997BFF'
    },
    {
      btnColor: '#E6F6F2',
      iconColor: '#01A883'
    },
    {
      btnColor: '#FFF6E8',
      iconColor: '#FFA522'
    }
  ],
  // card上title的icon矢量图标名称
  titleIcon: [
    'base-base-info-icon',
    'base-project-lib-icon',
    'base-budget-pro-icon',
    'base-budget-reply-icon',
    'base-budget-adjust-icon',
    'base-budget-exec-icon',
    'base-account-check-icon',
    'base-report-icon',
    'base-complex-seach-icon',
    'base-platform-config-icon'
  ],
  // card背景图片 在img下的名称
  bgName: [
    'base-info.png',
    'project-lib.png',
    'budget-pro.png',
    'budget-reply.png',
    'budget-adjust.png',
    'budget-exec.png',
    'account-check.png',
    'report.png',
    'complex-seach.png',
    'platform.png'
  ],
  buttons: [
    'all',
    'all',
    'all',
    'all', // 显示card/config/config.js中buttons所有按钮
    '2,3', // 显示card/config/config.js中buttons的第几个按钮
    '2,3',
    [ // 自定义按钮
      {
        icon: 'base-agent-item',
        title: '代办事项test',
        num: 12,
        code: 'agentItem'
      },
      {
        icon: 'base-done-item',
        title: '已办事项test',
        num: 0,
        code: 'doneItem'
      }
    ]
  ]

}

export {
  defaultConfig
}

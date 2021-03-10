const testcardBtns = {
  globalConfig: {
    methods: {
      bsCardPoperClickEvent: function(obj, $this) {
        console.log('回调方式二', obj, $this.$options)
      }
    }
  },
  baseInfo: {
    funMenu: { // 功能菜单

    },
    oprateGuide: { // 操作指南

    },
    agentItem: [ // 代办事项
      {
        title: '专项资金项目',
        num: 2,
        button: {
          code: 'bth',
          label: '被退回'
        }
      },
      {
        title: '其它运转类项目',
        num: 5,
        button: {
          code: 'dss',
          label: '待送审'
        }
      },
      {
        title: '其它特定目标类项目',
        num: 7,
        button: {
          code: 'dsh',
          label: '待审核'
        }
      },
      {
        title: '专项资金项目',
        num: 2,
        button: {
          code: 'bth',
          label: '被退回'
        }
      },
      {
        title: '专项资金项目',
        num: 2,
        button: {
          code: 'bth',
          label: '被退回'
        }
      }
    ],
    doneItem: [
      {
        title: '专项资金项目',
        num: 33,
        button: {
          code: 'ybl',
          label: '已办理'
        }
      }] // 已办事项
  }
}

export {
  testcardBtns
}

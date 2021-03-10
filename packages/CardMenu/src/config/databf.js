export default {
  data() {
    return {
      cardGlobal: {
        card: {
          width: 456,
          height: 224
        }

      },
      cardMenu: [
        {
          type: 'baseInfo', // 基础信息管理【card模块】
          btnColor: '#E4F2FF', // card按钮初始背颜色
          iconColor: '#2D8DFD', // 按钮加重时颜色
          btnHoverColorName: 'btn-hover__class', // card按钮悬浮和选中时样式名称
          iconColorName: 'icon-class', // card小icon图标样式名称
          bgName: 'base-info.png', // card背景图片名称
          bgUrl: '', // card背景图片地址
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-base-info-icon', // card标题按钮样式
            title: '基础信息管理' // card标题
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
              num: 18,
              code: 'agentItem' // 以这个为基准，cardBtns下的要对应 * code值不要改
            },
            {
              icon: 'base-done-item', // 按钮icon矢量图
              title: '已办事项',
              num: 6,
              code: 'doneItem' // 以这个为基准，cardBtns下的要对应 * code值不要改
            }
          ]
        },
        {
          type: 'projectLib', // 项目库管理
          btnColor: '#FFEFEB',
          iconColor: '#FF652E',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'project-lib.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-project-lib-icon',
            title: '项目库管理'
          }
        },
        {
          type: 'budgetPro', // 预算编制
          btnColor: '#F4F1FF',
          iconColor: '#997BFF',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'budget-pro.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-budget-pro-icon',
            title: '预算编制'
          }
        },
        {
          type: 'budgetReply', // 预算批复
          btnColor: '#E6F6F2',
          iconColor: '#01A883',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'budget-reply.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-budget-reply-icon',
            title: '预算批复'
          }
        },
        {
          type: 'budgetAdjust', // 预算调整与调剂
          btnColor: '#FFF6E8',
          iconColor: '#FFA522',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'budget-adjust.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-budget-adjust-icon',
            title: '预算调整与调剂'
          }
        },
        {
          type: 'budgetExec', // 预算执行
          btnColor: '#E4F2FF',
          iconColor: '#2A8BFE',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'budget-exec.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-budget-exec-icon',
            title: '预算执行'
          }
        },
        {
          type: 'accountCheck', // 会计核算
          btnColor: '#FFEFEB',
          iconColor: '#FF652E',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'account-check.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-account-check-icon',
            title: '会计核算'
          }
        },
        {
          type: 'report', // 决算与报告
          btnColor: '#F4F1FF',
          iconColor: '#997BFF',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'report.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-report-icon',
            title: '决算与报告'
          }
        },
        {
          type: 'complexSeach', // 综合查询
          btnColor: '#E6F6F2',
          iconColor: '#01A883',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'complex-seach.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-complex-seach-icon',
            title: '综合查询'
          },
          buttons: [
            {
              icon: 'base-fun-menu',
              title: '功能菜单',
              code: 'funMenu'
            },
            {
              icon: 'base-oprate-guide',
              title: '操作指南',
              code: 'oprateGuide'
            }]
        },
        {
          type: 'platformConfig', // 平台配置管理
          btnColor: '#FFF6E8',
          iconColor: '#FFA522',
          btnHoverColorName: 'btn-hover__class',
          iconColorName: 'icon-class',
          bgName: 'platform.png',
          bgUrl: '',
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: 'base-platform-config-icon',
            title: '平台配置管理'
          },
          buttons: [
            {
              icon: 'base-fun-menu',
              title: '功能菜单',
              code: 'funMenu'
            },
            {
              icon: 'base-oprate-guide',
              title: '操作指南',
              code: 'oprateGuide'
            }]
        }
      ],
      cardBtns: {
        globalConfig: {
          methods: {
            bsCardPoperClickEvent: this.bsCardPoperClickEvent
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
              num: 6,
              button: {
                code: 'ybl',
                label: '已办理'
              }
            }
          ] // 已办事项
        },
        projectLib: {
          funMenu: { // 功能菜单

          },
          oprateGuide: { // 操作指南

          },
          agentItem: [ // 代办事项
            {
              title: '项目库',
              num: 2,
              button: {
                code: 'projectlibBtn',
                label: '项目库被退回'
              }
            }

          ],
          doneItem: [
          ] // 已办事项
        }
      }
    }
  },
  methods: {
    getImageUrl() {
      this.cardMenu.forEach(item => {
        item.bgUrl = require('../img/' + item.bgName)
      })
    }
  },
  mounted () {
    this.getImageUrl()
    this.resize()
  }

}

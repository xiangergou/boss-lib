import { defaultConfig } from './config'
import { defaultCardData } from '../card/config/config'
export default {
  data() {
    return {
      cardGlobal: {
        card: {
          width: 456,
          height: 224
        }

      },
      cardMenu: [],
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
              num: 33,
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
    generateCardMenu() {
      // const sysMenu = this.$store.state.systemMenu || []
      const sysMenu = []
      // console.log(sysMenu)
      let sysMenuCp = [...sysMenu]
      let cardMenuTemp = []
      sysMenuCp.map((item, index) => {
        let card = {
          type: item.guid, // 基础信息管理【card模块】
          bgName: this.getConfigValue(index, 'bgName'), // card背景图片名称
          bgUrl: '', // card背景图片地址
          methods: {
            bsCardClickEvent: this.bsCardClickEvent
          },
          title: {
            icon: this.getConfigValue(index, 'titleIcon'), // card标题按钮样式
            title: item.name // card标题
          },
          buttons: this.getConfigButton(index, 'buttons'),
          menu: item
        }

        let colors = this.getConfigObj(index, 'color')
        Object.assign(card, colors)

        cardMenuTemp.push(card)
      })

      this.cardMenu = cardMenuTemp
      // console.log('2', this.cardMenu)
    },

    generateCardBtns() {

    },

    getConfigObj(index = 0, type) {
      const data = defaultConfig[type]
      // 如果配置项没有这样的key则返回空对象
      if (!data) {
        return {}
      }
      // 根据索引取默认数组的值，如果数组值取完，则循环取值
      let num = index % data.length
      return data[num]
    },
    getConfigValue(index = 0, type) {
      const data = defaultConfig[type]
      // 如果配置项没有这样的key则返回空对象
      if (!data) {
        return ''
      }

      // 根据索引取默认数组的值，如果数组值取完，则循环取值
      let num = index % data.length
      return data[num]
    },

    getConfigButton(index = 0, type) {
      const data = defaultConfig[type]
      // 如果配置项没有这样的key则返回空对象
      if (!data) {
        return []
      }

      // 根据索引取默认数组的值，如果数组值取完，则循环取值
      let num = index % data.length
      let value = data[num]
      if (value === 'all') {
        return defaultCardData.buttons
      } else {
        if (Array.isArray(value)) {
          return value
        } else {
          let arr = []
          let indexArr = value.split(',')
          indexArr.map((item) => {
            arr.push(defaultCardData.buttons[item])
          })

          return arr
        }
      }
    },
    getImageUrl() {
      this.cardMenu.forEach(item => {
        item.bgUrl = require('../img/' + item.bgName)
      })
    }
  },
  mounted () {
  }

}

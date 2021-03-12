import store from '../store/index'
import ToolFn from '@/components/tool/util.js'
import { post } from '@/api/http'

// var appguid = store.getters.getLoginAuthentication.appguid
// var userInfo = store.state.userInfo
// var tokenid = store.getters.getLoginAuthentication.tokenid
/* 默认基础配置 */
var defaultConfig = {
  url: '',
  maxLength: 20 // 缓冲上报，存够20条之后发送给后端，而不是每采集一条就发一次
}

// var ajaxCount = 0
// 采集的数据
var collectDatas = []
/* 默认保存数据格式设置 */
var commonOptions = {
  /** 用户id */
  user_id: null,
  /** 用户编码 */
  user_code: null,
  /** 区划编码 */
  region_code: null,
  agency: null,
  /** 当前角色id */
  current_role_id: null,
  /** 进入界面的时间 */
  time: null

}

/** 推荐菜单 */
var recommendMenu = {}

/** 页面打开及页面停留信息 */
var pageView = { }

/** 保存数据 */
function sendOptions (data) {
  return post('mp-d-aggregation-service/v1/collector/behavior', { 'behavior': data })
}

/* 存储当前监控到的数据 */
function addRecord() {
  // console.log('collectDatas', collectDatas)
  if (collectDatas.length === defaultConfig.maxLength) {
    var data = collectDatas.slice(0, defaultConfig.maxLength)

    sendOptions(data)

    collectDatas = []
  }
}

/** 默认设置 */
function setDefaultOptions() {
  commonOptions.user_id = store.state.userInfo.guid
  commonOptions.user_code = store.state.userInfo.code
  commonOptions.region_code = store.state.userInfo.province
  commonOptions.agency = store.state.userInfo.agency
  commonOptions.current_role_id = 'D6C1B4B48CE142318EAF541598209563'
  commonOptions.time = ToolFn.DateFn.getmillisecond(ToolFn.DateFn.CurentTime())
}

/** 判断默认设置是否有值 */
function judgeDefaultOptions(options) {
  for (let key in options) {
    if (options[key] === undefined || options[key] === null) {
      return false
    }
  }
  return true
}

/** 匹配存储的推荐菜单 */
function getRecommendMenu(menuTreeList, reg) {
  menuTreeList.forEach(item => {
    if (item.children !== null && item.children.length > 0) {
      getRecommendMenu(item.children, reg)
    } else {
      if (item.url === reg) {
        recommendMenu = item
      }
    }
  })
}

function initMenuMonitor(from, to) {
  setDefaultOptions()
  monitorMenuClick(from, to)
  addRecord()
}
/* 监控界面打开行为 */
function monitorMenuClick(from, to) {
  let defaultOptions = {
    ...commonOptions,
    /** 操作类型 */
    behavior_type: null,
    /** 操作内容 */
    behavior_content: {
      entrance_name: null,
      url: null,
      parent_url: null
    }

  }
  defaultOptions.behavior_type = 'page_view'
  defaultOptions.behavior_content['entrance_name'] = to.params.curNavModule.name
  defaultOptions.behavior_content['url'] = to.name
  defaultOptions.behavior_content['parent_url'] = from.name
  if (judgeDefaultOptions(commonOptions)) {
    collectDatas.push(defaultOptions)
  }

  getRecommendMenu(store.state.systemMenu, defaultOptions.behavior_content.url)
  if (store.state.recommendPage.length <= 5) {
    store.commit('setRecommendPage', recommendMenu)
  } else {
    store.commit('spliceRecommend')
    store.commit('setRecommendPage', recommendMenu)
  }

  if (JSON.stringify(pageView) === '{}') {
    pageView['url'] = defaultOptions.behavior_content.url
    pageView['name'] = defaultOptions.behavior_content.entrance_name
    pageView['startTime'] = defaultOptions.time
  }
}

function initAjaxMonitor(request) {
  setDefaultOptions()
  monitorAjax(request)
  addRecord()
}
/** 监控ajax请求 */
function monitorAjax(request) {
  let defaultOptions = {
    ...commonOptions,
    /** 操作类型 */
    behavior_type: null,
    /** 操作内容 */
    behavior_content: {
      url: null
    }

  }
  defaultOptions.behavior_type = 'ajax'
  defaultOptions.behavior_content['url'] = location.href.split('#/')[1]
  if (judgeDefaultOptions(commonOptions)) {
    collectDatas.push(defaultOptions)
  }
}

function initClickMonitor() {
  setDefaultOptions()
  monitorClick()
  addRecord()
}
/** 监控点击事件 */
function monitorClick () {
  var e = window.event
  if (e.target.id === 'right-quick-navgation1' || e.target.id === 'right-quick-navgation') {
    let defaultOptions = {
      ...commonOptions,
      /** 操作类型 */
      behavior_type: null,
      /** 操作内容 */
      behavior_content: {
        id: null,
        url: null,
        value: null
      }

    }
    defaultOptions.behavior_type = 'click'
    defaultOptions.behavior_content['id'] = e.target.id
    defaultOptions.behavior_content['value'] = e.target.innerText.trim()
    defaultOptions.behavior_content['url'] = location.href.split('#/')[1]
    if (judgeDefaultOptions(commonOptions)) {
      collectDatas.push(defaultOptions)
    }
  }
}

function initRecommendMonitor(obj) {
  setDefaultOptions()
  monitorRecommend(obj)
  addRecord()
}
/** 监控从智能推荐进入的页面 */
function monitorRecommend(obj) {
  let defaultOptions = {
    ...commonOptions,
    /** 操作类型 */
    behavior_type: null,
    /** 操作内容 */
    behavior_content: {
      entrance_name: null,
      url: null
    }

  }
  defaultOptions.behavior_type = 'page-recommend'
  defaultOptions.behavior_content['entrance_name'] = obj.name
  defaultOptions.behavior_content['url'] = obj.url
  if (judgeDefaultOptions(commonOptions)) {
    collectDatas.push(defaultOptions)
  }
}

/* 监听界面停留时间 */
function monitorLeave(endTime) {
  setDefaultOptions()
  let defaultOptions = {
    ...commonOptions,
    /** 操作类型 */
    behavior_type: null,
    /** 操作内容 */
    behavior_content: {
      entrance_name: null,
      url: null
    }

  }

  defaultOptions.behavior_type = 'page-time'
  defaultOptions.behavior_content['entrance_name'] = pageView.name
  defaultOptions.behavior_content['url'] = pageView.url
  pageView['endTime'] = endTime
  pageView['stayTime'] = ToolFn.DateFn.getmillisecond(endTime) - pageView['startTime']
  defaultOptions.behavior_content['url'] = pageView.stayTime

  if (judgeDefaultOptions(commonOptions)) {
    collectDatas.push(defaultOptions)
  }

  addRecord()

  pageView = {}
}

/* 前端埋点--收集用户信息 **/
var userBehaviorMonitor = {

  initMenuMonitor,
  initAjaxMonitor,
  initClickMonitor,
  initRecommendMonitor,
  monitorLeave

}

export default userBehaviorMonitor

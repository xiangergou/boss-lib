
class FindText {
  constructor(vNode) {
    this.oText = vNode
    this.temp = ''
  }
  check(value) {
    let me = this
    let input = value
    me.cancel.onclick()
    if (!input) {
      alert('请输入关键字!')
      return
    }
    me.preContext = me.oText.innerHTML
    let result = me.getRes(me.preContext, input)
    let resMap = result.resMap
    let resLog = result.resLog
    // let time1 = +new Date();
    me.makeFlag(resMap)
    // console.log('hash查找: ' + (+new Date() - time1) + 'ms');
    let obj = {}
    for (let key in resLog) {
      if (resLog.hasOwnProperty(key)) {
        obj[key] = resLog[key].num
      }
    }
  }
  test(value) {
    // 正则
    let me = this
    let input = value
    me.cancel()
    if (!input) {
      alert('请输入关键字!')
      return
    }
    // let time2 = +new Date();
    me.find(input)
    // console.log('正则查找: ' + (+new Date() - time2) + 'ms');
  }
  cancel() {
    let me = this
    if (!me.preContext) {
      return
    }
    me.oText.innerHTML = me.preContext
  }
  // 正则
  find(input) {
    let me = this
    // console.time('RegExp time');
    let keywords = input.match(/[^,，;]+/g)
    let patt = keywords.join('|')
    let str = me.oText.innerHTML
    me.preContext = me.oText.innerHTML
    let keywordRe = new RegExp('(' + patt + ')', 'g')
    me.temp = str.replace(keywordRe, '<b class="stress">$1</b>')
    // console.timeEnd('RegExp time');
    me.oText.innerHTML = me.temp
  }
  // hash
  makeFlag(resMap) {
    let me = this
    // console.time('hash time');
    let newCon = []
    let p = 0
    for (let i = 0; i < resMap.length; i++) {
      newCon.push(
        me.preContext.substring(p, resMap[i].begin),
        '<b class="stress">',
        me.preContext.substring(resMap[i].begin, p = resMap[i].end),
        '</b>'
      )
    }
    newCon.push(me.preContext.substring(p))
    // console.timeEnd('hash time');
    me.oText.innerHTML = newCon.join('')
  }
  sKeyToKeys(sKey) { // 把字符串以，,分割成数组
    let reg = new RegExp('[,，；;]')
    return sKey.split(reg)
  }
  makeTree(strKeys) {
    let hash = {}
    let hBranch = hash
    let keyChar
    for (let j = 0; j < strKeys.length; j++) {
      for (let i = 0; i < strKeys[j].length; i++) {
        keyChar = strKeys[j].charAt(i)
        hBranch = hBranch.hasOwnProperty(keyChar)
          ? hBranch[keyChar]
          : hBranch[keyChar] = {}
      }
      hBranch.end = true
      hBranch = hash
    }
    return hash
  }
  search(context, hash) {
    let hAttr
    let pStart = 0
    let pEnd
    let match
    let mLetter
    let mWord
    let arrMatch = []
    let arrLength = 0
    let wordLog = {}
    while (pStart < context.length) {
      // 回溯至根部
      hAttr = hash
      pEnd = pStart
      mWord = ''
      match = false

      do {
        mLetter = context.charAt(pEnd)
        // hash属性查询并往叶子靠拢
        if (!(hAttr = hAttr[mLetter])) {
          pStart++
          break
        } else {
          mWord += mLetter
        }
        pEnd++
        // 匹配success
        if (hAttr.end === true) {
          match = true
        }
      } while (true)

      if (match) {
        arrMatch[arrLength] = {
          key: mWord,
          begin: pStart - 1,
          end: pEnd
        }
        // 关键词的个数
        if (wordLog[mWord]) {
          wordLog[mWord].num++
        } else {
          wordLog[mWord] = {
            num: 1
          }
        }
        arrLength += 1
        pStart = pEnd
      }
    }
    return {
      resMap: arrMatch,
      resLog: wordLog
    }
  }
  getRes(context, sKey) {
    let me = this
    let hash = me.makeTree(me.sKeyToKeys(sKey))
    let result = me.search(context, hash)
    return result
  }
}

export default FindText

// window.testFindText = new FindText({
//   area: '#text',
//   keyword: '#keyword',
//   check: '#btn',
//   cancel: '#btn2',
//   result: '#result'
// })

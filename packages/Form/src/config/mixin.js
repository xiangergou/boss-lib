// mixins   Author:Titans@2396757591@qq.com
// 禁止鼠标右键：oncontextmenu="return false"；
// 禁止选择：onselectstart="return false"；
// 禁止拖放：ondragstart="return false"；
// 禁止拷贝：oncopy=document.selection.empty() ;
// 禁止复制：oncopy = "return false"；
// 禁止保存：<noscript><iframe src="*.htm"></iframe></noscript>，放在head里面。
// 禁止粘贴：<input type=text onpaste="return false">
// 禁止剪贴：oncut = "return false"；
// 关闭输入法：<input style="ime-mode:disabled">
export default {
  mathods: {
    status({ cellValue }) {
      return cellValue === 1 ? '已发布' : '未发布'
    }
  }
}

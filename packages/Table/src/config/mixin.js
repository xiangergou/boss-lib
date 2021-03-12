// mixins   Author:Titans@2396757591@qq.com
export default {
  mathods: {
    status({ cellValue }) {
      return cellValue === 1 ? '已发布' : '未发布'
    }
  }
}

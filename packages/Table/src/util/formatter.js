// formatter   Author:Titans@2396757591@qq.com
export default {
  status: ({ cellValue }) => {
    return cellValue === 1 ? '已发布' : '未发布'
  },
  // 是否启用
  is_enable: ({ cellValue }) => {
    return cellValue === 1 ? '是' : '否'
  }
}

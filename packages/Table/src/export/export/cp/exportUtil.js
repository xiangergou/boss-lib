export function defaultViewValueFormat(value, row, column) {
  let render = column.editRender || column.cellRender || column.contentRender
  if (render && render.name) {
    let options = render.options || []
    switch (render.name) {
      case '$treeinput':
        return row[column.field + 'code'] + '-' + row[column.field + 'name']
      case '$treeText':
        return row[column.field + 'code'] + '-' + row[column.field + 'name']
      case '$span':
        return value
      case '$href':
        return value
      case '$EditDownTextarea':
        return value
      case '$EditDownConditions':
        return value
      case '$moneyRender':
        return value
      case '$calculateRender':
        return value
      case '$vxeDays':
        return value
      case '$vxeCheckbox':
        let vxeCheckboxValue = []
        options.forEach((item, index) => {
          if (row[column.field].indexOf(item.value) >= 0) {
            vxeCheckboxValue.push(item.label)
          }
        })
        return vxeCheckboxValue.join(',')
      case '$vxeRadio':
        options.forEach((item, index) => {
          if (row[column.field] === item.value) {
            value = item.label
          }
        })
        return value
      case '$select':
        if (render.props && render.props.multiple) {
          let selectValue = []
          options.forEach((item, index) => {
            if (row[column.field].indexOf(item.value) >= 0) {
              selectValue.push(item.label)
            }
          })
          return selectValue.join(',')
        } else {
          options.forEach((item, index) => {
            if (row[column.field] === item.value) {
              value = item.label
            }
          })
          return value
        }
      default:
        return value
    }
  } else {
    return value
  }
}

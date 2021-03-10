/* eslint-disable no-useless-escape */
// config   Author:Titans@2396757591@qq.com
// import TreeModule from '@/api/frame/common/tree/unitTree'
// const treeData = []
/* eslint-disable */
export const formGloabalConfig = {
  span: 8,
  align: 'left',
  size: 'medium',
  titleAlign: 'right',
  titleWidth: 200,
  titleColon: false,
  preventSubmit: false,
  loading: false,
  validConfig: {
    autoPos: true
  }
}
export const formItemsConfig = [
  {
    field: 'name',
    title: '名称',
    span: 24,
    itemRender: {
      name: '$input',
      props: {
        disabled: true,
        type: 'text',
        placeholder: '请输入名称'
      }
    }
  },
  {
    field: 'nickname',
    title: '昵称',
    span: 8,
    itemRender: {
      name: '$textarea',
      props: {
        placeholder: '请输入昵称'
      }
    }
  }, {
    field: 'age',
    title: '年龄',
    span: 8,
    itemRender: {
      name: '$input',
      props: {
        type: 'number',
        placeholder: '请输入昵称'
      }
    }
  }, {
    field: 'sex',
    title: '性别',
    span: 8,
    itemRender: {
      name: '$select',
      options: [{
        value: 0,
        label: '女'
      }, {
        value: 1,
        label: '男'
      }],
      props: { placeholder: '请选择性别' }
    }
  },
  {
    field: 'category',
    title: '角色',
    span: 8,
    itemRender: {
      name: '$select',
      options: [
        { value: '前端', label: '前端' },
        { value: '后端', label: '后端' },
        { value: '运维', label: '测试' },
        { value: '实施', label: '实施' },
        { value: '测试', label: '测试' }
      ],
      props: {
        placeholder: '请输入角色'
      }
    }
  },
  {
    field: 'select',
    title: '学历',
    span: 8,
    itemRender: {
      name: '$select',
      options: ((str) => {
        return str.split('+').map((item, index) => {
          return { value: item.split('#')[0], label: item.split('#')[1] }
        })
      })('009#博士后+001#小学+002#初中+003#高中+004#中专+005#大专+006#本科+007#硕士+008#博士'),
      props: {
        placeholder: '请输入角色'
      }
    }
  },
  {
    field: 'personality',
    title: '人员类型',
    span: 8,
    itemRender: {
      name: 'personality',
      props: {
        type: 'string',
        clearable: true,
        placeholder: '人员类型'
      }
    }
  },
  {
    field: 'treeinput',
    title: 'treeinput',
    span: 8,
    itemRender: {
      name: '$treeinput',
      options: [{
        id: -1,
        label: '预算单位',
        name: '预算单位',
        children: []
      }],
      props: {

      }
    }
  },
  {
    align: 'center',
    span: 24,
    itemRender: {
      name: '$buttons',
      children: [{
        props: {
          type: 'submit',
          content: '提交',
          status: 'primary'
        }
      }, {
        props: {
          type: 'reset',
          content: '重置'
        }
      }]
    }
  }
]
export const formDataList = {
  name: 'John Brown',
  nickname: 'John Brown nick',
  age: 18,
  sex: 0,
  select: '001',
  treeinput: '',
  category: '前端',
  address: 'New York No. 1 Lake Park',
  status: 0
}
export const formConfig = {
  formRenderConfig: {
    personality: {
      name: 'personality',
      props: {
        type: 'string',
        clearable: true,
        placeholder: '人员类型'
      }
    }
  },
  renderers: {
    personality: {
      // 项显示模板
      renderItem(h, { props }, { data, property }) {
        let sex = ['女', '男']
        let age = ['优秀青年', '杰出中年', '颐养天年', '颐养天年', '颐养天年', '颐养天年']
        let value = age[Math.floor(data.age / 25)] + sex[data.sex]
        data.property = value
        return [
          <vxe-input readonly v-model={ value } { ...{ props } }></vxe-input>
        ]
      }
    }
  },
  // formRenderConfig: {},
  axiosDatas: { // 全局请求数据方法，必须为一个异步
    saveData({ data }) {
      console.log('saveData', data)
    }
  }
}
export const formValidationConfig = {
  name: [
    {
      required: true,
      type: 'string',
      message: '名称长度需在 3 到 5 个字符',
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/i,
      trigger: 'change'
    }
    // { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
  ],
  nickname: [
    {
      required: true,
      type: 'string',
      message: '请输入昵称',
      trigger: 'change',
      pattern: /^[a-zA-Z0-9_\(\)\{\}·.、\[\]\（\）\【\】\u4e00-\u9fa5]+$/i
      // validator({ itemValue, rule, rules, data, property }) {
      //   return new Promise((resolve, reject) => {
      //     let result = false
      //     if (data.type === 'shengfenz') {
      //       result = /^[a-zA-Z0-9_\(\)\{\}·.、\[\]\（\）\【\】\u4e00-\u9fa5]+$/i.test(itemValue)
      //     } else {
      //       result = true
      //     }
      //     if (result) {
      //       resolve(true)
      //     } else {
      //       reject(new Error(
      //         '校验失败'
      //       ))
      //     }
      //   })
      // }
    }
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ],
  age: [
    {
      required: true,
      message: '请输入年龄',
      min: 1,
      max: 150,
      type: 'number',
      trigger: 'change'
    }
  ],
  category: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'change'
    }
  ]
}

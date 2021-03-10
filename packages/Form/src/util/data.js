// data   Author:Titans@2396757591@qq.com
/* eslint-disable no-useless-escape */

import { defaultformGloabalConfig } from '../config/formDefaultConfig'
import { formConfig, formValidationConfig, formDataList } from '../config/config'
export default {
  formGloabalConfigIn: {
    ...defaultformGloabalConfig
    // ...formGloabalConfig
  },
  formItemsConfigIn: [
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
          return str.split('+').map((item) => {
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
  ],
  formDataListIn: [] || formDataList,
  formConfigCp: {
    formRenderConfig: {},
    renderers: {},
    axiosDatas: {}
  } || formConfig,
  formValidationConfigIn: {} || formValidationConfig

}

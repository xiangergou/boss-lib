<!--  export配置弹框   Author:Titans@2396757591@qq.com -->
<template>
  <vxe-modal
    v-model="exportModalVisible"
    title="导出参数设置"
    width="660"
    height="auto"
    remember
    transfer
  >
    <div class="export-module">
      <vxe-form
        :data="exportModalFormData"
        size="medium"
        title-width="120"
        title-align="right"
        align="left"
        title-colon
      >
        <vxe-form-item title="名称" field="fileName" :span="24">
          <template v-slot>
            <vxe-input v-model="exportModalFormData.fileName" placeholder="请输入文件名" clearable />
          </template>
        </vxe-form-item>
        <vxe-form-item title="保存类型" field="saveType" :span="24">
          <template v-slot>
            <vxe-select v-model="exportModalFormData.saveType" placeholder="请选择保存类型" clearable>
              <vxe-option value=".xlsx" label="Excel 工作簿(*.xlsx)" />
              <!-- <vxe-option value=".csv" label="CSV (逗号分隔)(*.csv)" /> -->
            </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item title="要导出的数据" field="saveType" :span="24">
          <template v-slot>
            <vxe-select v-model="exportModalFormData.dataType" placeholder="要导出的数据" clearable>
              <vxe-option value="tableData" label="当前页数据" />
              <vxe-option value="selection" label="选中数据" />
              <!-- <vxe-option value="allData" label="所有数据" /> -->
            </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item title="导出列选项" field="exportOption" :span="24">
          <template v-slot>
            <div class="export-option">
              <div class="export-option-title">
                <vxe-checkbox
                  v-model="checkAllColumns"
                  label="allFields"
                  content="全部列"
                  size="medium"
                />
              </div>
              <div class="export-option-tree">
                <el-tree
                  ref="exportColumsTree"
                  :data="columns"
                  show-checkbox
                  node-key="nestedId"
                  default-expand-all
                  :default-checked-keys="defaultCheckedKeys"
                  :props="defaultProps"
                />
              </div>
            </div>
          </template>
        </vxe-form-item>
        <vxe-form-item title="导出类型" :span="24">
          <template v-slot>
            <div class="vxe-checkbox-group fn-inline">
              <vxe-checkbox
                v-model="exportModalFormData.isExportOnlySourceField"
                label="isExportOnlySourceField"
                content="只导出表列字段"
                size="medium"
              />
              <vxe-checkbox
                v-model="exportModalFormData.isExportOnlyViewTitle"
                label="isExportOnlySourceField"
                content="只导出表列名称"
                size="medium"
              />
            </div>
          </template>
        </vxe-form-item>
        <vxe-form-item v-if="isShowHighOptions" title="导出表头选项" :span="24">
          <template v-slot>
            <div class="vxe-checkbox-group fn-inline">
              <!-- <vxe-checkbox
                v-model="exportModalFormData.isExportHead"
                label="isExportHead"
                content="表头"
                size="medium"
              />
              <div class="fn-inline export-type-head">
                <label class="fn-inline">表头选项</label> -->
              <vxe-radio-group v-model="exportModalFormData.exportViewTitleType">
                <vxe-radio name="exportViewTitleType" label="nestTitle" content="嵌套表头" size="medium" />
                <vxe-radio name="exportViewTitleType" label="singTitle" content="单表头" size="medium" />
              </vxe-radio-group>

            </div>
            <!-- </div> -->
          </template>
        </vxe-form-item>
        <vxe-form-item v-if="isShowHighOptions" title="导出数据选项" field="exportOption" :span="24">
          <template v-slot>
            <div class="vxe-checkbox-group">
              <!-- <vxe-checkbox
                v-model="exportModalFormData.isExportHead"
                label="isExportHead"
                content="表头"
                size="medium"
              /> -->
              <vxe-checkbox
                v-model="exportModalFormData.isExportData"
                label="isExportData"
                content="视图数据"
                size="medium"
              />
              <vxe-checkbox
                v-model="exportModalFormData.isExportFooter"
                label="isExportFooter"
                content="表尾"
                size="medium"
              />

              <vxe-checkbox
                v-model="exportModalFormData.isExportOriginalData"
                label="isExportOriginalData"
                content="源数据"
                size="medium"
              />
            </div>
          </template>
        </vxe-form-item>
        <vxe-form-item v-if="isShowHighOptions" title="其他导出选项" field="exportOption" :span="24">
          <template v-slot>
            <div class="vxe-checkbox-group">
              <vxe-checkbox
                v-model="exportModalFormData.isExportTree"
                label="isExportTree"
                content="导出树形数据"
                size="medium"
              />
            </div>
          </template>
        </vxe-form-item>
      </vxe-form>
      <div class="btn-group">
        <vxe-button size="medium" content="中等尺寸" @click="onPrintClick">打印</vxe-button>
        <vxe-button type="submit" status="primary" size="medium" @click="onExportClick">导出</vxe-button>
      </div>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  name: 'Export',
  components: {},
  props: {
    exportModalVisible: {
      type: Boolean
    },
    exportModalData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      exportModalFormData: {
        saveType: '.xlsx',
        fileName: 'export', // 文件名
        dataType: 'tableData',
        isExportOnlySourceField: false, // 是否只导出数据源表头字段，
        isExportOnlyViewTitle: false, // 是否只导出数据表头名称，
        isExportHead: true, // 是否导出表头
        exportViewTitleType: 'nestTitle',
        isExportFooter: false, // 是否导出表尾部
        isExportOriginalData: true, // 是否导出源数据
        isExportData: true, // 是否导出数据
        columns: [], // 表头配置
        datas: [], // 源数据,
        selection: [], // 选中数据
        isExportTree: false, // 是否是树形数据
        index: true, // 是否添加序号,
        ignoreColsTypes: [], // 忽略导出的列类型
        viewValueFormat(value, row, column) {
          // 视图数据格式化方法
          // return value
        }
      },
      columns: [
        // {
        //   id: 1,
        //   title: '一级 1',
        //   children: [
        //     {
        //       id: 4,
        //       title: '二级 1-1',
        //       children: [
        //         {
        //           id: 9,
        //           title: '三级 1-1-1'
        //         },
        //         {
        //           id: 10,
        //           title: '三级 1-1-2'
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   id: 2,
        //   title: '一级 2',
        //   children: [
        //     {
        //       id: 5,
        //       title: '二级 2-1'
        //     },
        //     {
        //       id: 6,
        //       title: '二级 2-2'
        //     }
        //   ]
        // },
        // {
        //   id: 3,
        //   title: '一级 3',
        //   children: [
        //     {
        //       id: 7,
        //       title: '二级 3-1'
        //     },
        //     {
        //       id: 8,
        //       title: '二级 3-2'
        //     }
        //   ]
        // }
      ],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      defaultCheckedKeys: [],
      checkAllColumns: false
    }
  },
  computed: {
    isShowHighOptions() {
      return !(this.exportModalFormData.isExportOnlySourceField || this.exportModalFormData.isExportOnlyViewTitle)
    }
  },
  methods: {
    deepCopy(obj) {
      // 深拷贝通用方法
      if (typeof obj !== 'object' || obj === null) return obj
      let newObj = obj instanceof Array ? [] : {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] =
            typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key]
        }
      }
      return newObj
    },
    generateTree(arr) {
      // 平行数据转化树形数据
      let copy = this.deepCopy(arr)
      let obj = {}
      copy.forEach((item, index) => {
        delete item.children
        obj[item.nestedId] = item
      })
      let res = []
      copy.forEach((item) => {
        if (item.nestedPid === 0) {
          res.push(item)
        }
        for (let key in obj) {
          if (item.nestedId === obj[key].nestedPid) {
            if (item.children) {
              item.children.push(obj[key])
            } else {
              item.children = [obj[key]]
            }
          }
        }
      })
      return res
    },
    deepEachTraversalArr(data, cb) {
      // 深度递归遍历新增嵌套索引关系
      deepEachTraversalArrFn(data)
      return data
      function deepEachTraversalArrFn(root, nestedId, cb) {
        if (Array.isArray(root) && root.length) {
          root.forEach((item, index) => {
            item.sortIndex = index
            item.nestedPid = nestedId === undefined ? 0 : nestedId
            item.nestedId =
              nestedId !== undefined ? nestedId + '_' + (index + 1) : index + 1
            cb && typeof cb === 'function' && cb(root)
            if (item.children && item.children.length) {
              deepEachTraversalArrFn(item.children, item.nestedId)
            }
          })
        }
      }
    },
    setExportColumns(columns, ignoreColsTypes) {
      // 设置导出列
      columns = columns.filter((item) => {
        return ignoreColsTypes.indexOf(item.type) < 0
      })
      columns.unshift({ title: '序号', field: 'seqIndex', type: 'seqIndex' })
      return this.filterColums(columns, 'visible', false)
    },
    filterColums(columns, key, value) {
      // 过滤,属性key不等于Value过滤
      let self = this
      return columns.filter((item, index) => {
        if (
          item.children &&
          item.children.length &&
          (item[key] !== value || item[key] === undefined)
        ) {
          item.children = self.filterColums(item.children, key, value)
          return true
        } else {
          return item[key] !== value
        }
      })
    },
    valiAndSet(exportModalFormData) {
      //  exportModalFormData: {
      //         saveType: '.xlsx',
      //         fileName: 'export.xlsx', // 文件名
      //         dataType: 'fullData',
      //         isExportHead: true, // 是否导出表头
      //         isExportFooter: true, // 是否导出表尾部
      //         isExportOriginalData: true, // 是否导出源数据
      //         isExportData: true, // 是否导出数据
      //         columns: [], // 表头配置
      //         datas: [], // 源数据,
      //         selection: [], // 选中数据
      //         ignoreColsTypes: [], // 忽略导出的列类型
      //         viewValueFormat(value, row, column) { // 视图数据格式化方法
      //         // return value
      //         }
      //       },
      let { fileName } = exportModalFormData
      let reg = new RegExp('^[a-zA-Z0-9-_\u4e00-\u9fa5]{0,2000}$', 'ig')
      if (!reg.test(fileName)) {
        fileName = this.exportModalData.fileName
      }
      exportModalFormData.fileName = fileName
      return exportModalFormData
    },
    init() {
      this.exportModalFormData = Object.assign(
        {},
        this.exportModalFormData,
        this.exportModalData
      )
      this.columns = this.deepEachTraversalArr(
        this.setExportColumns(
          this.exportModalFormData.columns,
          this.exportModalFormData.ignoreColsTypes
        )
      )
      this.checkAllColumns = true
      this.defaultCheckedKeys = this.columns.map((item, index) => {
        return item.nestedId
      })
    },
    onPrintClick() {
      // 打印点击事件
      let exportColumns = this.generateTree(
        this.$refs.exportColumsTree
          .getCheckedNodes()
          .concat(this.$refs.exportColumsTree.getHalfCheckedNodes())
      ).sort((a, b) => {
        return a.sortIndex - b.sortIndex
      })
      let exportModalFormData = Object.assign({}, this.exportModalFormData, {
        columns: exportColumns
      })
      exportModalFormData = this.valiAndSet(exportModalFormData)
      this.$emit('onPrintClick', exportModalFormData)
    },
    onExportClick() {
      // 导出点击事件
      let exportColumns = this.generateTree(
        this.$refs.exportColumsTree
          .getCheckedNodes()
          .concat(this.$refs.exportColumsTree.getHalfCheckedNodes())
      ).sort((a, b) => {
        return a.sortIndex - b.sortIndex
      })
      let exportModalFormData = Object.assign({}, this.exportModalFormData, {
        columns: exportColumns
      })
      exportModalFormData = this.valiAndSet(exportModalFormData)
      this.$emit('onExportClick', exportModalFormData)
    }
  },
  mounted() {},
  watch: {
    exportModalVisible: {
      handler(newVal) {
        this.$emit('update:exportModalVisible', newVal)
        if (newVal) {
          this.init()
        }
      },
      immediate: true
    },
    exportModalFormData: {
      handler() {},
      deep: true,
      immediate: true
    },
    checkAllColumns: {
      handler(newValue) {
        if (newValue) {
          this.$refs.exportColumsTree &&
            this.$refs.exportColumsTree.setCheckedNodes(this.columns)
        } else {
          this.$refs.exportColumsTree &&
            this.$refs.exportColumsTree.setCheckedNodes([])
        }
      },
      immediate: true
    },
    'exportModalFormData.isExportOnlySourceField': {
      handler(value) {
        if (value) {
          this.exportModalFormData.isExportOnlyViewTitle = false
        }
      },
      deep: true,
      immediate: true
    },
    'exportModalFormData.isExportOnlyViewTitle': {
      handler(value) {
        if (value) {
          this.exportModalFormData.isExportOnlySourceField = false
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang='scss'>
.export-module {
  padding: 0 0 20px 0;
  .vxe-form {
    padding: 0 60px;
    margin: 0 auto;
    .vxe-form--item {
      padding: 3px 0;
    }
    .export-option {
      border: 1px solid #dcdfe6;
      margin: 3px 0;
      border-radius: 4px;
      user-select: none;
      .export-option-title {
        background-color: #f8f8f9;
        font-weight: 700;
        border-bottom: 1px solid #dadce0;
        line-height: 30px;
        padding: 0 23px;
      }
      .export-option-tree {
        max-height: 205px;
        overflow: auto;
      }

      .vxe-checkbox-group {
        line-height: 24px;
        line-height: normal;
        .vxe-checkbox {
          margin: 0 5px 0 0;
        }
        .vxe-checkbox + .vxe-checkbox {
          margin: 0 5px 0 0;
        }
      }
      .vxe-checkbox-group {
        line-height: 24px;
      }
    }
  }
  .btn-group {
    text-align: right;
    padding: 0 20px;
    .vxe-button {
      border-radius: 6px;
    }
  }
}
</style>
